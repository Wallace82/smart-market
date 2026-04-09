package com.smartmarket.product.infrastructure.persistence;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "encartes_itens")
public class EncarteItemEntity {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encarte_id", nullable = false)
    private EncarteDigitalEntity encarteDigital;

    @Column(name = "oferta_id", nullable = false)
    private UUID ofertaId; // Referência à OfertaSupermercado

    @Column(name = "ordem_exibicao")
    private Integer ordemExibicao;

    @Column
    private boolean destaque;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public EncarteDigitalEntity getEncarteDigital() { return encarteDigital; }
    public void setEncarteDigital(EncarteDigitalEntity encarteDigital) { this.encarteDigital = encarteDigital; }
    public UUID getOfertaId() { return ofertaId; }
    public void setOfertaId(UUID ofertaId) { this.ofertaId = ofertaId; }
    public Integer getOrdemExibicao() { return ordemExibicao; }
    public void setOrdemExibicao(Integer ordemExibicao) { this.ordemExibicao = ordemExibicao; }
    public boolean isDestaque() { return destaque; }
    public void setDestaque(boolean destaque) { this.destaque = destaque; }
}
