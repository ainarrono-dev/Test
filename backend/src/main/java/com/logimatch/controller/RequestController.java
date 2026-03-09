package com.logimatch.controller;

import com.logimatch.dto.request.RequestCreateRequest;
import com.logimatch.dto.request.RequestResponse;
import com.logimatch.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<RequestResponse> createRequest(@Valid @RequestBody RequestCreateRequest request,
                                                          Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(requestService.createRequest(auth.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<RequestResponse>> getRequests(Authentication auth) {
        return ResponseEntity.ok(requestService.getRequests(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse> getRequest(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(requestService.getRequest(auth.getName(), id));
    }
}
