package com.smartmarket.supermarket.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.model.SupermercadoStatus;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.SupermercadoEntity;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class SupermercadoMapperTest {

    private final SupermercadoMapper mapper = new SupermercadoMapper();

    @Test
    void shouldMapEntityToDomain() {
        SupermercadoEntity entity = new SupermercadoEntity();
        entity.setId(UUID.randomUUID());
        entity.setNomeFantasia("Super Market");
        entity.setCnpj("12345678000100");
        entity.setStatus(SupermercadoStatus.ATIVO);
        entity.setCriadoEm(LocalDateTime.now());

        Supermercado domain = mapper.toDomain(entity);

        assertThat(domain).isNotNull();
        assertThat(domain.getId()).isEqualTo(entity.getId());
        assertThat(domain.getNomeFantasia()).isEqualTo(entity.getNomeFantasia());
        assertThat(domain.getCnpj()).isEqualTo(entity.getCnpj());
        assertThat(domain.getStatus()).isEqualTo(entity.getStatus());
        assertThat(domain.getCriadoEm()).isEqualTo(entity.getCriadoEm());
    }

    @Test
    void shouldMapDomainToEntity() {
        Supermercado domain = new Supermercado();
        domain.setId(UUID.randomUUID());
        domain.setNomeFantasia("Super Market Domain");
        domain.setStatus(SupermercadoStatus.INATIVO);

        SupermercadoEntity entity = mapper.toEntity(domain);

        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(domain.getId());
        assertThat(entity.getNomeFantasia()).isEqualTo(domain.getNomeFantasia());
        assertThat(entity.getStatus()).isEqualTo(domain.getStatus());
    }

    @Test
    void shouldReturnNullWhenMappingNull() {
        assertThat(mapper.toDomain(null)).isNull();
        assertThat(mapper.toEntity(null)).isNull();
    }
}
