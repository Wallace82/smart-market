package com.smartmarket.product.infrastructure.web.dto;

import com.smartmarket.product.domain.model.EncarteStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class EncarteDigitalResponse {
    private UUID id;
    private UUID supermercadoId;
    private UUID temaId;
    private String titulo;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private EncarteStatus status;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
    private List<EncarteItemResponse> itens;

    public EncarteDigitalResponse(UUID id, UUID supermercadoId, UUID temaId, String titulo, LocalDateTime dataInicio, LocalDateTime dataFim, EncarteStatus status, LocalDateTime criadoEm, LocalDateTime atualizadoEm, List<EncarteItemResponse> itens) {
        this.id = id;
        this.supermercadoId = supermercadoId;
        this.temaId = temaId;
        this.titulo = titulo;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.status = status;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
        this.itens = itens;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getSupermercadoId() { return supermercadoId; }
    public UUID getTemaId() { return temaId; }
    public String getTitulo() { return titulo; }
    public LocalDateTime getDataInicio() { return dataInicio; }
    public LocalDateTime getDataFim() { return dataFim; }
    public EncarteStatus getStatus() { return status; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public List<EncarteItemResponse> getItens() { return itens; }

    // Setters (se necessário)
    public void setId(UUID id) { this.id = id; }
    public void setSupermercadoId(UUID supermercadoId) { this.supermercadoId = supermercadoId; }
    public void setTemaId(UUID temaId) { this.temaId = temaId; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }
    public void setStatus(EncarteStatus status) { this.status = status; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
    public void setItens(List<EncarteItemResponse> itens) { this.itens = itens; }
}
