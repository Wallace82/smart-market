package com.smartmarket.auth.application.usecase;

import com.smartmarket.auth.application.dto.UsuarioResponseDTO;
import com.smartmarket.auth.infrastructure.adapter.out.persistence.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListarUsuariosUseCase {

    private final UsuarioRepository usuarioRepository;

    public List<UsuarioResponseDTO> execute() {
        return usuarioRepository.findAll().stream()
                .map(u -> {
                    String roleName = u.getPapeis().stream()
                            .findFirst()
                            .map(p -> {
                                String name = p.getNome().name().replace("ROLE_", "");
                                return name.equals("GESTOR") ? "MANAGER" : (name.equals("CLIENTE") ? "CLIENT" : name);
                            })
                            .orElse("CLIENT");
                    
                    return UsuarioResponseDTO.builder()
                            .id(u.getId())
                            .nome(u.getNome())
                            .email(u.getEmail())
                            .role(roleName)
                            .status(u.getStatus().name())
                            .ultimoAcesso(u.getUltimoLoginEm() != null ? u.getUltimoLoginEm().toString() : "Nunca")
                            .build();
                })
                .collect(Collectors.toList());
    }
}
