package com.logimatch.service;

import com.logimatch.domain.UserAccount;
import org.springframework.stereotype.Service;

@Service
public class ScoringService {

    public double calculateVisibilityScore(UserAccount user) {
        int baseScore = user.getSubscriptionPlan().getBaseVisibilityScore();
        int reliabilityScore = user.getReliabilityScore();
        return baseScore * 0.6 + reliabilityScore * 0.4;
    }
}
