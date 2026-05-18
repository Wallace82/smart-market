package com.smartmarket.product.application.usecase;

import com.smartmarket.product.infrastructure.adapter.out.persistence.CategoriaEntity;
import com.smartmarket.product.infrastructure.adapter.out.persistence.CategoriaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ListarCategoriasUseCase {
    private final CategoriaRepository categoriaRepository;

    public ListarCategoriasUseCase(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<CategoriaEntity> execute() {
        return categoriaRepository.findAllByAtivoTrueOrderByNomeAsc();
    }
}
