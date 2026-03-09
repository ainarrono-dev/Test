package com.logimatch.dto.offer;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OfferResponse(
    Long id,
    Long ownerId,
    String ownerCompanyName,
    String resourceType,
    LocalDateTime startDatetime,
    LocalDateTime endDatetime,
    int quantityAvailable,
    String status,
    LocalDateTime createdAt,
    String vehicleCategory,
    BigDecimal maxLoadTons,
    BigDecimal volumeM3,
    BigDecimal lengthM,
    Boolean withDriver,
    double visibilityScore
) {}
