-- V1__create_concierge_tables.sql
-- Descrição: Criação da estrutura de dados para o módulo Concierge (Operação Assistida)

CREATE TABLE solicitacoes_concierge (
    id UUID PRIMARY KEY,
    supermercado_id UUID NOT NULL,
    atendente_id UUID,
    titulo VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
    sla_definido_horas INTEGER NOT NULL DEFAULT 3,
    prioridade_score NUMERIC(10, 4) DEFAULT 0,
    complexidade INTEGER DEFAULT 1,
    plano_cliente VARCHAR(50) DEFAULT 'BASICO',
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_inicio_processamento TIMESTAMP,
    data_conclusao TIMESTAMP,
    lock_at TIMESTAMP,
    url_arquivo_original VARCHAR(1024),
    observacoes TEXT
);

CREATE TABLE anexos_concierge (
    id UUID PRIMARY KEY,
    solicitacao_id UUID NOT NULL REFERENCES solicitacoes_concierge(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    url_minio VARCHAR(1024) NOT NULL,
    tipo_mime VARCHAR(100),
    tamanho_bytes BIGINT,
    data_upload TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auditoria_concierge (
    id UUID PRIMARY KEY,
    solicitacao_id UUID NOT NULL REFERENCES solicitacoes_concierge(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL,
    acao VARCHAR(100) NOT NULL,
    status_de VARCHAR(50),
    status_para VARCHAR(50),
    detalhes TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimização de consultas da fila e filtros
CREATE INDEX idx_solicitacao_supermercado ON solicitacoes_concierge(supermercado_id);
CREATE INDEX idx_solicitacao_status ON solicitacoes_concierge(status);
CREATE INDEX idx_solicitacao_atendente ON solicitacoes_concierge(atendente_id);

-- Comentários para documentação de banco
COMMENT ON TABLE solicitacoes_concierge IS 'Armazena as solicitações de cadastro de ofertas feitas pelos supermercados';
COMMENT ON COLUMN solicitacoes_concierge.status IS 'Estados: PENDENTE, EM_PROCESSAMENTO, AGUARDANDO_APROVACAO, APROVADO, REJEITADO, PUBLICADO';
COMMENT ON TABLE anexos_concierge IS 'Arquivos enviados pelos supermercados (Excel, Imagens, etc) vinculados à solicitação';
COMMENT ON TABLE auditoria_concierge IS 'Log detalhado de todas as mudanças de estado e ações tomadas na solicitação';
