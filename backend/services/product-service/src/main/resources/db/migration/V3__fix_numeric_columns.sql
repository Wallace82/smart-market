-- Fix numeric column types from NUMERIC to DOUBLE PRECISION
ALTER TABLE produtos_base
    ALTER COLUMN peso_volume TYPE DOUBLE PRECISION USING peso_volume::DOUBLE PRECISION;
