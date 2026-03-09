package com.logimatch.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transport_request")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransportRequest {

    public enum Status { OPEN, PARTIAL, FULL, CLOSED }

    public enum MatchingMode {
        /** L'admin recherche et affecte la bonne offre pour l'utilisateur. */
        OUTSOURCED,
        /** Le système affiche les offres compatibles ; l'utilisateur sélectionne lui-même. */
        SELF_SERVE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requester_id", nullable = false)
    private UserAccount requester;

    @Column(name = "resource_type", nullable = false, length = 20)
    private String resourceType;

    @Column(name = "start_datetime", nullable = false)
    private LocalDateTime startDatetime;

    @Column(name = "end_datetime", nullable = false)
    private LocalDateTime endDatetime;

    @Column(name = "quantity_max", nullable = false)
    private int quantityMax;

    @Column(name = "quantity_committed", nullable = false)
    private int quantityCommitted;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "matching_mode", nullable = false, length = 20)
    private MatchingMode matchingMode;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "request", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private RequestTransportDetail transportDetail;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = Status.OPEN;
        if (matchingMode == null) matchingMode = MatchingMode.SELF_SERVE;
        if (resourceType == null) resourceType = "TRANSPORT";
    }
}
