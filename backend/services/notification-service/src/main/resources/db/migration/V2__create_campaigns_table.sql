CREATE TABLE campaigns (
    id UUID PRIMARY KEY,
    supermarket_id UUID NOT NULL,
    title VARCHAR(120) NOT NULL,
    message VARCHAR(500) NOT NULL,
    radius_meters INT NOT NULL,
    daily_limit_per_client INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
    target_type VARCHAR(20) DEFAULT NULL,
    target_reference_id UUID DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaign_supermarket ON campaigns(supermarket_id);
CREATE INDEX idx_campaign_status ON campaigns(status);
