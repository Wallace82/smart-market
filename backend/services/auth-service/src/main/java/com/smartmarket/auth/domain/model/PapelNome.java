package com.smartmarket.auth.domain.model;

/**
 * Papéis de acesso suportados no MVP.
 * ROLE_CLIENTE é pós-MVP — ver REQUIREMENTS.md seção 12 (Backlog: Funcionalidades de Usuário Final).
 */
public enum PapelNome {
    ROLE_ADMIN,
    ROLE_GESTOR,
    ROLE_CLIENTE,
    ROLE_ATENDENTE
}
