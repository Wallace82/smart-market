package com.smartmarket.client.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class PreferenciaProdutoResponse {

    private UUID id;
    private UUID produtoBaseId;
    private String nomeProduto;
    private UUID categoriaId;
    private String categoriaNome;
    private String marca;
    private String unidadeMedida;
    private String urlImagem;
    private LocalDateTime criadoEm;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProdutoBaseId() { return produtoBaseId; }
    public void setProdutoBaseId(UUID produtoBaseId) { this.produtoBaseId = produtoBaseId; }

    public String getNomeProduto() { return nomeProduto; }
    public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

    public UUID getCategoriaId() { return categoriaId; }
    public void setCategoriaId(UUID categoriaId) { this.categoriaId = categoriaId; }

    public String getCategoriaNome() { return categoriaNome; }
    public void setCategoriaNome(String categoriaNome) { this.categoriaNome = categoriaNome; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getUnidadeMedida() { return unidadeMedida; }
    public void setUnidadeMedida(String unidadeMedida) { this.unidadeMedida = unidadeMedida; }

    public String getUrlImagem() { return urlImagem; }
    public void setUrlImagem(String urlImagem) { this.urlImagem = urlImagem; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
