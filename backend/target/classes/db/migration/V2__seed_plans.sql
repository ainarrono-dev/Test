INSERT INTO subscription_plan (name, max_active_offers, max_open_requests, base_visibility_score, can_create)
VALUES
    ('FREE', 0, 0, 10, FALSE),
    ('MEDIUM', 5, 5, 50, TRUE),
    ('EXTRA', 20, 20, 100, TRUE);

INSERT INTO user_account (role, company_name, email, password_hash, validated, suspended, reliability_score, subscription_plan_id, created_at)
VALUES (
    'ADMIN',
    'LogiMatch Admin',
    'admin@logimatch.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkTpkihHu.i', -- BCrypt of "admin123" (dev only)
    TRUE,
    FALSE,
    100,
    NULL,
    CURRENT_TIMESTAMP
);
