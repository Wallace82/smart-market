package com.smartmarket.supermarket.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class Supermercado {
    private UUID id;
    private String nomeFantasia;
    private String cnpj;
    private SupermercadoStatus status;
    private String endereco;
    private Double latitude;
    private Double longitude;
    private Integer raioAtuacao; // em metros
    private UUID gestorId;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public Supermercado() {
        this.status = SupermercadoStatus.PENDENTE;
    }

    public Supermercado(UUID id, String nomeFantasia, String cnpj, String endereco, Double latitude, Double longitude, Integer raioAtuacao, UUID gestorId) {
        this.id = id;
        this.nomeFantasia = nomeFantasia;
        this.cnpj = cnpj;
        this.status = SupermercadoStatus.PENDENTE;
        this.endereco = endereco;
        this.latitude = latitude;
        this.longitude = longitude;
        this.raioAtuacao = raioAtuacao;
        this.gestorId = gestorId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }
    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }
    public SupermercadoStatus getStatus() { return status; }
    public void setStatus(SupermercadoStatus status) { this.status = status; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Integer getRaioAtuacao() { return raioAtuacao; }
    public void setRaioAtuacao(Integer raioAtuacao) { this.raioAtuacao = raioAtuacao; }
    public UUID getGestorId() { return gestorId; }
    public void setGestorId(UUID gestorId) { this.gestorId = gestorId; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Supermercado that = (Supermercado) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
