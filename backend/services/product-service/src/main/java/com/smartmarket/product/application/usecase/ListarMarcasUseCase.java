package com.smartmarket.product.application.usecase;

import com.smartmarket.product.infrastructure.adapter.out.persistence.MarcaEntity;
import com.smartmarket.product.infrastructure.adapter.out.persistence.MarcaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ListarMarcasUseCase {
    private final MarcaRepository marcaRepository;

    public ListarMarcasUseCase(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    public List<MarcaEntity> execute() {
        return marcaRepository.findAllByAtivoTrueOrderByNomeAsc();
    }
}
