package com.smartmarket.auth.infrastructure.persistence;

import com.smartmarket.auth.domain.model.PapelNome;
import jakarta.persistence.*;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "papeis")
public class PapelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private PapelNome nome;

    @Column
    private String descricao;

    // Getters and Setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public PapelNome getNome() { return nome; }
    public void setNome(PapelNome nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PapelEntity that = (PapelEntity) o;
        return Objects.equals(id, that.id) && nome == that.nome;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome);
    }
}
