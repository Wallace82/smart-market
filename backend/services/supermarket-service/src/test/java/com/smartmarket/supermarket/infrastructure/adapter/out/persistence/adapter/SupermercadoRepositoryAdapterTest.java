package com.smartmarket.supermarket.infrastructure.adapter.out.persistence.adapter;

import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.SupermercadoEntity;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.SupermercadoRepository;
import com.smartmarket.supermarket.infrastructure.adapter.out.persistence.mapper.SupermercadoMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SupermercadoRepositoryAdapterTest {

    @Mock
    private SupermercadoRepository jpaRepository;

    @Mock
    private SupermercadoMapper mapper;

    @InjectMocks
    private SupermercadoRepositoryAdapter adapter;

    @Test
    void shouldFindById() {
        UUID id = UUID.randomUUID();
        SupermercadoEntity entity = new SupermercadoEntity();
        Supermercado domain = new Supermercado();

        when(jpaRepository.findById(id)).thenReturn(Optional.of(entity));
        when(mapper.toDomain(entity)).thenReturn(domain);

        Optional<Supermercado> result = adapter.findById(id);

        assertThat(result).isPresent().contains(domain);
        verify(jpaRepository).findById(id);
    }

    @Test
    void shouldFindAll() {
        int page = 0, size = 10;
        SupermercadoEntity entity = new SupermercadoEntity();
        Supermercado domain = new Supermercado();
        Page<SupermercadoEntity> pageResult = new PageImpl<>(Collections.singletonList(entity));

        when(jpaRepository.findAll(PageRequest.of(page, size))).thenReturn(pageResult);
        when(mapper.toDomain(entity)).thenReturn(domain);

        List<Supermercado> result = adapter.findAll(page, size);

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(domain);
    }

    @Test
    void shouldSave() {
        Supermercado domain = new Supermercado();
        SupermercadoEntity entity = new SupermercadoEntity();
        SupermercadoEntity savedEntity = new SupermercadoEntity();
        Supermercado savedDomain = new Supermercado();

        when(mapper.toEntity(domain)).thenReturn(entity);
        when(jpaRepository.save(entity)).thenReturn(savedEntity);
        when(mapper.toDomain(savedEntity)).thenReturn(savedDomain);

        Supermercado result = adapter.save(domain);

        assertThat(result).isEqualTo(savedDomain);
        verify(jpaRepository).save(entity);
    }

    @Test
    void shouldExistsByCnpj() {
        String cnpj = "12345678000100";
        when(jpaRepository.existsByCnpj(cnpj)).thenReturn(true);

        boolean exists = adapter.existsByCnpj(cnpj);

        assertThat(exists).isTrue();
        verify(jpaRepository).existsByCnpj(cnpj);
    }

    @Test
    void shouldFindByGestorId() {
        UUID gestorId = UUID.randomUUID();
        SupermercadoEntity entity = new SupermercadoEntity();
        Supermercado domain = new Supermercado();

        when(jpaRepository.findByGestorId(gestorId)).thenReturn(Collections.singletonList(entity));
        when(mapper.toDomain(entity)).thenReturn(domain);

        List<Supermercado> result = adapter.findByGestorId(gestorId);

        assertThat(result).hasSize(1).contains(domain);
        verify(jpaRepository).findByGestorId(gestorId);
    }
}
