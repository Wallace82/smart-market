CREATE TABLE campanhas (
    id UUID PRIMARY KEY,
    supermercado_id UUID NOT NULL,
    nome VARCHAR(255) NOT NULL,
    segmento VARCHAR(255) NOT NULL,
    raio VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    pushes_enviados INTEGER NOT NULL DEFAULT 0,
    conversoes INTEGER NOT NULL DEFAULT 0,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_campanha_supermercado FOREIGN KEY (supermercado_id) REFERENCES supermercados(id) ON DELETE CASCADE
);

CREATE INDEX idx_campanha_supermercado ON campanhas (supermercado_id);
