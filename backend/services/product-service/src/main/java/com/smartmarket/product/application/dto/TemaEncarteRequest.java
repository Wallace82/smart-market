package com.smartmarket.product.application.dto;

public class TemaEncarteRequest {
    private String nome;
    private String urlBackgroundDecorativo;
    private String corFundoHex;
    private String corDestaqueHex;
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

    public String getCorDestaqueHex() {
        return corDestaqueHex;
    }

    public void setCorDestaqueHex(String corDestaqueHex) {
        this.corDestaqueHex = corDestaqueHex;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}

