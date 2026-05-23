package com.smartmarket.client.infrastructure.adapter.out.persistence;

import com.smartmarket.client.application.port.out.LocalFavoritoRepository;
import com.smartmarket.client.domain.model.LocalFavorito;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ClienteLocalRepositoryAdapter implements LocalFavoritoRepository {

    private final ClienteLocalJpaRepository jpaRepository;

    @Override
    public List<LocalFavorito> findAllByClienteAuthId(UUID clienteAuthId) {
        return jpaRepository.findAllByClienteAuthIdOrderByCriadoEmDesc(clienteAuthId)
                .stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<LocalFavorito> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<LocalFavorito> findAtivoByClienteAuthId(UUID clienteAuthId) {
        return jpaRepository.findByClienteAuthIdAndAtivoTrue(clienteAuthId).map(this::toDomain);
    }

    @Override
    public LocalFavorito save(LocalFavorito local) {
        ClienteLocalEntity entity = toEntity(local);
        return toDomain(jpaRepository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public void desativarTodos(UUID clienteAuthId) {
        jpaRepository.desativarTodosDoCliente(clienteAuthId);
    }

    @Override
    public int countByClienteAuthId(UUID clienteAuthId) {
        return jpaRepository.countByClienteAuthId(clienteAuthId);
    }

    private LocalFavorito toDomain(ClienteLocalEntity e) {
        LocalFavorito d = new LocalFavorito();
        d.setId(e.getId());
        d.setClienteAuthId(e.getClienteAuthId());
        d.setApelido(e.getApelido());
        d.setEndereco(e.getEndereco());
        d.setCep(e.getCep());
        d.setBairro(e.getBairro());
        d.setCidade(e.getCidade());
        d.setEstado(e.getEstado());
        d.setLatitude(e.getLatitude());
        d.setLongitude(e.getLongitude());
        d.setRaioKm(e.getRaioKm());
        d.setAtivo(e.isAtivo());
        d.setCriadoEm(e.getCriadoEm());
        d.setAtualizadoEm(e.getAtualizadoEm());
        return d;
    }

    private ClienteLocalEntity toEntity(LocalFavorito d) {
        ClienteLocalEntity e = new ClienteLocalEntity();
        e.setId(d.getId() != null ? d.getId() : UUID.randomUUID());
        e.setClienteAuthId(d.getClienteAuthId());
        e.setApelido(d.getApelido());
        e.setEndereco(d.getEndereco());
        e.setCep(d.getCep());
        e.setBairro(d.getBairro());
        e.setCidade(d.getCidade());
        e.setEstado(d.getEstado());
        e.setLatitude(d.getLatitude());
        e.setLongitude(d.getLongitude());
        e.setRaioKm(d.getRaioKm() != null ? d.getRaioKm() : 10);
        e.setAtivo(d.isAtivo());
        e.setCriadoEm(d.getCriadoEm());
        e.setAtualizadoEm(d.getAtualizadoEm());
        return e;
    }
}
