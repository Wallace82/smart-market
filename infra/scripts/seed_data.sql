-- Garantir que os schemas existam
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS supermarket;
CREATE SCHEMA IF NOT EXISTS product;

-- 1. Inserir Usuários Base (auth-service)
-- 1.1 Inserir Papeis (Roles)
INSERT INTO auth.papeis (id, nome, descricao)
VALUES ('00000000-0000-0000-0000-000000000001', 'ROLE_GESTOR', 'Gestor de Supermercado'),
       ('00000000-0000-0000-0000-000000000002', 'ROLE_ADMIN', 'Administrador da Plataforma'),
       ('00000000-0000-0000-0000-000000000003', 'ROLE_CLIENTE', 'Cliente Final')
ON CONFLICT (nome) DO NOTHING;

-- 1.2 Inserir Usuários (Senha padrão para todos: "password")
INSERT INTO auth.usuarios (id, nome, email, senha_hash, status, criado_em)
VALUES ('11111111-1111-1111-1111-111111111111', 'Gestor Modelo', 'gestor@smartmarket.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'ATIVO', now()),
       ('11111111-1111-1111-1111-111111111112', 'Admin Plataforma', 'admin@smartmarket.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'ATIVO', now()),
       ('11111111-1111-1111-1111-111111111113', 'Cliente Exemplo', 'cliente@smartmarket.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'ATIVO', now())
ON CONFLICT (email) DO NOTHING;

-- 1.3 Vincular Usuários aos Papeis correspondentes
INSERT INTO auth.usuarios_papeis (usuario_id, papel_id)
VALUES ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001'), -- Gestor
       ('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000002'), -- Admin
       ('11111111-1111-1111-1111-111111111113', '00000000-0000-0000-0000-000000000003')  -- Cliente
ON CONFLICT (usuario_id, papel_id) DO NOTHING;

-- 2. Inserir Supermercado (supermarket-service)
-- Nota: O ID aqui será usado para as ofertas abaixo
INSERT INTO supermarket.supermercado (id, nome_fantasia, cnpj, status, endereco, latitude, longitude, raio_atuacao, gestor_id, cor_primaria_hex, cor_secundaria_hex, criado_em)
VALUES ('22222222-2222-2222-2222-222222222222', 'Supermercado Modelo', '12345678000199', 'ATIVO', 'Av. Paulista, 1000', -23.5611, -46.6559, 5000, '11111111-1111-1111-1111-111111111111', '#4f46e5', '#10b981', now())
ON CONFLICT (cnpj) DO NOTHING;

-- 3. Inserir Temas Sazonais (product-service)
INSERT INTO product.tema_encarte (id, nome, cor_fundo_hex, ativo, criado_em)
VALUES ('33333333-3333-3333-3333-333333333331', 'Ofertas de Natal', '#b91c1c', true, now()),
       ('33333333-3333-3333-3333-333333333332', 'Semana Black Friday', '#000000', true, now())
ON CONFLICT (id) DO NOTHING;

-- 4. Inserir Produtos Base (product-service)
INSERT INTO product.produto_base (id, nome, unidade_medida, criado_em)
VALUES ('44444444-4444-4444-4444-444444444441', 'Arroz Agulhinha Tipo 1 5kg', 'UN', now()),
       ('44444444-4444-4444-4444-444444444442', 'Feijão Carioca 1kg', 'UN', now()),
       ('44444444-4444-4444-4444-444444444443', 'Leite Integral 1L', 'L', now())
ON CONFLICT (id) DO NOTHING;

-- 5. Inserir Ofertas do Supermercado (product-service)
INSERT INTO product.oferta (id, supermercado_id, produto_base_id, preco, ativo, criado_em)
VALUES ('55555555-5555-5555-5555-555555555551', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444441', 24.90, true, now()),
       ('55555555-5555-5555-5555-555555555552', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444442', 7.49, true, now()),
       ('55555555-5555-5555-5555-555555555553', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444443', 4.25, true, now())
ON CONFLICT (id) DO NOTHING;
