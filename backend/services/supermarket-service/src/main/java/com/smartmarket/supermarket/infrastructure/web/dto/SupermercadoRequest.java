package com.smartmarket.supermarket.infrastructure.web.dto;

import java.util.UUID;

public class SupermercadoRequest {
    private String nomeFantasia;
    private String cnpj;
    private String endereco;
    private Double latitude;
    private Double longitude;
    private Integer raioAtuacao;
    private UUID gestorId;
    private String urlLogomarca;
    private String corPrimariaHex;
    private String corSecundariaHex;

    // Getters e Setters
    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getRaioAtuacao() {
        return raioAtuacao;
    }

    public void setRaioAtuacao(Integer raioAtuacao) {
        this.raioAtuacao = raioAtuacao;
    }

    public UUID getGestorId() {
        return gestorId;
    }

    public void setGestorId(UUID gestorId) {
        this.gestorId = gestorId;
    }

    public String getUrlLogomarca() {
        return urlLogomarca;
    }

    public void setUrlLogomarca(String urlLogomarca) {
        this.urlLogomarca = urlLogomarca;
    }

    public String getCorPrimariaHex() {
        return corPrimariaHex;
    }

    public void setCorPrimariaHex(String corPrimariaHex) {
        this.corPrimariaHex = corPrimariaHex;
    }

    public String getCorSecundariaHex() {
        return corSecundariaHex;
    }

    public void setCorSecundariaHex(String corSecundariaHex) {
        this.corSecundariaHex = corSecundariaHex;
    }
}
