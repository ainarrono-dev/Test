package com.logimatch.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "request_transport_detail")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RequestTransportDetail {

    @Id
    private Long requestId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "request_id")
    private TransportRequest request;

    @Column(name = "required_vehicle_category", length = 50)
    private String requiredVehicleCategory;

    @Column(name = "min_load_tons", precision = 10, scale = 2)
    private BigDecimal minLoadTons;

    @Column(name = "with_driver", nullable = false)
    private boolean withDriver;
}
