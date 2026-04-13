CREATE TABLE supermercados (
    id UUID PRIMARY KEY,
    nome_fantasia VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    endereco TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    raio_atuacao INT,
    gestor_id UUID NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);

-- Index para buscar supermercados de um gestor rapidamente
CREATE INDEX idx_supermercado_gestor ON supermercados (gestor_id);
