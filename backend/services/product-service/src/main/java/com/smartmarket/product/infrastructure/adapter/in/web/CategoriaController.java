package com.smartmarket.product.infrastructure.adapter.in.web;

import com.smartmarket.product.application.usecase.ListarCategoriasUseCase;
import com.smartmarket.product.infrastructure.adapter.out.persistence.CategoriaEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {
    private final ListarCategoriasUseCase listarCategoriasUseCase;

    public CategoriaController(ListarCategoriasUseCase listarCategoriasUseCase) {
        this.listarCategoriasUseCase = listarCategoriasUseCase;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaEntity>> listar() {
        return ResponseEntity.ok(listarCategoriasUseCase.execute());
    }
}
