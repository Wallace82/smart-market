CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. PLANOS (Catálogo SaaS)
-- ==========================================
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL,
    max_offers INT NOT NULL,
    max_push_notifications INT NOT NULL,
    allow_customer_preferences BOOLEAN NOT NULL DEFAULT FALSE,
    trial_days INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_plans_price CHECK (price >= 0),
    CONSTRAINT chk_plans_cycle CHECK (billing_cycle IN ('monthly', 'semiannual', 'annual')),
    CONSTRAINT chk_plans_limits CHECK (max_offers >= 0 AND max_push_notifications >= 0),
    CONSTRAINT chk_plans_trial CHECK (trial_days >= 0)
);

-- ==========================================
-- 2. ASSINATURAS (Vínculo Loja x Plano)
-- ==========================================
-- Nota Arquitetural: supermarket_id não possui FK forte pois o domínio Supermarket 
-- reside em outro microserviço e banco de dados (database-per-service).
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supermarket_id UUID NOT NULL, 
    plan_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    renewal_date TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_sub_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE RESTRICT,
    CONSTRAINT chk_sub_status CHECK (status IN ('active', 'pending', 'canceled', 'expired', 'trialing'))
);

-- Índice para consultas por loja
CREATE INDEX idx_sub_supermarket ON subscriptions(supermarket_id);

-- Índice único condicional: Evita 2 assinaturas ativas para a mesma loja
CREATE UNIQUE INDEX idx_unique_active_sub 
ON subscriptions(supermarket_id) 
WHERE status IN ('active', 'trialing');

-- Índice para Workers de renovação de assinaturas
CREATE INDEX idx_sub_status_renewal ON subscriptions(status, renewal_date);

-- ==========================================
-- 3. PAGAMENTOS (Faturas / Transações)
-- ==========================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_payment_sub FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    CONSTRAINT chk_payment_amount CHECK (amount >= 0),
    CONSTRAINT chk_payment_method CHECK (payment_method IN ('pix', 'credit_card', 'boleto')),
    CONSTRAINT chk_payment_status CHECK (status IN ('paid', 'pending', 'failed', 'refunded'))
);

CREATE INDEX idx_payment_transaction ON payments(transaction_id);
CREATE INDEX idx_payment_status ON payments(status);

-- ==========================================
-- 4. USO DO PLANO (Limites e Cotas)
-- ==========================================
CREATE TABLE plan_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL,
    reference_month DATE NOT NULL,
    offers_used INT NOT NULL DEFAULT 0,
    push_notifications_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_usage_sub FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    CONSTRAINT chk_usage_offers CHECK (offers_used >= 0),
    CONSTRAINT chk_usage_pushes CHECK (push_notifications_used >= 0),
    CONSTRAINT uq_sub_month UNIQUE (subscription_id, reference_month)
);

CREATE INDEX idx_usage_lookup ON plan_usage(subscription_id, reference_month);

-- ==========================================
-- 5. HISTÓRICO DE ASSINATURA (Auditoria SaaS)
-- ==========================================
CREATE TABLE subscription_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL,
    old_plan_id UUID,
    new_plan_id UUID,
    action VARCHAR(50) NOT NULL,
    reason TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_hist_sub FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    CONSTRAINT fk_hist_oldplan FOREIGN KEY (old_plan_id) REFERENCES plans(id) ON DELETE SET NULL,
    CONSTRAINT fk_hist_newplan FOREIGN KEY (new_plan_id) REFERENCES plans(id) ON DELETE SET NULL,
    CONSTRAINT chk_hist_action CHECK (action IN ('created', 'upgraded', 'downgraded', 'canceled', 'renewed', 'expired'))
);

CREATE INDEX idx_history_sub ON subscription_history(subscription_id);
