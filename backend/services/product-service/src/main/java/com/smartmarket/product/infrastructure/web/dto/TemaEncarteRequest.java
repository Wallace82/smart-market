package com.smartmarket.product.infrastructure.web.dto;

public class TemaEncarteRequest {
    private String nome;
    private String urlBackgroundDecorativo;
    private String corFundoHex;
    private boolean ativo;

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUrlBackgroundDecorativo() {
        return urlBackgroundDecorativo;
    }

    public void setUrlBackgroundDecorativo(String urlBackgroundDecorativo) {
        this.urlBackgroundDecorativo = urlBackgroundDecorativo;
    }

    public String getCorFundoHex() {
        return corFundoHex;
    }

    public void setCorFundoHex(String corFundoHex) {
        this.corFundoHex = corFundoHex;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
