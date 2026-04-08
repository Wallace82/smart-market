package com.smartmarket.auth.domain.model;

import java.util.Objects;
import java.util.UUID;

public class Papel {
    private UUID id;
    private PapelNome nome;
    private String descricao;

    public Papel() {
    }

    public Papel(UUID id, PapelNome nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public PapelNome getNome() {
        return nome;
    }

    public void setNome(PapelNome nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Papel papel = (Papel) o;
        return Objects.equals(id, papel.id) && nome == papel.nome;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome);
    }
}
