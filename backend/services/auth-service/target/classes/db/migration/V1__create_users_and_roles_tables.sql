CREATE TABLE usuarios (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    ultimo_login_em TIMESTAMP,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);

CREATE TABLE papeis (
    id UUID PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

CREATE TABLE usuarios_papeis (
    usuario_id UUID NOT NULL,
    papel_id UUID NOT NULL,
    PRIMARY KEY (usuario_id, papel_id),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_papel FOREIGN KEY (papel_id) REFERENCES papeis (id) ON DELETE CASCADE
);

-- Inserindo papéis padrão
INSERT INTO papeis (id, nome, descricao) VALUES
    (gen_random_uuid(), 'ROLE_ADMIN', 'Administrador global da plataforma'),
    (gen_random_uuid(), 'ROLE_GESTOR', 'Gestor de um ou mais supermercados'),
    (gen_random_uuid(), 'ROLE_CLIENTE', 'Cliente consumidor');
