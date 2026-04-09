package com.smartmarket.supermarket.infrastructure.web.dto;

import com.smartmarket.supermarket.domain.model.SupermercadoStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class SupermercadoResponse {
    private UUID id;
    private String nomeFantasia;
    private String cnpj;
    private SupermercadoStatus status;
    private String endereco;
    private Double latitude;
    private Double longitude;
    private Integer raioAtuacao;
    private UUID gestorId;
    private String urlLogomarca;
    private String corPrimariaHex;
    private String corSecundariaHex;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    // Construtor para mapear de Supermercado (domain model) para SupermercadoResponse
    public SupermercadoResponse(UUID id, String nomeFantasia, String cnpj, SupermercadoStatus status, String endereco, Double latitude, Double longitude, Integer raioAtuacao, UUID gestorId, String urlLogomarca, String corPrimariaHex, String corSecundariaHex, LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.nomeFantasia = nomeFantasia;
        this.cnpj = cnpj;
        this.status = status;
        this.endereco = endereco;
        this.latitude = latitude;
        this.longitude = longitude;
        this.raioAtuacao = raioAtuacao;
        this.gestorId = gestorId;
        this.urlLogomarca = urlLogomarca;
        this.corPrimariaHex = corPrimariaHex;
        this.corSecundariaHex = corSecundariaHex;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    // Getters
    public UUID getId() { return id; }
    public String getNomeFantasia() { return nomeFantasia; }
    public String getCnpj() { return cnpj; }
    public SupermercadoStatus getStatus() { return status; }
    public String getEndereco() { return endereco; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public Integer getRaioAtuacao() { return raioAtuacao; }
    public UUID getGestorId() { return gestorId; }
    public String getUrlLogomarca() { return urlLogomarca; }
    public String getCorPrimariaHex() { return corPrimariaHex; }
    public String getCorSecundariaHex() { return corSecundariaHex; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }

    // Setters (se necessário, para desserialização ou outros usos)
    public void setId(UUID id) { this.id = id; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }
    public void setStatus(SupermercadoStatus status) { this.status = status; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public void setRaioAtuacao(Integer raioAtuacao) { this.raioAtuacao = raioAtuacao; }
    public void setGestorId(UUID gestorId) { this.gestorId = gestorId; }
    public void setUrlLogomarca(String urlLogomarca) { this.urlLogomarca = urlLogomarca; }
    public void setCorPrimariaHex(String corPrimariaHex) { this.corPrimariaHex = corPrimariaHex; }
    public void setCorSecundariaHex(String corSecundariaHex) { this.corSecundariaHex = corSecundariaHex; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
