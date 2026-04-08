package com.smartmarket.auth.infrastructure.security;

import com.smartmarket.auth.domain.model.Usuario;
import com.smartmarket.auth.domain.repository.UsuarioDomainRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioDomainRepository usuarioRepository;

    public UserDetailsServiceImpl(UsuarioDomainRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com e-mail: " + email));

        return UserDetailsImpl.build(usuario);
    }
}
