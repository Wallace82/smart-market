-- Criação das tabelas de Billing (Português para o novo CRUD de Planos)
CREATE TABLE IF NOT EXISTS planos (
    id UUID PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    limite_ofertas_mensais INTEGER,
    limite_encartes_ativos INTEGER,
    raio_atuacao_km INTEGER,
    limite_notificacoes_mensais INTEGER,
    possui_concierge BOOLEAN NOT NULL DEFAULT FALSE,
    concierge_uploads_mensais INTEGER,
    sla_atendimento_horas INTEGER,
    prioridade_fila VARCHAR(20),
    preco_mensal NUMERIC(10, 2) NOT NULL,
    preco_semestral NUMERIC(10, 2) NOT NULL,
    preco_anual NUMERIC(10, 2) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS assinaturas (
    id UUID PRIMARY KEY,
    supermercado_id UUID NOT NULL,
    plano_id UUID NOT NULL REFERENCES planos(id),
    ciclo VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE,
    renovacao_automatica BOOLEAN NOT NULL DEFAULT TRUE
);

-- Inserção dos Planos Definidos no REQUIREMENTS.md (Português)
INSERT INTO planos (id, nome, limite_ofertas_mensais, limite_encartes_ativos, raio_atuacao_km, limite_notificacoes_mensais, possui_concierge, concierge_uploads_mensais, sla_atendimento_horas, prioridade_fila, preco_mensal, preco_semestral, preco_anual) VALUES
('b1111111-1111-1111-1111-111111111111', 'STARTER', 30, 1, 3, 0, FALSE, 0, 6, 'BAIXA', 49.00, 264.00, 470.00),
('b2222222-2222-2222-2222-222222222222', 'ESSENCIAL', 100, 3, 5, 200, FALSE, 0, 4, 'NORMAL', 129.00, 696.00, 1240.00),
('b3333333-3333-3333-3333-333333333333', 'PRO', 300, 999, 10, 1000, TRUE, 2, 3, 'ALTA', 299.00, 1620.00, 2880.00),
('b4444444-4444-4444-4444-444444444444', 'PREMIUM', 999999, 999, 99, 999999, TRUE, 99, 1, 'MAXIMA', 699.00, 3780.00, 6700.00)
ON CONFLICT (nome) DO NOTHING;

-- Criação das tabelas de Billing (Inglês para compatibilidade com Dashboard e Assinaturas existentes)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS plans (
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

CREATE TABLE IF NOT EXISTS subscriptions (
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

CREATE INDEX IF NOT EXISTS idx_sub_supermarket ON subscriptions(supermarket_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_sub 
ON subscriptions(supermarket_id) 
WHERE status IN ('active', 'trialing');

CREATE INDEX IF NOT EXISTS idx_sub_status_renewal ON subscriptions(status, renewal_date);

CREATE TABLE IF NOT EXISTS payments (
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

CREATE INDEX IF NOT EXISTS idx_payment_transaction ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payments(status);

CREATE TABLE IF NOT EXISTS plan_usage (
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

CREATE INDEX IF NOT EXISTS idx_usage_lookup ON plan_usage(subscription_id, reference_month);

CREATE TABLE IF NOT EXISTS subscription_history (
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

CREATE INDEX IF NOT EXISTS idx_history_sub ON subscription_history(subscription_id);

-- Seedar planos em inglês para retrocompatibilidade
INSERT INTO plans (id, name, description, price, billing_cycle, max_offers, max_push_notifications, allow_customer_preferences, trial_days, active) VALUES
('b1111111-1111-1111-1111-111111111111', 'STARTER', 'Starter Plan', 49.00, 'monthly', 30, 0, FALSE, 0, TRUE),
('b2222222-2222-2222-2222-222222222222', 'ESSENCIAL', 'Essencial Plan', 129.00, 'monthly', 100, 200, FALSE, 0, TRUE),
('b3333333-3333-3333-3333-333333333333', 'PRO', 'Pro Plan', 299.00, 'monthly', 300, 1000, TRUE, 0, TRUE),
('b4444444-4444-4444-4444-444444444444', 'PREMIUM', 'Premium Plan', 699.00, 'monthly', 999999, 999999, TRUE, 0, TRUE)
ON CONFLICT (id) DO NOTHING;

