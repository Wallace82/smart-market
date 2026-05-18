package com.smartmarket.auth.domain.model;

import java.time.Instant;
import java.util.UUID;

public class RefreshToken {
    private UUID id;
    private Usuario usuario;
    private String token;
    private Instant dataExpiracao;

    public RefreshToken() {
    }

    public boolean isExpirado() {
        return dataExpiracao.isBefore(Instant.now());
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Instant getDataExpiracao() { return dataExpiracao; }
    public void setDataExpiracao(Instant dataExpiracao) { this.dataExpiracao = dataExpiracao; }
}
