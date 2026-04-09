package com.smartmarket.product.domain.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class ProdutoBase {
    private UUID id;
    private String nome;
    private String descricao;
    private String marca;
    private UnidadeMedida unidadeMedida;
    private Double pesoVolume;
    private String urlImagem;
    private UUID categoriaId;
    private boolean ativo;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public ProdutoBase() {
        this.ativo = true;
    }

    public ProdutoBase(UUID id, String nome, String marca, UnidadeMedida unidadeMedida, Double pesoVolume, UUID categoriaId) {
        this.id = id;
        this.nome = nome;
        this.marca = marca;
        this.unidadeMedida = unidadeMedida;
        this.pesoVolume = pesoVolume;
        this.categoriaId = categoriaId;
        this.ativo = true;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public UnidadeMedida getUnidadeMedida() { return unidadeMedida; }
    public void setUnidadeMedida(UnidadeMedida unidadeMedida) { this.unidadeMedida = unidadeMedida; }
    public Double getPesoVolume() { return pesoVolume; }
    public void setPesoVolume(Double pesoVolume) { this.pesoVolume = pesoVolume; }
    public String getUrlImagem() { return urlImagem; }
    public void setUrlImagem(String urlImagem) { this.urlImagem = urlImagem; }
    public UUID getCategoriaId() { return categoriaId; }
    public void setCategoriaId(UUID categoriaId) { this.categoriaId = categoriaId; }
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
        ProdutoBase that = (ProdutoBase) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
