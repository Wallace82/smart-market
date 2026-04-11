package com.smartmarket.product.infrastructure.persistence;

import com.smartmarket.product.domain.model.EncarteStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "encartes_digitais")
public class EncarteDigitalEntity {

    @Id
    private UUID id;

    @Column(name = "supermercado_id", nullable = false)
    private UUID supermercadoId;

    @Column(name = "tema_id")
    private UUID temaId;

    @Column(nullable = false)
    private String titulo;

    @Column(name = "data_inicio", nullable = false)
    private LocalDateTime dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDateTime dataFim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EncarteStatus status;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "encarteDigital", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EncarteItemEntity> itens = new ArrayList<>();

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

    public void addEncarteItem(EncarteItemEntity item) {
        itens.add(item);
        item.setEncarteDigital(this);
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSupermercadoId() { return supermercadoId; }
    public void setSupermercadoId(UUID supermercadoId) { this.supermercadoId = supermercadoId; }
    public UUID getTemaId() { return temaId; }
    public void setTemaId(UUID temaId) { this.temaId = temaId; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }
    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }
    public EncarteStatus getStatus() { return status; }
    public void setStatus(EncarteStatus status) { this.status = status; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
    public List<EncarteItemEntity> getItens() { return itens; }
    public void setItens(List<EncarteItemEntity> itens) { this.itens = itens; }
}
