package com.smartmarket.product.infrastructure.web;

import com.smartmarket.product.application.usecase.CriarOfertaUseCase;
import com.smartmarket.product.domain.model.OfertaSupermercado;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ofertas")
public class OfertaController {

    private final CriarOfertaUseCase criarOfertaUseCase;

    public OfertaController(CriarOfertaUseCase criarOfertaUseCase) {
        this.criarOfertaUseCase = criarOfertaUseCase;
    }

    @PostMapping("/supermercado/{supermercadoId}/produto/{produtoBaseId}")
    public ResponseEntity<?> criarOferta(
            @PathVariable UUID supermercadoId,
            @PathVariable UUID produtoBaseId,
            @RequestBody OfertaSupermercado oferta) {
        try {
            OfertaSupermercado salva = criarOfertaUseCase.execute(supermercadoId, produtoBaseId, oferta);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}
