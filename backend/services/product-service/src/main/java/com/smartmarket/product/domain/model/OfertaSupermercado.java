package com.smartmarket.product.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class OfertaSupermercado {
    private UUID id;
    private UUID supermercadoId;
    private ProdutoBase produtoBase;
    private BigDecimal precoAtual;
    private BigDecimal precoPromocional;
    private LocalDateTime dataInicioPromocao;
    private LocalDateTime dataFimPromocao;
    private boolean ativo;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public OfertaSupermercado() {
        this.ativo = true;
    }

    public boolean isPromocaoValida(LocalDateTime dataReferencia) {
        if (precoPromocional == null || dataInicioPromocao == null || dataFimPromocao == null) {
            return false;
        }
        return !dataReferencia.isBefore(dataInicioPromocao) && !dataReferencia.isAfter(dataFimPromocao);
    }

    public BigDecimal getPrecoEfetivo(LocalDateTime dataReferencia) {
        return isPromocaoValida(dataReferencia) ? precoPromocional : precoAtual;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSupermercadoId() { return supermercadoId; }
    public void setSupermercadoId(UUID supermercadoId) { this.supermercadoId = supermercadoId; }
    public ProdutoBase getProdutoBase() { return produtoBase; }
    public void setProdutoBase(ProdutoBase produtoBase) { this.produtoBase = produtoBase; }
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OfertaSupermercado that = (OfertaSupermercado) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
