package com.smartmarket.product.infrastructure.web.dto;

import java.util.UUID;

public class EncarteItemResponse {
    private UUID id;
    private UUID ofertaId;
    private Integer ordemExibicao;
    private boolean destaque;

    public EncarteItemResponse(UUID id, UUID ofertaId, Integer ordemExibicao, boolean destaque) {
        this.id = id;
        this.ofertaId = ofertaId;
        this.ordemExibicao = ordemExibicao;
        this.destaque = destaque;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getOfertaId() { return ofertaId; }
    public Integer getOrdemExibicao() { return ordemExibicao; }
    public boolean isDestaque() { return destaque; }

    // Setters (se necessário)
    public void setId(UUID id) { this.id = id; }
    public void setOfertaId(UUID ofertaId) { this.ofertaId = ofertaId; }
    public void setOrdemExibicao(Integer ordemExibicao) { this.ordemExibicao = ordemExibicao; }
    public void setDestaque(boolean destaque) { this.destaque = destaque; }
}
