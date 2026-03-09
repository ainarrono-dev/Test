package com.logimatch.service;

import com.logimatch.domain.AdminAction;
import com.logimatch.domain.UserAccount;
import com.logimatch.dto.admin.UserAdminResponse;
import com.logimatch.repository.AdminActionRepository;
import com.logimatch.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class AdminService {

    private final UserAccountRepository userAccountRepository;
    private final AdminActionRepository adminActionRepository;

    public AdminService(UserAccountRepository userAccountRepository,
                        AdminActionRepository adminActionRepository) {
        this.userAccountRepository = userAccountRepository;
        this.adminActionRepository = adminActionRepository;
    }

    @Transactional(readOnly = true)
    public List<UserAdminResponse> getUsers() {
        return userAccountRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserAdminResponse validateUser(String adminEmail, Long userId, String reason) {
        UserAccount admin = getUser(adminEmail);
        UserAccount target = getUser(userId);
        target.setValidated(true);
        userAccountRepository.save(target);
        logAction(admin, target, "VALIDATE", reason);
        return toResponse(target);
    }

    public UserAdminResponse suspendUser(String adminEmail, Long userId, String reason) {
        UserAccount admin = getUser(adminEmail);
        UserAccount target = getUser(userId);
        target.setSuspended(true);
        userAccountRepository.save(target);
        logAction(admin, target, "SUSPEND", reason);
        return toResponse(target);
    }

    public UserAdminResponse updateReliability(String adminEmail, Long userId, int score) {
        UserAccount admin = getUser(adminEmail);
        UserAccount target = getUser(userId);
        target.setReliabilityScore(Math.max(0, Math.min(100, score)));
        userAccountRepository.save(target);
        logAction(admin, target, "UPDATE_RELIABILITY", "Score set to " + score);
        return toResponse(target);
    }

    @Transactional(readOnly = true)
    public List<AdminAction> getActions() {
        return adminActionRepository.findAll();
    }

    private void logAction(UserAccount admin, UserAccount target, String actionType, String reason) {
        AdminAction action = AdminAction.builder()
                .admin(admin)
                .targetUser(target)
                .actionType(actionType)
                .reason(reason)
                .build();
        adminActionRepository.save(action);
    }

    private UserAccount getUser(String email) {
        return userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private UserAccount getUser(Long id) {
        return userAccountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private UserAdminResponse toResponse(UserAccount u) {
        return new UserAdminResponse(u.getId(), u.getRole().name(), u.getCompanyName(), u.getEmail(),
                u.isValidated(), u.isSuspended(), u.getReliabilityScore(),
                u.getSubscriptionPlan() != null ? u.getSubscriptionPlan().getName() : null,
                u.getCreatedAt());
    }
}
