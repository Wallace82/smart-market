package com.smartmarket.client.application.usecase;

import com.smartmarket.client.application.port.in.GerenciarLocaisPort;
import com.smartmarket.client.application.port.out.LocalFavoritoRepository;
import com.smartmarket.client.domain.model.LocalFavorito;
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
public class GerenciarLocaisUseCase implements GerenciarLocaisPort {

    private static final int MAX_LOCAIS = 10;

    private final LocalFavoritoRepository localRepository;

    @Override
    public List<LocalFavorito> listar(UUID clienteAuthId) {
        log.debug("Listando locais do cliente: {}", clienteAuthId);
        return localRepository.findAllByClienteAuthId(clienteAuthId);
    }

    @Override
    @Transactional
    public LocalFavorito salvar(UUID clienteAuthId, LocalFavorito local) {
        int count = localRepository.countByClienteAuthId(clienteAuthId);
        if (count >= MAX_LOCAIS) {
            throw new IllegalStateException("Limite de " + MAX_LOCAIS + " locais favoritos atingido.");
        }

        local.setClienteAuthId(clienteAuthId);
        local.setCriadoEm(LocalDateTime.now());
        local.setAtivo(false);

        if (local.getRaioKm() == null || local.getRaioKm() <= 0) {
            local.setRaioKm(10);
        }

        LocalFavorito salvo = localRepository.save(local);
        log.info("Local '{}' salvo para cliente {}", salvo.getApelido(), clienteAuthId);
        return salvo;
    }

    @Override
    @Transactional
    public void remover(UUID clienteAuthId, UUID localId) {
        LocalFavorito local = localRepository.findById(localId)
                .orElseThrow(() -> new NoSuchElementException("Local não encontrado: " + localId));

        if (!local.getClienteAuthId().equals(clienteAuthId)) {
            throw new SecurityException("Acesso negado ao local: " + localId);
        }

        localRepository.delete(localId);
        log.info("Local {} removido para cliente {}", localId, clienteAuthId);
    }

    @Override
    @Transactional
    public LocalFavorito definirAtivo(UUID clienteAuthId, UUID localId) {
        LocalFavorito local = localRepository.findById(localId)
                .orElseThrow(() -> new NoSuchElementException("Local não encontrado: " + localId));

        if (!local.getClienteAuthId().equals(clienteAuthId)) {
            throw new SecurityException("Acesso negado ao local: " + localId);
        }

        // Desativa todos os outros locais deste cliente
        localRepository.desativarTodos(clienteAuthId);

        // Ativa o local selecionado
        local.setAtivo(true);
        local.setAtualizadoEm(LocalDateTime.now());
        LocalFavorito atualizado = localRepository.save(local);

        log.info("Local '{}' definido como ativo para cliente {}", atualizado.getApelido(), clienteAuthId);
        return atualizado;
    }
}
