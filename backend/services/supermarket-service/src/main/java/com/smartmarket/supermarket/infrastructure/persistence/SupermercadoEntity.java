package com.smartmarket.supermarket.infrastructure.persistence;

import com.smartmarket.supermarket.domain.model.SupermercadoStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "supermercados")
public class SupermercadoEntity {

    @Id
    private UUID id;

    @Column(name = "nome_fantasia", nullable = false)
    private String nomeFantasia;

    @Column(nullable = false, unique = true, length = 14)
    private String cnpj;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupermercadoStatus status;

    @Column(nullable = false)
    private String endereco;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(name = "raio_atuacao")
    private Integer raioAtuacao;

    @Column(name = "gestor_id", nullable = false)
    private UUID gestorId;

    @Column(name = "url_logomarca")
    private String urlLogomarca;

    @Column(name = "cor_primaria_hex", length = 7)
    private String corPrimariaHex;

    @Column(name = "cor_secundaria_hex", length = 7)
    private String corSecundariaHex;

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
    public String getNomeFantasia() { return nomeFantasia; }
    public void setNomeFantasia(String nomeFantasia) { this.nomeFantasia = nomeFantasia; }
    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }
    public SupermercadoStatus getStatus() { return status; }
    public void setStatus(SupermercadoStatus status) { this.status = status; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Integer getRaioAtuacao() { return raioAtuacao; }
    public void setRaioAtuacao(Integer raioAtuacao) { this.raioAtuacao = raioAtuacao; }
    public UUID getGestorId() { return gestorId; }
    public void setGestorId(UUID gestorId) { this.gestorId = gestorId; }
    
    public String getUrlLogomarca() { return urlLogomarca; }
    public void setUrlLogomarca(String urlLogomarca) { this.urlLogomarca = urlLogomarca; }
    public String getCorPrimariaHex() { return corPrimariaHex; }
    public void setCorPrimariaHex(String corPrimariaHex) { this.corPrimariaHex = corPrimariaHex; }
    public String getCorSecundariaHex() { return corSecundariaHex; }
    public void setCorSecundariaHex(String corSecundariaHex) { this.corSecundariaHex = corSecundariaHex; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
