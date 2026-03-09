package com.logimatch.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RequestResponse(
    Long id,
    Long requesterId,
    String requesterCompanyName,
    String resourceType,
    LocalDateTime startDatetime,
    LocalDateTime endDatetime,
    int quantityMax,
    int quantityCommitted,
    String status,
    /** OUTSOURCED ou SELF_SERVE */
    String matchingMode,
    LocalDateTime createdAt,
    String requiredVehicleCategory,
    BigDecimal minLoadTons,
    Boolean withDriver,
    double visibilityScore
) {}
