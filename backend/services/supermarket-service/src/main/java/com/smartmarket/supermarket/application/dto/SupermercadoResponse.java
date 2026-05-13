package com.smartmarket.supermarket.application.dto;

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
    private String email;
    private String telefone;
    private String cep;
    private String cidade;
    private String estado;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    // Construtor para mapear de Supermercado (domain model) para SupermercadoResponse
    public SupermercadoResponse(UUID id, String nomeFantasia, String cnpj, SupermercadoStatus status, String endereco, Double latitude, Double longitude, Integer raioAtuacao, UUID gestorId, String urlLogomarca, String corPrimariaHex, String corSecundariaHex, String email, String telefone, String cep, String cidade, String estado, LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
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
        this.email = email;
        this.telefone = telefone;
        this.cep = cep;
        this.cidade = cidade;
        this.estado = estado;
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
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }
    public String getCep() { return cep; }
    public String getCidade() { return cidade; }
    public String getEstado() { return estado; }
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
    public void setEmail(String email) { this.email = email; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public void setCep(String cep) { this.cep = cep; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}

