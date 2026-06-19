package com.smartmarket.product.infrastructure.adapter.in.web;
 
import com.smartmarket.product.application.usecase.CriarOfertaUseCase;
import com.smartmarket.product.application.usecase.ListarOfertasUseCase;
import com.smartmarket.product.application.usecase.AtualizarOfertaUseCase;
import com.smartmarket.product.application.usecase.ExcluirOfertaUseCase;
import com.smartmarket.product.application.usecase.ObterOfertaUseCase;
import com.smartmarket.product.domain.model.OfertaSupermercado;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import java.util.UUID;
 
@RestController
@RequestMapping("/api/v1/ofertas")
public class OfertaController {
 
    private final CriarOfertaUseCase criarOfertaUseCase;
    private final ListarOfertasUseCase listarOfertasUseCase;
    private final AtualizarOfertaUseCase atualizarOfertaUseCase;
    private final ExcluirOfertaUseCase excluirOfertaUseCase;
    private final ObterOfertaUseCase obterOfertaUseCase;
 
    public OfertaController(
            CriarOfertaUseCase criarOfertaUseCase, 
            ListarOfertasUseCase listarOfertasUseCase,
            AtualizarOfertaUseCase atualizarOfertaUseCase,
            ExcluirOfertaUseCase excluirOfertaUseCase,
            ObterOfertaUseCase obterOfertaUseCase) {
        this.criarOfertaUseCase = criarOfertaUseCase;
        this.listarOfertasUseCase = listarOfertasUseCase;
        this.atualizarOfertaUseCase = atualizarOfertaUseCase;
        this.excluirOfertaUseCase = excluirOfertaUseCase;
        this.obterOfertaUseCase = obterOfertaUseCase;
    }
 
    @PostMapping("/supermercado/{supermercadoId}/produto/{produtoBaseId}")
    public ResponseEntity<?> criarOferta(
            @PathVariable("supermercadoId") UUID supermercadoId,
            @PathVariable("produtoBaseId") UUID produtoBaseId,
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
 
    @GetMapping
    public ResponseEntity<java.util.List<OfertaSupermercado>> listar(@RequestParam("supermercadoId") UUID supermercadoId) {
        return ResponseEntity.ok(listarOfertasUseCase.execute(supermercadoId));
    }
 
    @PutMapping("/{id}/produto/{produtoBaseId}")
    public ResponseEntity<?> atualizarOferta(
            @PathVariable("id") UUID id,
            @PathVariable("produtoBaseId") UUID produtoBaseId,
            @RequestBody OfertaSupermercado oferta) {
        try {
            OfertaSupermercado atualizada = atualizarOfertaUseCase.execute(id, produtoBaseId, oferta);
            return ResponseEntity.ok(atualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirOferta(@PathVariable("id") UUID id) {
        try {
            excluirOfertaUseCase.execute(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfertaSupermercado> obterPorId(@PathVariable("id") UUID id) {
        return obterOfertaUseCase.execute(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
