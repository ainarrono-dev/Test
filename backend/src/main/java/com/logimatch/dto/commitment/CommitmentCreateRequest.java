package com.logimatch.dto.commitment;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CommitmentCreateRequest(
    @NotNull Long requestId,
    @NotNull Long offerId,
    @Min(1) int quantity
) {}
