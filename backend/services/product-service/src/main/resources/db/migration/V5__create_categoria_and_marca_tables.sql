CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_categorias_nome ON categorias(nome);

CREATE TABLE IF NOT EXISTS marcas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_marcas_nome ON marcas(nome);

-- Migrando a coluna marca para marca_id em produtos_base
ALTER TABLE produtos_base ADD COLUMN IF NOT EXISTS marca_id UUID;
ALTER TABLE produtos_base ADD COLUMN IF NOT EXISTS descricao TEXT;

-- Inserindo categorias iniciais
INSERT INTO categorias (id, nome) VALUES 
('88888888-8888-8888-8888-888888888888', 'Geral'),
(gen_random_uuid(), 'Alimentos'),
(gen_random_uuid(), 'Bebidas'),
(gen_random_uuid(), 'Limpeza'),
(gen_random_uuid(), 'Higiene')
ON CONFLICT (nome) DO NOTHING;

-- Inserindo marcas iniciais (baseado no que já temos)
INSERT INTO marcas (nome) VALUES 
('Coca-Cola'),
('Nestlé'),
('Ambev'),
('Unilever'),
('P&G'),
('Tio João')
ON CONFLICT (nome) DO NOTHING;
