package com.logimatch.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscription_plan")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SubscriptionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String name;

    @Column(nullable = false)
    private int maxActiveOffers;

    @Column(nullable = false)
    private int maxOpenRequests;

    @Column(nullable = false)
    private int baseVisibilityScore;

    @Column(nullable = false)
    private boolean canCreate;
}
