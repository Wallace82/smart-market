-- Criação das tabelas de Billing
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

-- Inserção dos Planos Definidos no REQUIREMENTS.md
INSERT INTO planos (id, nome, limite_ofertas_mensais, limite_encartes_ativos, raio_atuacao_km, limite_notificacoes_mensais, possui_concierge, concierge_uploads_mensais, sla_atendimento_horas, prioridade_fila, preco_mensal, preco_semestral, preco_anual) VALUES
('b1111111-1111-1111-1111-111111111111', 'STARTER', 30, 1, 3, 0, FALSE, 0, 6, 'BAIXA', 49.00, 264.00, 470.00),
('b2222222-2222-2222-2222-222222222222', 'ESSENCIAL', 100, 3, 5, 200, FALSE, 0, 4, 'NORMAL', 129.00, 696.00, 1240.00),
('b3333333-3333-3333-3333-333333333333', 'PRO', 300, 999, 10, 1000, TRUE, 2, 3, 'ALTA', 299.00, 1620.00, 2880.00),
('b4444444-4444-4444-4444-444444444444', 'PREMIUM', 999999, 999, 99, 999999, TRUE, 99, 1, 'MAXIMA', 699.00, 3780.00, 6700.00)
ON CONFLICT (nome) DO NOTHING;
