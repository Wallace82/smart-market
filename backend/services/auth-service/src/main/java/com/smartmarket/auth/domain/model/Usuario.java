package com.smartmarket.auth.domain.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

public class Usuario {
    private UUID id;
    private String nome;
    private String email;
    private String senhaHash;
    private UsuarioStatus status;
    private LocalDateTime ultimoLoginEm;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
    private Set<Papel> papeis = new HashSet<>();

    public Usuario() {
    }

    public Usuario(UUID id, String nome, String email, String senhaHash, UsuarioStatus status) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.status = status;
        this.criadoEm = LocalDateTime.now();
    }

    public void adicionarPapel(Papel papel) {
        this.papeis.add(papel);
    }

    public void removerPapel(Papel papel) {
        this.papeis.remove(papel);
    }

    // Getters e Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public UsuarioStatus getStatus() {
        return status;
    }

    public void setStatus(UsuarioStatus status) {
        this.status = status;
    }

    public LocalDateTime getUltimoLoginEm() {
        return ultimoLoginEm;
    }

    public void setUltimoLoginEm(LocalDateTime ultimoLoginEm) {
        this.ultimoLoginEm = ultimoLoginEm;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public Set<Papel> getPapeis() {
        return papeis;
    }

    public void setPapeis(Set<Papel> papeis) {
        this.papeis = papeis;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return Objects.equals(id, usuario.id) && Objects.equals(email, usuario.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }
}
