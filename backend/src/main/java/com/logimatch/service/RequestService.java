package com.logimatch.service;

import com.logimatch.domain.*;
import com.logimatch.dto.request.RequestCreateRequest;
import com.logimatch.dto.request.RequestResponse;
import com.logimatch.repository.TransportRequestRepository;
import com.logimatch.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class RequestService {

    private final TransportRequestRepository requestRepository;
    private final UserAccountRepository userAccountRepository;
    private final ScoringService scoringService;

    public RequestService(TransportRequestRepository requestRepository,
                          UserAccountRepository userAccountRepository,
                          ScoringService scoringService) {
        this.requestRepository = requestRepository;
        this.userAccountRepository = userAccountRepository;
        this.scoringService = scoringService;
    }

    public RequestResponse createRequest(String email, RequestCreateRequest req) {
        UserAccount user = getUser(email);
        if (!user.isValidated()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account not validated");
        if (user.isSuspended()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account suspended");
        if (!user.getSubscriptionPlan().isCanCreate())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Plan does not allow creating requests");

        long openCount = requestRepository.countByRequesterAndStatusIn(user,
                List.of(TransportRequest.Status.OPEN, TransportRequest.Status.PARTIAL));
        if (openCount >= user.getSubscriptionPlan().getMaxOpenRequests())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Open request quota exceeded");

        TransportRequest request = TransportRequest.builder()
                .requester(user)
                .resourceType("TRANSPORT")
                .startDatetime(req.startDatetime())
                .endDatetime(req.endDatetime())
                .quantityMax(req.quantityMax())
                .quantityCommitted(0)
                .status(TransportRequest.Status.OPEN)
                .matchingMode(parseMatchingMode(req.matchingMode()))
                .build();

        RequestTransportDetail detail = RequestTransportDetail.builder()
                .request(request)
                .requiredVehicleCategory(req.requiredVehicleCategory())
                .minLoadTons(req.minLoadTons())
                .withDriver(req.withDriver())
                .build();
        request.setTransportDetail(detail);
        request = requestRepository.save(request);
        return toResponse(request, false);
    }

    @Transactional(readOnly = true)
    public List<RequestResponse> getRequests(String email) {
        UserAccount caller = getUser(email);
        boolean maskDetails = !caller.getSubscriptionPlan().isCanCreate();
        return requestRepository.findAll().stream()
                .sorted(Comparator.comparingDouble((TransportRequest r) ->
                        scoringService.calculateVisibilityScore(r.getRequester())).reversed())
                .map(r -> toResponse(r, maskDetails))
                .toList();
    }

    @Transactional(readOnly = true)
    public RequestResponse getRequest(String email, Long id) {
        UserAccount caller = getUser(email);
        boolean maskDetails = !caller.getSubscriptionPlan().isCanCreate();
        TransportRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        return toResponse(request, maskDetails);
    }

    private UserAccount getUser(String email) {
        return userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private TransportRequest.MatchingMode parseMatchingMode(String value) {
        try {
            return value != null ? TransportRequest.MatchingMode.valueOf(value.toUpperCase()) : TransportRequest.MatchingMode.SELF_SERVE;
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "matchingMode must be OUTSOURCED or SELF_SERVE");
        }
    }

    private RequestResponse toResponse(TransportRequest r, boolean maskDetails) {
        RequestTransportDetail detail = r.getTransportDetail();
        double visScore = scoringService.calculateVisibilityScore(r.getRequester());
        String mode = r.getMatchingMode() != null ? r.getMatchingMode().name() : "SELF_SERVE";
        if (maskDetails || detail == null) {
            return new RequestResponse(r.getId(), r.getRequester().getId(),
                    r.getRequester().getCompanyName(), r.getResourceType(),
                    r.getStartDatetime(), r.getEndDatetime(), r.getQuantityMax(),
                    r.getQuantityCommitted(), r.getStatus().name(), mode, r.getCreatedAt(),
                    null, null, null, visScore);
        }
        return new RequestResponse(r.getId(), r.getRequester().getId(),
                r.getRequester().getCompanyName(), r.getResourceType(),
                r.getStartDatetime(), r.getEndDatetime(), r.getQuantityMax(),
                r.getQuantityCommitted(), r.getStatus().name(), mode, r.getCreatedAt(),
                detail.getRequiredVehicleCategory(), detail.getMinLoadTons(), detail.isWithDriver(), visScore);
    }
}
