package com.logimatch.controller;

import com.logimatch.dto.commitment.CommitmentCreateRequest;
import com.logimatch.dto.commitment.CommitmentResponse;
import com.logimatch.service.CommitmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/commitments")
public class CommitmentController {

    private final CommitmentService commitmentService;

    public CommitmentController(CommitmentService commitmentService) {
        this.commitmentService = commitmentService;
    }

    @PostMapping
    public ResponseEntity<CommitmentResponse> createCommitment(@Valid @RequestBody CommitmentCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commitmentService.createCommitment(request));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<CommitmentResponse> cancelCommitment(@PathVariable Long id,
                                                                @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(commitmentService.cancelCommitment(id, reason));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<CommitmentResponse> completeCommitment(@PathVariable Long id) {
        return ResponseEntity.ok(commitmentService.completeCommitment(id));
    }
}
