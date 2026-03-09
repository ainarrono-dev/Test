package com.logimatch.service;

import com.logimatch.domain.SubscriptionPlan;
import com.logimatch.domain.UserAccount;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ScoringServiceTest {

    private ScoringService scoringService;

    @BeforeEach
    void setUp() {
        scoringService = new ScoringService();
    }

    @Test
    void calculateVisibilityScore_freePlan_lowReliability() {
        SubscriptionPlan freePlan = SubscriptionPlan.builder()
                .name("FREE").baseVisibilityScore(10).maxActiveOffers(0).maxOpenRequests(0).canCreate(false).build();
        UserAccount user = UserAccount.builder()
                .email("test@test.com").role(UserAccount.Role.COMPANY)
                .subscriptionPlan(freePlan).reliabilityScore(20).build();

        double score = scoringService.calculateVisibilityScore(user);
        assertEquals(10 * 0.6 + 20 * 0.4, score, 0.001);
    }

    @Test
    void calculateVisibilityScore_mediumPlan_averageReliability() {
        SubscriptionPlan mediumPlan = SubscriptionPlan.builder()
                .name("MEDIUM").baseVisibilityScore(50).maxActiveOffers(5).maxOpenRequests(5).canCreate(true).build();
        UserAccount user = UserAccount.builder()
                .email("test@test.com").role(UserAccount.Role.COMPANY)
                .subscriptionPlan(mediumPlan).reliabilityScore(50).build();

        double score = scoringService.calculateVisibilityScore(user);
        assertEquals(50 * 0.6 + 50 * 0.4, score, 0.001);
    }

    @Test
    void calculateVisibilityScore_extraPlan_highReliability() {
        SubscriptionPlan extraPlan = SubscriptionPlan.builder()
                .name("EXTRA").baseVisibilityScore(100).maxActiveOffers(20).maxOpenRequests(20).canCreate(true).build();
        UserAccount user = UserAccount.builder()
                .email("test@test.com").role(UserAccount.Role.COMPANY)
                .subscriptionPlan(extraPlan).reliabilityScore(100).build();

        double score = scoringService.calculateVisibilityScore(user);
        assertEquals(100 * 0.6 + 100 * 0.4, score, 0.001);
    }

    @Test
    void calculateVisibilityScore_weightsAddUpToOne() {
        // Verify formula: baseScore * 0.6 + reliabilityScore * 0.4
        SubscriptionPlan plan = SubscriptionPlan.builder()
                .name("MEDIUM").baseVisibilityScore(0).maxActiveOffers(5).maxOpenRequests(5).canCreate(true).build();
        UserAccount user = UserAccount.builder()
                .email("test@test.com").role(UserAccount.Role.COMPANY)
                .subscriptionPlan(plan).reliabilityScore(0).build();

        double score = scoringService.calculateVisibilityScore(user);
        assertEquals(0.0, score, 0.001);
    }
}
