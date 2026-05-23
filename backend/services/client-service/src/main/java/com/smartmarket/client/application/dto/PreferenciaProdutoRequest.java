package com.smartmarket.client.application.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public class PreferenciaProdutoRequest {

    private UUID produtoBaseId;

    @NotBlank(message = "O nome do produto é obrigatório")
    private String nomeProduto;

    private UUID categoriaId;
    private String categoriaNome;
    private String marca;
    private String unidadeMedida;
    private String urlImagem;

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
}
