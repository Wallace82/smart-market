-- Adiciona o campo EAN (código de barras) ao catálogo de produtos base
ALTER TABLE produtos_base ADD COLUMN IF NOT EXISTS ean VARCHAR(50);

-- Adiciona o campo marca_id (FK para a tabela de marcas)
ALTER TABLE produtos_base ADD COLUMN IF NOT EXISTS marca_id UUID;
