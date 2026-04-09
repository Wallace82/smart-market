package com.smartmarket.product.infrastructure.persistence;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ofertas_supermercado")
public class OfertaSupermercadoEntity {

    @Id
    private UUID id;

    @Column(name = "supermercado_id", nullable = false)
    private UUID supermercadoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_base_id", nullable = false)
    private ProdutoBaseEntity produtoBase;

    @Column(name = "preco_atual", nullable = false)
    private BigDecimal precoAtual;

    @Column(name = "preco_promocional")
    private BigDecimal precoPromocional;

    @Column(name = "data_inicio_promocao")
    private LocalDateTime dataInicioPromocao;

    @Column(name = "data_fim_promocao")
    private LocalDateTime dataFimPromocao;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSupermercadoId() { return supermercadoId; }
    public void setSupermercadoId(UUID supermercadoId) { this.supermercadoId = supermercadoId; }
    public ProdutoBaseEntity getProdutoBase() { return produtoBase; }
    public void setProdutoBase(ProdutoBaseEntity produtoBase) { this.produtoBase = produtoBase; }
    public BigDecimal getPrecoAtual() { return precoAtual; }
    public void setPrecoAtual(BigDecimal precoAtual) { this.precoAtual = precoAtual; }
    public BigDecimal getPrecoPromocional() { return precoPromocional; }
    public void setPrecoPromocional(BigDecimal precoPromocional) { this.precoPromocional = precoPromocional; }
    public LocalDateTime getDataInicioPromocao() { return dataInicioPromocao; }
    public void setDataInicioPromocao(LocalDateTime dataInicioPromocao) { this.dataInicioPromocao = dataInicioPromocao; }
    public LocalDateTime getDataFimPromocao() { return dataFimPromocao; }
    public void setDataFimPromocao(LocalDateTime dataFimPromocao) { this.dataFimPromocao = dataFimPromocao; }
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
