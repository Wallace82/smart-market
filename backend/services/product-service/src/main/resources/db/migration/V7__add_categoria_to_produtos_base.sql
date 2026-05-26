-- Adiciona a coluna categoria para armazenar o nome da categoria de forma desnormalizada
ALTER TABLE produtos_base ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);
