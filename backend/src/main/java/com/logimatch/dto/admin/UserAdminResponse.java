package com.logimatch.dto.admin;

import java.time.LocalDateTime;

public record UserAdminResponse(
    Long id,
    String role,
    String companyName,
    String email,
    boolean validated,
    boolean suspended,
    int reliabilityScore,
    String subscriptionPlan,
    LocalDateTime createdAt
) {}
