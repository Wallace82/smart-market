package com.smartmarket.client.application.usecase;

import com.smartmarket.client.application.port.in.GerenciarPreferenciasPort;
import com.smartmarket.client.application.port.out.PreferenciaProdutoRepository;
import com.smartmarket.client.domain.model.PreferenciaProduto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class GerenciarPreferenciasUseCase implements GerenciarPreferenciasPort {

    private final PreferenciaProdutoRepository preferenciaRepository;

    @Override
    public List<PreferenciaProduto> listar(UUID clienteAuthId) {
        log.debug("Listando preferências do cliente: {}", clienteAuthId);
        return preferenciaRepository.findAllByClienteAuthId(clienteAuthId);
    }

    @Override
    @Transactional
    public PreferenciaProduto salvar(UUID clienteAuthId, PreferenciaProduto preferencia) {
        // Verifica se já existe preferência para este produto (idempotente)
        if (preferencia.getProdutoBaseId() != null) {
            preferenciaRepository.findByClienteAuthIdAndProdutoBaseId(clienteAuthId, preferencia.getProdutoBaseId())
                    .ifPresent(existing -> {
                        throw new IllegalStateException("Produto já adicionado às preferências.");
                    });
        }

        preferencia.setClienteAuthId(clienteAuthId);
        preferencia.setCriadoEm(LocalDateTime.now());

        PreferenciaProduto salva = preferenciaRepository.save(preferencia);
        log.info("Preferência '{}' salva para cliente {}", salva.getNomeProduto(), clienteAuthId);
        return salva;
    }

    @Override
    @Transactional
    public void remover(UUID clienteAuthId, UUID preferenciaId) {
        PreferenciaProduto preferencia = preferenciaRepository.findById(preferenciaId)
                .orElseThrow(() -> new NoSuchElementException("Preferência não encontrada: " + preferenciaId));

        if (!preferencia.getClienteAuthId().equals(clienteAuthId)) {
            throw new SecurityException("Acesso negado à preferência: " + preferenciaId);
        }

        preferenciaRepository.delete(preferenciaId);
        log.info("Preferência {} removida para cliente {}", preferenciaId, clienteAuthId);
    }
}
