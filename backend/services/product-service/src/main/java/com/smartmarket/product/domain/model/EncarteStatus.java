package com.smartmarket.product.domain.model;

/**
 * Ciclo de vida do Encarte Digital (RF-05.5):
 * - RASCUNHO: Em edição pelo Gestor, não visível na vitrine.
 * - ATIVO: Publicado e visível na vitrine pública.
 * - ENCERRADO: Expirado manualmente pelo Gestor ou por data de fim atingida.
 */
public enum EncarteStatus {
    RASCUNHO,
    ATIVO,
    ENCERRADO
}
