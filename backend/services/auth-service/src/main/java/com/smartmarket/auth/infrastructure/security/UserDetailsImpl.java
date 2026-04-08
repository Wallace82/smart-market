package com.smartmarket.auth.infrastructure.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.smartmarket.auth.domain.model.Usuario;
import com.smartmarket.auth.domain.model.UsuarioStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private UUID id;
    private String email;

    @JsonIgnore
    private String senhaHash;
    
    private UsuarioStatus status;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(UUID id, String email, String senhaHash, UsuarioStatus status,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.senhaHash = senhaHash;
        this.status = status;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(Usuario usuario) {
        List<GrantedAuthority> authorities = usuario.getPapeis().stream()
                .map(papel -> new SimpleGrantedAuthority(papel.getNome().name()))
                .collect(Collectors.toList());

        return new UserDetailsImpl(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getSenhaHash(),
                usuario.getStatus(),
                authorities);
    }

    public UUID getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return senhaHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !UsuarioStatus.BLOQUEADO.equals(status);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return UsuarioStatus.ATIVO.equals(status);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
