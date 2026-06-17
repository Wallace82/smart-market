package com.smartmarket.supermarket.infrastructure.adapter.in.web;

import com.smartmarket.supermarket.application.dto.CampanhaRequest;
import com.smartmarket.supermarket.application.dto.CampanhaResponse;
import com.smartmarket.supermarket.application.usecase.AlterarStatusCampanhaUseCase;
import com.smartmarket.supermarket.application.usecase.CadastrarCampanhaUseCase;
import com.smartmarket.supermarket.application.usecase.DeletarCampanhaUseCase;
import com.smartmarket.supermarket.application.usecase.ListarCampanhasPorSupermercadoUseCase;
import com.smartmarket.supermarket.domain.model.Campanha;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/campanhas")
public class CampanhaController {

    private final CadastrarCampanhaUseCase cadastrarCampanhaUseCase;
    private final ListarCampanhasPorSupermercadoUseCase listarCampanhasPorSupermercadoUseCase;
    private final AlterarStatusCampanhaUseCase alterarStatusCampanhaUseCase;
    private final DeletarCampanhaUseCase deletarCampanhaUseCase;

    public CampanhaController(CadastrarCampanhaUseCase cadastrarCampanhaUseCase,
                              ListarCampanhasPorSupermercadoUseCase listarCampanhasPorSupermercadoUseCase,
                              AlterarStatusCampanhaUseCase alterarStatusCampanhaUseCase,
                              DeletarCampanhaUseCase deletarCampanhaUseCase) {
        this.cadastrarCampanhaUseCase = cadastrarCampanhaUseCase;
        this.listarCampanhasPorSupermercadoUseCase = listarCampanhasPorSupermercadoUseCase;
        this.alterarStatusCampanhaUseCase = alterarStatusCampanhaUseCase;
        this.deletarCampanhaUseCase = deletarCampanhaUseCase;
    }

    private Campanha toDomain(CampanhaRequest request) {
        Campanha domain = new Campanha();
        domain.setSupermercadoId(request.getSupermercadoId());
        domain.setNome(request.getNome());
        domain.setSegmento(request.getSegmento());
        domain.setRaio(request.getRaio());
        domain.setStatus(request.getStatus() != null ? request.getStatus() : "Ativa");
        return domain;
    }

    private CampanhaResponse fromDomain(Campanha domain) {
        return new CampanhaResponse(
                domain.getId(),
                domain.getSupermercadoId(),
                domain.getNome(),
                domain.getSegmento(),
                domain.getRaio(),
                domain.getStatus(),
                domain.getPushesEnviados(),
                domain.getConversoes(),
                domain.getCriadoEm()
        );
    }

    @PostMapping
    public ResponseEntity<CampanhaResponse> cadastrar(@RequestBody CampanhaRequest request) {
        Campanha domain = toDomain(request);
        Campanha salvo = cadastrarCampanhaUseCase.execute(domain);
        return ResponseEntity.status(HttpStatus.CREATED).body(fromDomain(salvo));
    }

    @GetMapping("/supermercado/{supermercadoId}")
    public ResponseEntity<List<CampanhaResponse>> listarPorSupermercado(@PathVariable UUID supermercadoId) {
        List<Campanha> campanhas = listarCampanhasPorSupermercadoUseCase.execute(supermercadoId);
        List<CampanhaResponse> responses = campanhas.stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CampanhaResponse> alterarStatus(@PathVariable UUID id, @RequestBody CampanhaRequest request) {
        Campanha atualizada = alterarStatusCampanhaUseCase.execute(id, request.getStatus());
        return ResponseEntity.ok(fromDomain(atualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        deletarCampanhaUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
