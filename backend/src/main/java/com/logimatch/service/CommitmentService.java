package com.logimatch.service;

import com.logimatch.domain.*;
import com.logimatch.dto.commitment.CommitmentCreateRequest;
import com.logimatch.dto.commitment.CommitmentResponse;
import com.logimatch.repository.CommitmentRepository;
import com.logimatch.repository.OfferRepository;
import com.logimatch.repository.TransportRequestRepository;
import com.logimatch.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class CommitmentService {

    private final CommitmentRepository commitmentRepository;
    private final TransportRequestRepository requestRepository;
    private final OfferRepository offerRepository;
    private final UserAccountRepository userAccountRepository;

    public CommitmentService(CommitmentRepository commitmentRepository,
                             TransportRequestRepository requestRepository,
                             OfferRepository offerRepository,
                             UserAccountRepository userAccountRepository) {
        this.commitmentRepository = commitmentRepository;
        this.requestRepository = requestRepository;
        this.offerRepository = offerRepository;
        this.userAccountRepository = userAccountRepository;
    }

    public CommitmentResponse createCommitment(CommitmentCreateRequest req) {
        TransportRequest request = requestRepository.findById(req.requestId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        Offer offer = offerRepository.findById(req.offerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));

        int engagedQty = commitmentRepository.sumEngagedQuantityByRequest(request);
        int remaining = request.getQuantityMax() - engagedQty;
        if (req.quantity() > remaining)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity exceeds request capacity");
        if (req.quantity() > offer.getQuantityAvailable())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity exceeds offer capacity");

        Commitment commitment = Commitment.builder()
                .request(request)
                .offer(offer)
                .quantity(req.quantity())
                .status(Commitment.Status.ENGAGED)
                .build();
        commitment = commitmentRepository.save(commitment);

        int newCommitted = request.getQuantityCommitted() + req.quantity();
        request.setQuantityCommitted(newCommitted);
        if (newCommitted >= request.getQuantityMax()) {
            request.setStatus(TransportRequest.Status.FULL);
        } else {
            request.setStatus(TransportRequest.Status.PARTIAL);
        }
        requestRepository.save(request);

        return toResponse(commitment);
    }

    public CommitmentResponse cancelCommitment(Long id, String cancelReason) {
        Commitment commitment = getCommitment(id);
        commitment.setStatus(Commitment.Status.CANCELLED);
        commitment.setCancelReason(cancelReason);
        commitmentRepository.save(commitment);

        // Update requester reliability (-2)
        UserAccount requester = commitment.getRequest().getRequester();
        requester.setReliabilityScore(Math.max(0, requester.getReliabilityScore() - 2));
        userAccountRepository.save(requester);

        // Update request status
        TransportRequest request = commitment.getRequest();
        int engagedQty = commitmentRepository.sumEngagedQuantityByRequest(request);
        request.setQuantityCommitted(engagedQty);
        if (engagedQty <= 0) {
            request.setStatus(TransportRequest.Status.OPEN);
        } else if (engagedQty < request.getQuantityMax()) {
            request.setStatus(TransportRequest.Status.PARTIAL);
        }
        requestRepository.save(request);

        return toResponse(commitment);
    }

    public CommitmentResponse completeCommitment(Long id) {
        Commitment commitment = getCommitment(id);
        commitment.setStatus(Commitment.Status.COMPLETED);
        commitmentRepository.save(commitment);

        // Update reliability +1 for both parties
        UserAccount requester = commitment.getRequest().getRequester();
        UserAccount offerOwner = commitment.getOffer().getOwner();
        requester.setReliabilityScore(Math.min(100, requester.getReliabilityScore() + 1));
        offerOwner.setReliabilityScore(Math.min(100, offerOwner.getReliabilityScore() + 1));
        userAccountRepository.save(requester);
        userAccountRepository.save(offerOwner);

        return toResponse(commitment);
    }

    private Commitment getCommitment(Long id) {
        return commitmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Commitment not found"));
    }

    private CommitmentResponse toResponse(Commitment c) {
        return new CommitmentResponse(c.getId(), c.getRequest().getId(), c.getOffer().getId(),
                c.getQuantity(), c.getStatus().name(), c.getCancelReason(), c.getCreatedAt());
    }
}
