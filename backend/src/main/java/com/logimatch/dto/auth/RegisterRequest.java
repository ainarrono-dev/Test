package com.logimatch.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
    @NotBlank String companyName,
    @Email @NotBlank String email,
    @NotBlank String password
) {}
