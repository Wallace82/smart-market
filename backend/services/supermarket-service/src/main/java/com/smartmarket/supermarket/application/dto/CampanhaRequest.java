package com.smartmarket.supermarket.application.dto;

import java.util.UUID;

public class CampanhaRequest {
    private UUID supermercadoId;
    private String nome;
    private String segmento;
    private String raio;
    private String status;

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
}
