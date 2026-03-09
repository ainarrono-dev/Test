package com.logimatch.dto.commitment;

import java.time.LocalDateTime;

public record CommitmentResponse(
    Long id,
    Long requestId,
    Long offerId,
    int quantity,
    String status,
    String cancelReason,
    LocalDateTime createdAt
) {}
