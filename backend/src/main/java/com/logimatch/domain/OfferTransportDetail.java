package com.logimatch.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "offer_transport_detail")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OfferTransportDetail {

    @Id
    private Long offerId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "offer_id")
    private Offer offer;

    @Column(name = "vehicle_category", length = 50)
    private String vehicleCategory;

    @Column(name = "max_load_tons", precision = 10, scale = 2)
    private BigDecimal maxLoadTons;

    @Column(name = "volume_m3", precision = 10, scale = 2)
    private BigDecimal volumeM3;

    @Column(name = "length_m", precision = 10, scale = 2)
    private BigDecimal lengthM;

    @Column(name = "with_driver", nullable = false)
    private boolean withDriver;
}
