package com.logimatch.controller;

import com.logimatch.dto.offer.OfferCreateRequest;
import com.logimatch.dto.offer.OfferResponse;
import com.logimatch.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    /**
     * Crée une offre avec upload obligatoire du document d'assurance.
     * Content-Type: multipart/form-data
     * Parts:
     *   - data  : JSON de l'offre (OfferCreateRequest)
     *   - insurance : fichier PDF/image (obligatoire)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OfferResponse> createOffer(
            @RequestPart("data") @Valid OfferCreateRequest request,
            @RequestPart("insurance") MultipartFile insuranceFile,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(offerService.createOffer(auth.getName(), request, insuranceFile));
    }

    @GetMapping
    public ResponseEntity<List<OfferResponse>> getOffers(Authentication auth) {
        return ResponseEntity.ok(offerService.getOffers(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferResponse> getOffer(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(offerService.getOffer(auth.getName(), id));
    }

    /** Télécharger/visualiser le document d'assurance d'une offre. */
    @GetMapping("/{id}/insurance")
    public ResponseEntity<Resource> downloadInsurance(@PathVariable Long id, Authentication auth)
            throws IOException {
        Path filePath = offerService.getInsuranceFile(auth.getName(), id);
        Resource resource = new PathResource(filePath);
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;

        String filename = filePath.getFileName().toString();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + filename + "\"")
                .body(resource);
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
