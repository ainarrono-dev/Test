package com.logimatch.controller;

import com.logimatch.dto.offer.OfferCreateRequest;
import com.logimatch.dto.offer.OfferResponse;
import com.logimatch.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping
    public ResponseEntity<OfferResponse> createOffer(@Valid @RequestBody OfferCreateRequest request,
                                                      Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(offerService.createOffer(auth.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<OfferResponse>> getOffers(Authentication auth) {
        return ResponseEntity.ok(offerService.getOffers(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferResponse> getOffer(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(offerService.getOffer(auth.getName(), id));
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<OfferResponse> closeOffer(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(offerService.closeOffer(auth.getName(), id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<OfferResponse> cancelOffer(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(offerService.cancelOffer(auth.getName(), id));
    }
}
