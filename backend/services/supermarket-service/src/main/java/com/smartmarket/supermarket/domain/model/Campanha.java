package com.smartmarket.supermarket.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Campanha {
    private UUID id;
    private UUID supermercadoId;
    private String nome;
    private String segmento;
    private String raio;
    private String status; // 'Ativa' | 'Pausada' | 'Concluída'
    private int pushesEnviados;
    private int conversoes;
    private LocalDateTime criadoEm;

    public Campanha() {
        this.status = "Ativa";
        this.pushesEnviados = 0;
        this.conversoes = 0;
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
