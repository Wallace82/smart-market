package com.smartmarket.product.domain.model;

import java.util.Objects;
import java.util.UUID;

public class EncarteItem {
    private UUID id;
    private UUID encarteId;
    private UUID ofertaId;
    private Integer ordemExibicao;
    private boolean destaque;

    public EncarteItem() {
    }

    public EncarteItem(UUID id, UUID encarteId, UUID ofertaId, Integer ordemExibicao, boolean destaque) {
        this.id = id;
        this.encarteId = encarteId;
        this.ofertaId = ofertaId;
        this.ordemExibicao = ordemExibicao;
        this.destaque = destaque;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getEncarteId() { return encarteId; }
    public void setEncarteId(UUID encarteId) { this.encarteId = encarteId; }
    public UUID getOfertaId() { return ofertaId; }
    public void setOfertaId(UUID ofertaId) { this.ofertaId = ofertaId; }
    public Integer getOrdemExibicao() { return ordemExibicao; }
    public void setOrdemExibicao(Integer ordemExibicao) { this.ordemExibicao = ordemExibicao; }
    public boolean isDestaque() { return destaque; }
    public void setDestaque(boolean destaque) { this.destaque = destaque; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EncarteItem that = (EncarteItem) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
