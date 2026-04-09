package com.smartmarket.product.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "temas_encarte")
public class TemaEncarteEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "url_background_decorativo", length = 500)
    private String urlBackgroundDecorativo;

    @Column(name = "cor_fundo_hex", length = 7)
    private String corFundoHex;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    protected void onCreate() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getUrlBackgroundDecorativo() { return urlBackgroundDecorativo; }
    public void setUrlBackgroundDecorativo(String urlBackgroundDecorativo) { this.urlBackgroundDecorativo = urlBackgroundDecorativo; }
    public String getCorFundoHex() { return corFundoHex; }
    public void setCorFundoHex(String corFundoHex) { this.corFundoHex = corFundoHex; }
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
