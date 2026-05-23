-- Garantir que os schemas existam
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS supermarket;
CREATE SCHEMA IF NOT EXISTS product;

-- 1. Inserir Usuários Base (auth-service)
-- 1.1 Inserir Papeis (Roles) com os UUIDs corretos já existentes no banco
INSERT INTO auth.papeis (id, nome, descricao)
VALUES ('f337c2b0-65f9-41b2-ac6a-23bb017164c5', 'ROLE_GESTOR', 'Gestor de Supermercado'),
       ('40476139-e4f1-451b-86f6-6bbac042cd25', 'ROLE_ADMIN', 'Administrador da Plataforma'),
       ('6c0f52e1-dbe6-4747-b3a9-103be51f3e43', 'ROLE_CLIENTE', 'Cliente Final'),
       ('00000000-0000-0000-0000-000000000004', 'ROLE_ATENDENTE', 'Atendente Concierge')
ON CONFLICT (nome) DO UPDATE SET id = EXCLUDED.id, descricao = EXCLUDED.descricao;

-- 1.2 Inserir Usuários (Senha padrão para todos: "password")
INSERT INTO auth.usuarios (id, nome, email, senha_hash, status, criado_em)
VALUES ('11111111-1111-1111-1111-111111111111', 'Gestor Modelo', 'gestor@smartmarket.com', '$2b$12$SR7riOqjOyt3m3gI8ntNCuB4Zioat8CHk1EEOUXccqK09kwZoqAku', 'ATIVO', now()),
       ('11111111-1111-1111-1111-111111111112', 'Admin Plataforma', 'admin@smartmarket.com', '$2b$12$SR7riOqjOyt3m3gI8ntNCuB4Zioat8CHk1EEOUXccqK09kwZoqAku', 'ATIVO', now()),
       ('11111111-1111-1111-1111-111111111113', 'Cliente Exemplo', 'cliente@smartmarket.com', '$2b$12$SR7riOqjOyt3m3gI8ntNCuB4Zioat8CHk1EEOUXccqK09kwZoqAku', 'ATIVO', now()),
       ('11111111-1111-1111-1111-111111111114', 'Atendente Modelo', 'atendente@smartmarket.com', '$2b$12$SR7riOqjOyt3m3gI8ntNCuB4Zioat8CHk1EEOUXccqK09kwZoqAku', 'ATIVO', now())
ON CONFLICT (email) DO UPDATE SET senha_hash = EXCLUDED.senha_hash;

-- 1.3 Vincular Usuários aos Papeis correspondentes
INSERT INTO auth.usuarios_papeis (usuario_id, papel_id)
VALUES ('11111111-1111-1111-1111-111111111111', 'f337c2b0-65f9-41b2-ac6a-23bb017164c5'), -- Gestor
       ('11111111-1111-1111-1111-111111111112', '40476139-e4f1-451b-86f6-6bbac042cd25'), -- Admin
       ('11111111-1111-1111-1111-111111111113', '6c0f52e1-dbe6-4747-b3a9-103be51f3e43'), -- Cliente
       ('11111111-1111-1111-1111-111111111114', '00000000-0000-0000-0000-000000000004')  -- Atendente
ON CONFLICT (usuario_id, papel_id) DO NOTHING;

-- 2. Inserir Supermercado (supermarket-service)
-- Nota: A tabela correta é 'supermercados' e o ID aqui será usado para as ofertas abaixo
INSERT INTO supermarket.supermercados (id, nome_fantasia, cnpj, status, endereco, latitude, longitude, raio_atuacao, gestor_id, cor_primaria_hex, cor_secundaria_hex, criado_em)
VALUES ('22222222-2222-2222-2222-222222222222', 'Supermercado Modelo', '12345678000199', 'ATIVO', 'Av. Paulista, 1000', -23.5611, -46.6559, 5000, '11111111-1111-1111-1111-111111111111', '#4f46e5', '#10b981', now())
ON CONFLICT (cnpj) DO NOTHING;

-- 3. Inserir Temas Sazonais (product-service)
-- Nota: A tabela correta é 'temas_encarte'
INSERT INTO product.temas_encarte (id, nome, cor_fundo_hex, ativo, criado_em, cor_destaque_hex)
VALUES ('33333333-3333-3333-3333-333333333331', 'Ofertas de Natal', '#fff5f5', true, now(), '#db1414'),
       ('33333333-3333-3333-3333-333333333332', 'Semana Black Friday', '#1a1a1a', true, now(), '#46e1ec'),
       ('33333333-3333-3333-3333-333333333333', 'Semana do Consumidor', '#f0f9ff', true, now(), '#0284c7'),
       ('33333333-3333-3333-3333-333333333334', 'Arraiá de Ofertas', '#fffbeb', true, now(), '#f59e0b')
ON CONFLICT (id) DO NOTHING;

-- 4. Inserir Produtos Base (product-service)
-- Nota: A tabela correta é 'produtos_base'
INSERT INTO product.produtos_base (id, nome, unidade_medida, criado_em)
VALUES 
('44444444-4444-4444-4444-000000000001', 'Arroz Agulhinha Tipo 1 - 5kg', 'UN', now()),
('44444444-4444-4444-4444-000000000002', 'Feijão Carioca Kicaldo - 1kg', 'UN', now()),
('44444444-4444-4444-4444-000000000003', 'Óleo de Soja Liza - 900ml', 'UN', now()),
('44444444-4444-4444-4444-000000000004', 'Café Melitta Vácuo - 500g', 'UN', now()),
('44444444-4444-4444-4444-000000000005', 'Leite Integral Italac - 1L', 'UN', now()),
('44444444-4444-4444-4444-000000000006', 'Detergente Ipê Neutro - 500ml', 'UN', now()),
('44444444-4444-4444-4444-000000000007', 'Picanha Bovina Fatiada (kg)', 'KG', now()),
('44444444-4444-4444-4444-000000000008', 'Cerveja Heineken Long Neck 330ml', 'UN', now()),
('44444444-4444-4444-4444-000000000009', 'Banana Prata Premium (kg)', 'KG', now()),
('44444444-4444-4444-4444-000000000010', 'Açúcar Cristal Delta - 5kg', 'UN', now()),
('44444444-4444-4444-4444-000000000011', 'Sabão em Pó Omo 1.6kg', 'UN', now()),
('44444444-4444-4444-4444-000000000012', 'Papel Higiênico Neve 12 rolos', 'UN', now()),
('44444444-4444-4444-4444-000000000013', 'Maionese Hellmanns 500g', 'UN', now()),
('44444444-4444-4444-4444-000000000014', 'Refrigerante Coca-Cola 2L', 'UN', now()),
('44444444-4444-4444-4444-000000000015', 'Biscoito Recheado Passatempo', 'UN', now()),
('44444444-4444-4444-4444-000000000016', 'Coração de Frango (kg)', 'KG', now()),
('44444444-4444-4444-4444-000000000017', 'Tomate Italiano (kg)', 'KG', now()),
('44444444-4444-4444-4444-000000000018', 'Vinho Tinto Chileno 750ml', 'UN', now()),
('44444444-4444-4444-4444-000000000019', 'Shampoo Dove 400ml', 'UN', now()),
('44444444-4444-4444-4444-000000000020', 'Sabonete Rexona 84g', 'UN', now())
ON CONFLICT (id) DO NOTHING;

-- 5. Inserir Ofertas do Supermercado (product-service)
-- Nota: A tabela correta é 'ofertas_supermercado' e a coluna de preço é 'preco_atual'
INSERT INTO product.ofertas_supermercado (id, supermercado_id, produto_base_id, preco_atual, ativo, criado_em)
VALUES 
('55555555-5555-5555-5555-555555555551', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000001', 29.90, true, now()), -- o1
('55555555-5555-5555-5555-555555555552', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000002', 8.45, true, now()), -- o2
('55555555-5555-5555-5555-000000000003', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000003', 6.89, true, now()), -- o3
('55555555-5555-5555-5555-000000000004', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000004', 18.90, true, now()), -- o4
('55555555-5555-5555-5555-555555555553', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000005', 4.59, true, now()), -- o5 (maps to 55555555-5555-5555-5555-555555555553 in ts code)
('55555555-5555-5555-5555-000000000006', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000006', 2.25, true, now()), -- o6
('55555555-5555-5555-5555-000000000007', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000007', 69.90, true, now()), -- o7
('55555555-5555-5555-5555-000000000008', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000008', 6.49, true, now()), -- o8
('55555555-5555-5555-5555-000000000009', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000009', 5.98, true, now()), -- o9
('55555555-5555-5555-5555-000000000010', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000010', 16.90, true, now()), -- o10
('55555555-5555-5555-5555-000000000011', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000011', 24.90, true, now()), -- o11
('55555555-5555-5555-5555-000000000012', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000012', 19.90, true, now()), -- o12
('55555555-5555-5555-5555-000000000013', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000013', 11.45, true, now()), -- o13
('55555555-5555-5555-5555-000000000014', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000014', 9.90, true, now()), -- o14
('55555555-5555-5555-5555-000000000015', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000015', 2.99, true, now()), -- o15
('55555555-5555-5555-5555-000000000016', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000016', 22.90, true, now()), -- o16
('55555555-5555-5555-5555-000000000017', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000017', 7.45, true, now()), -- o17
('55555555-5555-5555-5555-000000000018', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000018', 39.90, true, now()), -- o18
('55555555-5555-5555-5555-000000000019', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000019', 18.50, true, now()), -- o19
('55555555-5555-5555-5555-000000000020', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-000000000020', 2.15, true, now())  -- o20
ON CONFLICT (id) DO NOTHING;

-- 6. Inserir Encarte Digital (product-service)
-- O status correto para publicado é 'ATIVO' em EncarteStatus
INSERT INTO product.encartes_digitais (id, supermercado_id, tema_id, titulo, data_inicio, data_fim, status, criado_em)
VALUES ('66666666-6666-6666-6666-666666666661', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333331', 'Especial de Natal', CURRENT_DATE, CURRENT_DATE + INTERVAL '10 days', 'ATIVO', now())
ON CONFLICT (id) DO NOTHING;

-- 7. Relacionar Ofertas ao Encarte (Tabela de relacionamento real: encartes_itens)
INSERT INTO product.encartes_itens (id, encarte_id, oferta_id, ordem_exibicao, destaque)
VALUES ('77777777-7777-7777-7777-777777777771', '66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555551', 1, true),
       ('77777777-7777-7777-7777-777777777772', '66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555552', 2, false),
       ('77777777-7777-7777-7777-777777777773', '66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555553', 3, false)
ON CONFLICT (id) DO NOTHING;
