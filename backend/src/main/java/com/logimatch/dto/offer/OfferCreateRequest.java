package com.logimatch.dto.offer;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OfferCreateRequest(
    @NotNull @FutureOrPresent LocalDateTime startDatetime,
    @NotNull LocalDateTime endDatetime,
    @Min(1) int quantityAvailable,
    String vehicleCategory,
    BigDecimal maxLoadTons,
    BigDecimal volumeM3,
    BigDecimal lengthM,
    boolean withDriver
) {}
