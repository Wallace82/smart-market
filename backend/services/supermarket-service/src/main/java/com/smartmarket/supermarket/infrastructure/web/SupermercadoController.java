package com.smartmarket.supermarket.infrastructure.web;

import com.smartmarket.supermarket.application.usecase.AlterarStatusSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.CadastrarSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.ListarSupermercadoUseCase;
import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.model.SupermercadoStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/supermercados")
public class SupermercadoController {

    private final CadastrarSupermercadoUseCase cadastrarSupermercadoUseCase;
    private final AlterarStatusSupermercadoUseCase alterarStatusSupermercadoUseCase;
    private final ListarSupermercadoUseCase listarSupermercadoUseCase;

    public SupermercadoController(CadastrarSupermercadoUseCase cadastrarSupermercadoUseCase,
                                  AlterarStatusSupermercadoUseCase alterarStatusSupermercadoUseCase,
                                  ListarSupermercadoUseCase listarSupermercadoUseCase) {
        this.cadastrarSupermercadoUseCase = cadastrarSupermercadoUseCase;
        this.alterarStatusSupermercadoUseCase = alterarStatusSupermercadoUseCase;
        this.listarSupermercadoUseCase = listarSupermercadoUseCase;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Supermercado supermercado) {
        try {
            Supermercado salvo = cadastrarSupermercadoUseCase.execute(supermercado);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Supermercado>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(listarSupermercadoUseCase.buscarTodos(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(listarSupermercadoUseCase.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/gestor/{gestorId}")
    public ResponseEntity<List<Supermercado>> buscarPorGestor(@PathVariable UUID gestorId) {
        return ResponseEntity.ok(listarSupermercadoUseCase.buscarPorGestorId(gestorId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(@PathVariable UUID id, @RequestParam SupermercadoStatus novoStatus) {
        try {
            Supermercado atualizado = alterarStatusSupermercadoUseCase.execute(id, novoStatus);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
