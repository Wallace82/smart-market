package com.smartmarket.product.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class TemaEncarte {
    private UUID id;
    private String nome;
    private String urlBackgroundDecorativo;
    private String corFundoHex;
    private boolean ativo;
    private LocalDateTime criadoEm;

    public TemaEncarte() {
        this.ativo = true;
    }

    public TemaEncarte(UUID id, String nome, String urlBackgroundDecorativo, String corFundoHex) {
        this.id = id;
        this.nome = nome;
        this.urlBackgroundDecorativo = urlBackgroundDecorativo;
        this.corFundoHex = corFundoHex;
        this.ativo = true;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getUrlBackgroundDecorativo() { return urlBackgroundDecorativo; }
    public void setUrlBackgroundDecorativo(String urlBackgroundDecorativo) { this.urlBackgroundDecorativo = urlBackgroundDecorativo; }
    public String getCorFundoHex() { return corFundoHex; }
    public void setCorFundoHex(String corFundoHex) { this.corFundoHex = corFundoHex; }
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TemaEncarte that = (TemaEncarte) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
