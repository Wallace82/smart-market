CREATE TABLE notification_subscriptions (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL,
    endpoint TEXT NOT NULL UNIQUE,
    auth_key VARCHAR(255) NOT NULL,
    p256dh_key VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_history (
    id UUID PRIMARY KEY,
    campaign_id UUID NOT NULL,
    client_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    block_reason VARCHAR(100) DEFAULT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    message_hash VARCHAR(64) NOT NULL,
    deep_link VARCHAR(255) DEFAULT NULL
);

CREATE INDEX idx_sub_client ON notification_subscriptions(client_id);
CREATE INDEX idx_history_client ON notification_history(client_id);
CREATE INDEX idx_history_campaign ON notification_history(campaign_id);
CREATE INDEX idx_history_hash ON notification_history(message_hash);
