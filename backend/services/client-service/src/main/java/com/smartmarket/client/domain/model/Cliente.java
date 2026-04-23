package com.smartmarket.client.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Cliente {
    private UUID id;
    private UUID authUserId; // Ligação com o auth-service
    private String nome;
    private String cpf;
    private String telefone;
    private ClienteStatus status;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public Cliente() {
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAuthUserId() { return authUserId; }
    public void setAuthUserId(UUID authUserId) { this.authUserId = authUserId; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public ClienteStatus getStatus() { return status; }
    public void setStatus(ClienteStatus status) { this.status = status; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }

    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
