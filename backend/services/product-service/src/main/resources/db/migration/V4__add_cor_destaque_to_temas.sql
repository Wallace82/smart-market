ALTER TABLE product.temas_encarte ADD COLUMN cor_destaque_hex VARCHAR(7);
UPDATE product.temas_encarte SET cor_destaque_hex = '#000000' WHERE cor_destaque_hex IS NULL;
