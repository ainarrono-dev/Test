package com.logimatch.controller;

import com.logimatch.domain.AdminAction;
import com.logimatch.dto.admin.ReliabilityUpdateRequest;
import com.logimatch.dto.admin.UserAdminResponse;
import com.logimatch.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserAdminResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @PostMapping("/users/{id}/validate")
    public ResponseEntity<UserAdminResponse> validateUser(@PathVariable Long id,
                                                           @RequestParam(required = false) String reason,
                                                           Authentication auth) {
        return ResponseEntity.ok(adminService.validateUser(auth.getName(), id, reason));
    }

    @PostMapping("/users/{id}/suspend")
    public ResponseEntity<UserAdminResponse> suspendUser(@PathVariable Long id,
                                                          @RequestParam(required = false) String reason,
                                                          Authentication auth) {
        return ResponseEntity.ok(adminService.suspendUser(auth.getName(), id, reason));
    }

    @PostMapping("/users/{id}/reliability")
    public ResponseEntity<UserAdminResponse> updateReliability(@PathVariable Long id,
                                                                @Valid @RequestBody ReliabilityUpdateRequest request,
                                                                Authentication auth) {
        return ResponseEntity.ok(adminService.updateReliability(auth.getName(), id, request.score()));
    }

    @GetMapping("/actions")
    public ResponseEntity<List<AdminAction>> getActions() {
        return ResponseEntity.ok(adminService.getActions());
    }
}
