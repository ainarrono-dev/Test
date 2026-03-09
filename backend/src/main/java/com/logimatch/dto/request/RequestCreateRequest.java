package com.logimatch.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RequestCreateRequest(
    @NotNull @FutureOrPresent LocalDateTime startDatetime,
    @NotNull LocalDateTime endDatetime,
    @Min(1) int quantityMax,
    String requiredVehicleCategory,
    BigDecimal minLoadTons,
    boolean withDriver
) {}
