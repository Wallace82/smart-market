package com.smartmarket.product.infrastructure.web.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TemaEncarteResponse {
    private UUID id;
    private String nome;
    private String urlBackgroundDecorativo;
    private String corFundoHex;
    private boolean ativo;
    private LocalDateTime criadoEm;

    public TemaEncarteResponse(UUID id, String nome, String urlBackgroundDecorativo, String corFundoHex, boolean ativo, LocalDateTime criadoEm) {
        this.id = id;
        this.nome = nome;
        this.urlBackgroundDecorativo = urlBackgroundDecorativo;
        this.corFundoHex = corFundoHex;
        this.ativo = ativo;
        this.criadoEm = criadoEm;
    }

    // Getters
    public UUID getId() { return id; }
    public String getNome() { return nome; }
    public String getUrlBackgroundDecorativo() { return urlBackgroundDecorativo; }
    public String getCorFundoHex() { return corFundoHex; }
    public boolean isAtivo() { return ativo; }
    public LocalDateTime getCriadoEm() { return criadoEm; }

    // Setters (se necessário)
    public void setId(UUID id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setUrlBackgroundDecorativo(String urlBackgroundDecorativo) { this.urlBackgroundDecorativo = urlBackgroundDecorativo; }
    public void setCorFundoHex(String corFundoHex) { this.corFundoHex = corFundoHex; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
