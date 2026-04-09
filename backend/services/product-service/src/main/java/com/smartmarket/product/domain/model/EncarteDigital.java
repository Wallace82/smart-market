package com.smartmarket.product.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class EncarteDigital {
    private UUID id;
    private UUID supermercadoId;
    private UUID temaId; // Pode ser null se não houver tema específico
    private String titulo;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private EncarteStatus status; // Ex: RASCUNHO, PUBLICADO, ARQUIVADO
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public EncarteDigital() {
        this.status = EncarteStatus.RASCUNHO;
    }

    public EncarteDigital(UUID id, UUID supermercadoId, UUID temaId, String titulo, LocalDateTime dataInicio, LocalDateTime dataFim, EncarteStatus status) {
        this.id = id;
        this.supermercadoId = supermercadoId;
        this.temaId = temaId;
        this.titulo = titulo;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.status = status;
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSupermercadoId() { return supermercadoId; }
    public void setSupermercadoId(UUID supermercadoId) { this.supermercadoId = supermercadoId; }
    public UUID getTemaId() { return temaId; }
    public void setTemaId(UUID temaId) { this.temaId = temaId; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }
    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }
    public EncarteStatus getStatus() { return status; }
    public void setStatus(EncarteStatus status) { this.status = status; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EncarteDigital that = (EncarteDigital) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
