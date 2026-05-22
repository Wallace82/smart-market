-- V2__add_encarte_id.sql
-- Descrição: Adiciona coluna para vincular o encarte digital gerado pelo atendente à solicitação

ALTER TABLE solicitacoes_concierge ADD COLUMN encarte_id UUID;
COMMENT ON COLUMN solicitacoes_concierge.encarte_id IS 'UUID do encarte digital associado gerado pelo atendente';
