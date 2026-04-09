package com.smartmarket.product.infrastructure.web.dto;

import java.util.UUID;

public class EncarteItemRequest {
    private UUID ofertaId;
    private Integer ordemExibicao;
    private boolean destaque;

    // Getters e Setters
    public UUID getOfertaId() {
        return ofertaId;
    }

    public void setOfertaId(UUID ofertaId) {
        this.ofertaId = ofertaId;
    }

    public Integer getOrdemExibicao() {
        return ordemExibicao;
    }

    public void setOrdemExibicao(Integer ordemExibicao) {
        this.ordemExibicao = ordemExibicao;
    }

    public boolean isDestaque() {
        return destaque;
    }

    public void setDestaque(boolean destaque) {
        this.destaque = destaque;
    }
}
