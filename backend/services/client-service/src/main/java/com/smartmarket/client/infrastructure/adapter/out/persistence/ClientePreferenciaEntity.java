package com.smartmarket.client.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cliente_preferencias_produto")
public class ClientePreferenciaEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "cliente_auth_id", nullable = false)
    private UUID clienteAuthId;

    @Column(name = "produto_base_id")
    private UUID produtoBaseId;

    @Column(name = "nome_produto", nullable = false, length = 255)
    private String nomeProduto;

    @Column(name = "categoria_id")
    private UUID categoriaId;

    @Column(name = "categoria_nome", length = 100)
    private String categoriaNome;

    @Column(name = "marca", length = 100)
    private String marca;

    @Column(name = "unidade_medida", length = 30)
    private String unidadeMedida;

    @Column(name = "url_imagem", length = 512)
    private String urlImagem;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID();
        if (criadoEm == null) criadoEm = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getClienteAuthId() { return clienteAuthId; }
    public void setClienteAuthId(UUID clienteAuthId) { this.clienteAuthId = clienteAuthId; }

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
