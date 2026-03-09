package com.logimatch.dto.auth;

public record AuthResponse(
    String token,
    UserInfo user
) {
    public record UserInfo(
        Long id,
        String email,
        String role,
        String companyName,
        boolean validated,
        boolean suspended,
        int reliabilityScore,
        String subscriptionPlanName
    ) {}
}
