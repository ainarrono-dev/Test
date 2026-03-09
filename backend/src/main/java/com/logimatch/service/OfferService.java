package com.logimatch.service;

import com.logimatch.domain.*;
import com.logimatch.dto.offer.OfferCreateRequest;
import com.logimatch.dto.offer.OfferResponse;
import com.logimatch.repository.OfferRepository;
import com.logimatch.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class OfferService {

    private final OfferRepository offerRepository;
    private final UserAccountRepository userAccountRepository;
    private final ScoringService scoringService;

    public OfferService(OfferRepository offerRepository,
                        UserAccountRepository userAccountRepository,
                        ScoringService scoringService) {
        this.offerRepository = offerRepository;
        this.userAccountRepository = userAccountRepository;
        this.scoringService = scoringService;
    }

    public OfferResponse createOffer(String email, OfferCreateRequest request) {
        UserAccount user = getUser(email);
        if (!user.isValidated()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account not validated");
        if (user.isSuspended()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account suspended");
        if (!user.getSubscriptionPlan().isCanCreate())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Plan does not allow creating offers");

        long activeOffers = offerRepository.countByOwnerAndStatus(user, Offer.Status.ACTIVE);
        if (activeOffers >= user.getSubscriptionPlan().getMaxActiveOffers())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Active offer quota exceeded");

        Offer offer = Offer.builder()
                .owner(user)
                .resourceType("TRANSPORT")
                .startDatetime(request.startDatetime())
                .endDatetime(request.endDatetime())
                .quantityAvailable(request.quantityAvailable())
                .status(Offer.Status.ACTIVE)
                .build();

        OfferTransportDetail detail = OfferTransportDetail.builder()
                .offer(offer)
                .vehicleCategory(request.vehicleCategory())
                .maxLoadTons(request.maxLoadTons())
                .volumeM3(request.volumeM3())
                .lengthM(request.lengthM())
                .withDriver(request.withDriver())
                .build();
        offer.setTransportDetail(detail);
        offer = offerRepository.save(offer);
        return toResponse(offer, false);
    }

    @Transactional(readOnly = true)
    public List<OfferResponse> getOffers(String email) {
        UserAccount caller = getUser(email);
        boolean maskDetails = !caller.getSubscriptionPlan().isCanCreate();
        return offerRepository.findAll().stream()
                .sorted(Comparator.comparingDouble((Offer o) ->
                        scoringService.calculateVisibilityScore(o.getOwner())).reversed())
                .map(o -> toResponse(o, maskDetails))
                .toList();
    }

    @Transactional(readOnly = true)
    public OfferResponse getOffer(String email, Long id) {
        UserAccount caller = getUser(email);
        boolean maskDetails = !caller.getSubscriptionPlan().isCanCreate();
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));
        return toResponse(offer, maskDetails);
    }

    public OfferResponse closeOffer(String email, Long id) {
        Offer offer = getOwnedOffer(email, id);
        offer.setStatus(Offer.Status.CLOSED);
        return toResponse(offerRepository.save(offer), false);
    }

    public OfferResponse cancelOffer(String email, Long id) {
        Offer offer = getOwnedOffer(email, id);
        offer.setStatus(Offer.Status.CANCELLED);
        return toResponse(offerRepository.save(offer), false);
    }

    private Offer getOwnedOffer(String email, Long id) {
        UserAccount user = getUser(email);
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));
        if (!offer.getOwner().getId().equals(user.getId()) && user.getRole() != UserAccount.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your offer");
        }
        return offer;
    }

    private UserAccount getUser(String email) {
        return userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private OfferResponse toResponse(Offer offer, boolean maskDetails) {
        OfferTransportDetail detail = offer.getTransportDetail();
        double visScore = scoringService.calculateVisibilityScore(offer.getOwner());
        if (maskDetails || detail == null) {
            return new OfferResponse(offer.getId(), offer.getOwner().getId(),
                    offer.getOwner().getCompanyName(), offer.getResourceType(),
                    offer.getStartDatetime(), offer.getEndDatetime(), offer.getQuantityAvailable(),
                    offer.getStatus().name(), offer.getCreatedAt(),
                    null, null, null, null, null, visScore);
        }
        return new OfferResponse(offer.getId(), offer.getOwner().getId(),
                offer.getOwner().getCompanyName(), offer.getResourceType(),
                offer.getStartDatetime(), offer.getEndDatetime(), offer.getQuantityAvailable(),
                offer.getStatus().name(), offer.getCreatedAt(),
                detail.getVehicleCategory(), detail.getMaxLoadTons(), detail.getVolumeM3(),
                detail.getLengthM(), detail.isWithDriver(), visScore);
    }
}
