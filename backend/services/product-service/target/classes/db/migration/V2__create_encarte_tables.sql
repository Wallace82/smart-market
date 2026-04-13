CREATE TABLE temas_encarte (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    url_background_decorativo VARCHAR(500),
    cor_fundo_hex VARCHAR(7),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL
);

CREATE TABLE encartes_digitais (
    id UUID PRIMARY KEY,
    supermercado_id UUID NOT NULL,
    tema_id UUID,
    titulo VARCHAR(255) NOT NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP NOT NULL,
    atualizado_em TIMESTAMP,
    CONSTRAINT fk_tema_encarte FOREIGN KEY (tema_id) REFERENCES temas_encarte(id)
);

CREATE TABLE encartes_itens (
    id UUID PRIMARY KEY,
    encarte_id UUID NOT NULL,
    oferta_id UUID NOT NULL,
    ordem_exibicao INTEGER,
    destaque BOOLEAN,
    CONSTRAINT fk_encarte_digital FOREIGN KEY (encarte_id) REFERENCES encartes_digitais(id)
);
