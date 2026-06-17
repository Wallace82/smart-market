package com.smartmarket.supermarket.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "campanhas")
public class CampanhaEntity {

    @Id
    private UUID id;

    @Column(name = "supermercado_id", nullable = false)
    private UUID supermercadoId;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String segmento;

    @Column(nullable = false, length = 50)
    private String raio;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "pushes_enviados", nullable = false)
    private int pushesEnviados;

    @Column(nullable = false)
    private int conversoes;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getSupermercadoId() { return supermercadoId; }
    public void setSupermercadoId(UUID supermercadoId) { this.supermercadoId = supermercadoId; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getSegmento() { return segmento; }
    public void setSegmento(String segmento) { this.segmento = segmento; }

    public String getRaio() { return raio; }
    public void setRaio(String raio) { this.raio = raio; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getPushesEnviados() { return pushesEnviados; }
    public void setPushesEnviados(int pushesEnviados) { this.pushesEnviados = pushesEnviados; }

    public int getConversoes() { return conversoes; }
    public void setConversoes(int conversoes) { this.conversoes = conversoes; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
