package com.logimatch.dto.admin;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record ReliabilityUpdateRequest(
    @Min(0) @Max(100) int score
) {}
