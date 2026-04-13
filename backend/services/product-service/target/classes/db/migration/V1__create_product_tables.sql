CREATE TABLE produtos_base (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    marca VARCHAR(100),
    unidade_medida VARCHAR(20) NOT NULL,
    peso_volume NUMERIC(10, 3),
    url_imagem VARCHAR(500),
    categoria_id UUID,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);

CREATE TABLE ofertas_supermercado (
    id UUID PRIMARY KEY,
    supermercado_id UUID NOT NULL,
    produto_base_id UUID NOT NULL,
    preco_atual NUMERIC(10, 2) NOT NULL,
    preco_promocional NUMERIC(10, 2),
    data_inicio_promocao TIMESTAMP,
    data_fim_promocao TIMESTAMP,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP,
    CONSTRAINT fk_produto_base FOREIGN KEY (produto_base_id) REFERENCES produtos_base (id) ON DELETE CASCADE
);

-- Para garantir a regra: Um Supermercado não pode ter mais de uma Oferta ativa para o mesmo ProdutoBase (sem tratar sobreposição no banco diretamente, mas evita duplicidade básica)
CREATE UNIQUE INDEX idx_oferta_unica_ativa ON ofertas_supermercado (supermercado_id, produto_base_id) WHERE ativo = true;
