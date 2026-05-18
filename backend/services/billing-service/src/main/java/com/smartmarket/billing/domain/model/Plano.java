package com.smartmarket.billing.domain.model;

import java.math.BigDecimal;
import java.util.UUID;

public class Plano {
    private UUID id;
    private String nome;
    private Integer limiteOfertasMensais;
    private Integer limiteEncartesAtivos;
    private Integer raioAtuacaoKm;
    private Integer limiteNotificacoesMensais;
    private boolean possuiConcierge;
    private Integer conciergeUploadsMensais; // null se ilimitado ou não possui
    private Integer slaAtendimentoHoras;
    private String prioridadeFila;
    
    private BigDecimal precoMensal;
    private BigDecimal precoSemestral;
    private BigDecimal precoAnual;
    private boolean ativo;

    public Plano() {
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Integer getLimiteOfertasMensais() { return limiteOfertasMensais; }
    public void setLimiteOfertasMensais(Integer limiteOfertasMensais) { this.limiteOfertasMensais = limiteOfertasMensais; }
    public Integer getLimiteEncartesAtivos() { return limiteEncartesAtivos; }
    public void setLimiteEncartesAtivos(Integer limiteEncartesAtivos) { this.limiteEncartesAtivos = limiteEncartesAtivos; }
    public Integer getRaioAtuacaoKm() { return raioAtuacaoKm; }
    public void setRaioAtuacaoKm(Integer raioAtuacaoKm) { this.raioAtuacaoKm = raioAtuacaoKm; }
    public Integer getLimiteNotificacoesMensais() { return limiteNotificacoesMensais; }
    public void setLimiteNotificacoesMensais(Integer limiteNotificacoesMensais) { this.limiteNotificacoesMensais = limiteNotificacoesMensais; }
    public boolean isPossuiConcierge() { return possuiConcierge; }
    public void setPossuiConcierge(boolean possuiConcierge) { this.possuiConcierge = possuiConcierge; }
    public Integer getConciergeUploadsMensais() { return conciergeUploadsMensais; }
    public void setConciergeUploadsMensais(Integer conciergeUploadsMensais) { this.conciergeUploadsMensais = conciergeUploadsMensais; }
    public Integer getSlaAtendimentoHoras() { return slaAtendimentoHoras; }
    public void setSlaAtendimentoHoras(Integer slaAtendimentoHoras) { this.slaAtendimentoHoras = slaAtendimentoHoras; }
    public String getPrioridadeFila() { return prioridadeFila; }
    public void setPrioridadeFila(String prioridadeFila) { this.prioridadeFila = prioridadeFila; }
    public BigDecimal getPrecoMensal() { return precoMensal; }
    public void setPrecoMensal(BigDecimal precoMensal) { this.precoMensal = precoMensal; }
    public BigDecimal getPrecoSemestral() { return precoSemestral; }
    public void setPrecoSemestral(BigDecimal precoSemestral) { this.precoSemestral = precoSemestral; }
    public BigDecimal getPrecoAnual() { return precoAnual; }
    public void setPrecoAnual(BigDecimal precoAnual) { this.precoAnual = precoAnual; }
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
}
