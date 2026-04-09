package com.smartmarket.product.infrastructure.web.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class EncarteDigitalRequest {
    private UUID supermercadoId;
    private UUID temaId;
    private String titulo;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private List<EncarteItemRequest> itens;

    // Getters e Setters
    public UUID getSupermercadoId() {
        return supermercadoId;
    }

    public void setSupermercadoId(UUID supermercadoId) {
        this.supermercadoId = supermercadoId;
    }

    public UUID getTemaId() {
        return temaId;
    }

    public void setTemaId(UUID temaId) {
        this.temaId = temaId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public LocalDateTime getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDateTime dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDateTime getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDateTime dataFim) {
        this.dataFim = dataFim;
    }

    public List<EncarteItemRequest> getItens() {
        return itens;
    }

    public void setItens(List<EncarteItemRequest> itens) {
        this.itens = itens;
    }
}
