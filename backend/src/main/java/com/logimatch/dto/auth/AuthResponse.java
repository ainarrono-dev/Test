package com.logimatch.dto.auth;

public record AuthResponse(
    String token,
    Long userId,
    String email,
    String role,
    String companyName,
    boolean validated
) {}
