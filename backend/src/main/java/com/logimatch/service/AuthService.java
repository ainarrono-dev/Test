package com.logimatch.service;

import com.logimatch.domain.SubscriptionPlan;
import com.logimatch.domain.UserAccount;
import com.logimatch.dto.auth.AuthResponse;
import com.logimatch.dto.auth.LoginRequest;
import com.logimatch.dto.auth.RegisterRequest;
import com.logimatch.repository.SubscriptionPlanRepository;
import com.logimatch.repository.UserAccountRepository;
import com.logimatch.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserAccountRepository userAccountRepository,
                       SubscriptionPlanRepository subscriptionPlanRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userAccountRepository = userAccountRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userAccountRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use");
        }
        SubscriptionPlan freePlan = subscriptionPlanRepository.findByName("FREE")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "FREE plan not found"));

        UserAccount user = UserAccount.builder()
                .role(UserAccount.Role.COMPANY)
                .companyName(request.companyName())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .validated(false)
                .suspended(false)
                .reliabilityScore(50)
                .subscriptionPlan(freePlan)
                .build();
        user = userAccountRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail(), List.of(user.getRole().name()));
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(),
                user.getCompanyName(), user.isValidated());
    }

    public AuthResponse login(LoginRequest request) {
        UserAccount user = userAccountRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        if (user.isSuspended()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account suspended");
        }
        String token = jwtTokenProvider.generateToken(user.getEmail(), List.of(user.getRole().name()));
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(),
                user.getCompanyName(), user.isValidated());
    }
}
