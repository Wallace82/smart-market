-- ============================================================
-- SmartMarket — client-service schema
-- V1: Tabelas de clientes, locais favoritos e preferências
-- ============================================================

-- Tabela de clientes (espelho lógico do auth-service)
CREATE TABLE clientes (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id      UUID NOT NULL UNIQUE,        -- referência lógica ao auth-service
    nome              VARCHAR(255),
    cpf               VARCHAR(11) UNIQUE,
    telefone          VARCHAR(20),
    status            VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    criado_em         TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em     TIMESTAMP
);

-- Locais favoritos do cliente (com raio personalizado por local)
CREATE TABLE cliente_locais (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_auth_id   UUID NOT NULL,               -- vincula ao auth_user_id (sem FK inter-serviço)
    apelido           VARCHAR(100) NOT NULL,        -- "Casa", "Trabalho", "Casa da Sogra", etc.
    endereco          VARCHAR(512) NOT NULL,
    cep               VARCHAR(10),
    bairro            VARCHAR(100),
    cidade            VARCHAR(100),
    estado            VARCHAR(2),
    latitude          DOUBLE PRECISION,
    longitude         DOUBLE PRECISION,
    raio_km           INTEGER NOT NULL DEFAULT 10,  -- raio de busca personalizado por local (em km)
    ativo             BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em         TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em     TIMESTAMP
);

CREATE INDEX idx_cliente_locais_auth_id ON cliente_locais (cliente_auth_id);

-- Garante que apenas 1 local por cliente pode ser ativo via constraint parcial (PostgreSQL)
CREATE UNIQUE INDEX idx_cliente_local_ativo_unico
    ON cliente_locais (cliente_auth_id)
    WHERE ativo = TRUE;

-- Preferências de produto do cliente (registro completo para analytics no dashboard do supermercado)
CREATE TABLE cliente_preferencias_produto (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_auth_id   UUID NOT NULL,
    produto_base_id   UUID,                         -- referência lógica ao product-service
    nome_produto      VARCHAR(255) NOT NULL,
    categoria_id      UUID,
    categoria_nome    VARCHAR(100),
    marca             VARCHAR(100),
    unidade_medida    VARCHAR(30),
    url_imagem        VARCHAR(512),
    criado_em         TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (cliente_auth_id, produto_base_id)      -- evita duplicatas por cliente
);

CREATE INDEX idx_cliente_preferencias_auth_id ON cliente_preferencias_produto (cliente_auth_id);
CREATE INDEX idx_cliente_preferencias_produto_id ON cliente_preferencias_produto (produto_base_id);
CREATE INDEX idx_cliente_preferencias_categoria ON cliente_preferencias_produto (categoria_id);
