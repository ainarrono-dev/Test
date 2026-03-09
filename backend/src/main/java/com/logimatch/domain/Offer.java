package com.logimatch.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "offer")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Offer {

    public enum Status { ACTIVE, CLOSED, CANCELLED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private UserAccount owner;

    @Column(name = "resource_type", nullable = false, length = 20)
    private String resourceType;

    @Column(name = "start_datetime", nullable = false)
    private LocalDateTime startDatetime;

    @Column(name = "end_datetime", nullable = false)
    private LocalDateTime endDatetime;

    @Column(name = "quantity_available", nullable = false)
    private int quantityAvailable;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "offer", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private OfferTransportDetail transportDetail;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = Status.ACTIVE;
        if (resourceType == null) resourceType = "TRANSPORT";
    }
}
