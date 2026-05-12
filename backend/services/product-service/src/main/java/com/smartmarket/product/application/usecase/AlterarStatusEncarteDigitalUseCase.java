package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteStatus;
import com.smartmarket.product.application.port.out.EncarteDigitalDomainRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Altera o status do Encarte Digital respeitando o ciclo de vida MVP (RF-05.5):
 *   RASCUNHO → ATIVO     (publicar)
 *   ATIVO    → ENCERRADO (encerrar)
 *
 * Transições inválidas lançam IllegalStateException.
 */
@Service
public class AlterarStatusEncarteDigitalUseCase {

    private final EncarteDigitalDomainRepository repository;

    public AlterarStatusEncarteDigitalUseCase(EncarteDigitalDomainRepository repository) {
        this.repository = repository;
    }

    public EncarteDigital execute(UUID id, EncarteStatus novoStatus) {
        EncarteDigital encarte = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Encarte digital não encontrado com ID: " + id));

        validarTransicao(encarte.getStatus(), novoStatus);

        encarte.setStatus(novoStatus);
        encarte.setAtualizadoEm(LocalDateTime.now());

        return repository.save(encarte);
    }

    private void validarTransicao(EncarteStatus atual, EncarteStatus novo) {
        boolean valido = switch (atual) {
            case RASCUNHO -> novo == EncarteStatus.ATIVO;
            case ATIVO    -> novo == EncarteStatus.ENCERRADO;
            case ENCERRADO -> false; // Status terminal — sem transições
        };
        if (!valido) {
            throw new IllegalStateException(
                    "Transição inválida de " + atual + " para " + novo +
                    ". Ciclo permitido: RASCUNHO → ATIVO → ENCERRADO (RF-05.5)."
            );
        }
    }
}

