package com.smartmarket.auth.application.usecase;

import com.smartmarket.auth.application.dto.RegistroUsuarioRequestDTO;
import com.smartmarket.auth.domain.model.Papel;
import com.smartmarket.auth.domain.model.PapelNome;
import com.smartmarket.auth.domain.model.Usuario;
import com.smartmarket.auth.domain.model.UsuarioStatus;
import com.smartmarket.auth.domain.repository.PapelDomainRepository;
import com.smartmarket.auth.domain.repository.UsuarioDomainRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegistrarUsuarioUseCase {

    private final UsuarioDomainRepository usuarioRepository;
    private final PapelDomainRepository papelRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrarUsuarioUseCase(UsuarioDomainRepository usuarioRepository,
                                   PapelDomainRepository papelRepository,
                                   PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.papelRepository = papelRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void execute(RegistroUsuarioRequestDTO registroRequest) {
        if (usuarioRepository.findByEmail(registroRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Erro: E-mail já está em uso!");
        }

        Usuario usuario = new Usuario(
                null, // ID será gerado pelo banco
                registroRequest.getNome(),
                registroRequest.getEmail(),
                passwordEncoder.encode(registroRequest.getSenha()),
                UsuarioStatus.ATIVO
        );

        PapelNome papelNome;
        try {
            papelNome = PapelNome.valueOf(registroRequest.getPapel());
        } catch (IllegalArgumentException | NullPointerException e) {
            // Default para CLIENTE se não enviado ou inválido
            papelNome = PapelNome.ROLE_CLIENTE;
        }

        Papel papel = papelRepository.findByNome(papelNome)
                .orElseThrow(() -> new RuntimeException("Erro: Papel " + registroRequest.getPapel() + " não encontrado."));

        usuario.adicionarPapel(papel);

        usuarioRepository.save(usuario);
    }
}
