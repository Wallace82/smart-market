CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    usuario_id UUID NOT NULL UNIQUE,
    token VARCHAR(255) NOT NULL UNIQUE,
    data_expiracao TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_usuario_token FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
