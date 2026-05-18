package com.smartmarket.billing.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Assinatura {
    private UUID id;
    private UUID supermercadoId;
    private Plano plano;
    private CicloCobranca ciclo;
    private StatusAssinatura status;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private boolean renovacaoAutomatica;

    public Assinatura() {
    }

    public boolean isExpirada() {
        return dataFim != null && dataFim.isBefore(LocalDateTime.now());
    }

    public boolean isAtiva() {
        return status == StatusAssinatura.ATIVA && !isExpirada();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getSupermercadoId() { return supermercadoId; }
    public void setSupermercadoId(UUID supermercadoId) { this.supermercadoId = supermercadoId; }
    public Plano getPlano() { return plano; }
    public void setPlano(Plano plano) { this.plano = plano; }
    public CicloCobranca getCiclo() { return ciclo; }
    public void setCiclo(CicloCobranca ciclo) { this.ciclo = ciclo; }
    public StatusAssinatura getStatus() { return status; }
    public void setStatus(StatusAssinatura status) { this.status = status; }
    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }
    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }
    public boolean isRenovacaoAutomatica() { return renovacaoAutomatica; }
    public void setRenovacaoAutomatica(boolean renovacaoAutomatica) { this.renovacaoAutomatica = renovacaoAutomatica; }
}
