package com.smartmarket.auth.application.usecase;

import com.smartmarket.auth.domain.model.UsuarioStatus;
import com.smartmarket.auth.infrastructure.adapter.out.persistence.UsuarioEntity;
import com.smartmarket.auth.infrastructure.adapter.out.persistence.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlterarStatusUsuarioUseCase {

    private final UsuarioRepository usuarioRepository;

    @Transactional
    public void execute(UUID id, String novoStatus) {
        UsuarioEntity usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        usuario.setStatus(UsuarioStatus.valueOf(novoStatus));
        usuarioRepository.save(usuario);
    }
}
