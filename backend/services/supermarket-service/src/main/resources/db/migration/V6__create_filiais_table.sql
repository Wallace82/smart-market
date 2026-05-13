CREATE TABLE filiais (
    id UUID PRIMARY KEY,
    supermercado_id UUID NOT NULL,
    nome VARCHAR(255) NOT NULL,
    endereco TEXT NOT NULL,
    cep VARCHAR(10),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    telefone VARCHAR(20),
    email VARCHAR(255),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP,
    CONSTRAINT fk_filial_supermercado FOREIGN KEY (supermercado_id) REFERENCES supermercados(id) ON DELETE CASCADE
);

CREATE INDEX idx_filial_supermercado ON filiais (supermercado_id);
