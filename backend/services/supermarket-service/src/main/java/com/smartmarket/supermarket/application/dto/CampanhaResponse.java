package com.smartmarket.supermarket.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CampanhaResponse {
    private UUID id;
    private UUID supermercadoId;
    private String nome;
    private String segmento;
    private String raio;
    private String status;
    private int pushesEnviados;
    private int conversoes;
    private LocalDateTime criadoEm;

    public CampanhaResponse() {}

    public CampanhaResponse(UUID id, UUID supermercadoId, String nome, String segmento, String raio, String status, int pushesEnviados, int conversoes, LocalDateTime criadoEm) {
        this.id = id;
        this.supermercadoId = supermercadoId;
        this.nome = nome;
        this.segmento = segmento;
        this.raio = raio;
        this.status = status;
        this.pushesEnviados = pushesEnviados;
        this.conversoes = conversoes;
        this.criadoEm = criadoEm;
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
