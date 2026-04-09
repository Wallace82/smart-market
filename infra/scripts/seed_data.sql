-- Garantir que os schemas existam
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS supermarket;
CREATE SCHEMA IF NOT EXISTS product;

-- 1. Inserir Usuário Gestor (auth-service)
INSERT INTO auth.users (id, email, password, role, active, created_at)
VALUES ('some-gestor-uuid', 'gestor@smartmarket.com', '$2a$10$dGhpcy1pcy1hLXNlY3JldC1rZXktZm9yLXNjb3R0LW1hcmtldA', 'ROLE_GESTOR', true, now())
ON CONFLICT (email) DO NOTHING;

-- 2. Inserir Supermercado (supermarket-service)
-- Nota: O ID aqui será usado para as ofertas abaixo
INSERT INTO supermarket.supermercados (id, nome_fantasia, cnpj, status, endereco, latitude, longitude, raio_atuacao, gestor_id, cor_primaria_hex, cor_secundaria_hex, criado_em)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Supermercado Modelo', '12345678000199', 'ATIVO', 'Av. Paulista, 1000', -23.5611, -46.6559, 5000, 'some-gestor-uuid', '#16a34a', '#ffffff', now())
ON CONFLICT (cnpj) DO NOTHING;

-- 3. Inserir Temas Sazonais (product-service)
INSERT INTO product.temas_encarte (id, nome, cor_fundo_hex, ativo, criado_em)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Ofertas de Natal', '#b91c1c', true, now()),
       ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Semana Black Friday', '#000000', true, now())
ON CONFLICT (id) DO NOTHING;

-- 4. Inserir Produtos Base (product-service)
INSERT INTO product.produtos_base (id, nome, unidade_medida, criado_em)
VALUES ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Arroz Agulhinha Tipo 1 5kg', 'UN', now()),
       ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Feijão Carioca 1kg', 'UN', now()),
       ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Leite Integral 1L', 'L', now())
ON CONFLICT (id) DO NOTHING;

-- 5. Inserir Ofertas do Supermercado (product-service)
INSERT INTO product.ofertas_supermercado (id, supermercado_id, produto_base_id, preco_atual, ativo, criado_em)
VALUES (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 24.90, true, now()),
       (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 7.49, true, now()),
       (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 4.25, true, now())
ON CONFLICT DO NOTHING;
