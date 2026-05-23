package com.smartmarket.client.infrastructure.adapter.out.persistence;

import com.smartmarket.client.application.port.out.PreferenciaProdutoRepository;
import com.smartmarket.client.domain.model.PreferenciaProduto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ClientePreferenciaRepositoryAdapter implements PreferenciaProdutoRepository {

    private final ClientePreferenciaJpaRepository jpaRepository;

    @Override
    public List<PreferenciaProduto> findAllByClienteAuthId(UUID clienteAuthId) {
        return jpaRepository.findAllByClienteAuthIdOrderByCriadoEmDesc(clienteAuthId)
                .stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<PreferenciaProduto> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<PreferenciaProduto> findByClienteAuthIdAndProdutoBaseId(UUID clienteAuthId, UUID produtoBaseId) {
        return jpaRepository.findByClienteAuthIdAndProdutoBaseId(clienteAuthId, produtoBaseId).map(this::toDomain);
    }

    @Override
    public PreferenciaProduto save(PreferenciaProduto preferencia) {
        ClientePreferenciaEntity entity = toEntity(preferencia);
        return toDomain(jpaRepository.save(entity));
    }

    @Override
    public void delete(UUID id) {
        jpaRepository.deleteById(id);
    }

    private PreferenciaProduto toDomain(ClientePreferenciaEntity e) {
        PreferenciaProduto d = new PreferenciaProduto();
        d.setId(e.getId());
        d.setClienteAuthId(e.getClienteAuthId());
        d.setProdutoBaseId(e.getProdutoBaseId());
        d.setNomeProduto(e.getNomeProduto());
        d.setCategoriaId(e.getCategoriaId());
        d.setCategoriaNome(e.getCategoriaNome());
        d.setMarca(e.getMarca());
        d.setUnidadeMedida(e.getUnidadeMedida());
        d.setUrlImagem(e.getUrlImagem());
        d.setCriadoEm(e.getCriadoEm());
        return d;
    }

    private ClientePreferenciaEntity toEntity(PreferenciaProduto d) {
        ClientePreferenciaEntity e = new ClientePreferenciaEntity();
        e.setId(d.getId() != null ? d.getId() : UUID.randomUUID());
        e.setClienteAuthId(d.getClienteAuthId());
        e.setProdutoBaseId(d.getProdutoBaseId());
        e.setNomeProduto(d.getNomeProduto());
        e.setCategoriaId(d.getCategoriaId());
        e.setCategoriaNome(d.getCategoriaNome());
        e.setMarca(d.getMarca());
        e.setUnidadeMedida(d.getUnidadeMedida());
        e.setUrlImagem(d.getUrlImagem());
        e.setCriadoEm(d.getCriadoEm());
        return e;
    }
}
