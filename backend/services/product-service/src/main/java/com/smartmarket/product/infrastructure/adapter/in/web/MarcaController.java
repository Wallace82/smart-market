package com.smartmarket.product.infrastructure.adapter.in.web;

import com.smartmarket.product.application.usecase.ListarMarcasUseCase;
import com.smartmarket.product.infrastructure.adapter.out.persistence.MarcaEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/marcas")
public class MarcaController {
    private final ListarMarcasUseCase listarMarcasUseCase;

    public MarcaController(ListarMarcasUseCase listarMarcasUseCase) {
        this.listarMarcasUseCase = listarMarcasUseCase;
    }

    @GetMapping
    public ResponseEntity<List<MarcaEntity>> listar() {
        return ResponseEntity.ok(listarMarcasUseCase.execute());
    }
}
