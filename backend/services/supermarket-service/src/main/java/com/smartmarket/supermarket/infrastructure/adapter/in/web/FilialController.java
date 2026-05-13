package com.smartmarket.supermarket.infrastructure.adapter.in.web;

import com.smartmarket.supermarket.application.dto.FilialRequest;
import com.smartmarket.supermarket.application.dto.FilialResponse;
import com.smartmarket.supermarket.application.usecase.AtualizarFilialUseCase;
import com.smartmarket.supermarket.application.usecase.CadastrarFilialUseCase;
import com.smartmarket.supermarket.application.usecase.DeletarFilialUseCase;
import com.smartmarket.supermarket.application.usecase.ListarFiliaisPorSupermercadoUseCase;
import com.smartmarket.supermarket.domain.model.Filial;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/filiais")
public class FilialController {

    private final CadastrarFilialUseCase cadastrarFilialUseCase;
    private final AtualizarFilialUseCase atualizarFilialUseCase;
    private final ListarFiliaisPorSupermercadoUseCase listarFiliaisPorSupermercadoUseCase;
    private final DeletarFilialUseCase deletarFilialUseCase;

    public FilialController(CadastrarFilialUseCase cadastrarFilialUseCase,
                            AtualizarFilialUseCase atualizarFilialUseCase,
                            ListarFiliaisPorSupermercadoUseCase listarFiliaisPorSupermercadoUseCase,
                            DeletarFilialUseCase deletarFilialUseCase) {
        this.cadastrarFilialUseCase = cadastrarFilialUseCase;
        this.atualizarFilialUseCase = atualizarFilialUseCase;
        this.listarFiliaisPorSupermercadoUseCase = listarFiliaisPorSupermercadoUseCase;
        this.deletarFilialUseCase = deletarFilialUseCase;
    }

    private Filial toDomain(FilialRequest request) {
        Filial domain = new Filial();
        domain.setSupermercadoId(request.getSupermercadoId());
        domain.setNome(request.getNome());
        domain.setEndereco(request.getEndereco());
        domain.setCep(request.getCep());
        domain.setCidade(request.getCidade());
        domain.setEstado(request.getEstado());
        domain.setLatitude(request.getLatitude());
        domain.setLongitude(request.getLongitude());
        domain.setTelefone(request.getTelefone());
        domain.setEmail(request.getEmail());
        domain.setAtivo(request.isAtivo());
        return domain;
    }

    private FilialResponse fromDomain(Filial domain) {
        return new FilialResponse(
                domain.getId(),
                domain.getSupermercadoId(),
                domain.getNome(),
                domain.getEndereco(),
                domain.getCep(),
                domain.getCidade(),
                domain.getEstado(),
                domain.getLatitude(),
                domain.getLongitude(),
                domain.getTelefone(),
                domain.getEmail(),
                domain.isAtivo(),
                domain.getCriadoEm(),
                domain.getAtualizadoEm()
        );
    }

    @PostMapping
    public ResponseEntity<FilialResponse> cadastrar(@RequestBody FilialRequest request) {
        Filial domain = toDomain(request);
        Filial salvo = cadastrarFilialUseCase.execute(domain);
        return ResponseEntity.status(HttpStatus.CREATED).body(fromDomain(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FilialResponse> atualizar(@PathVariable UUID id, @RequestBody FilialRequest request) {
        Filial domain = toDomain(request);
        Filial atualizado = atualizarFilialUseCase.execute(id, domain);
        return ResponseEntity.ok(fromDomain(atualizado));
    }

    @GetMapping("/supermercado/{supermercadoId}")
    public ResponseEntity<List<FilialResponse>> listarPorSupermercado(@PathVariable UUID supermercadoId) {
        List<Filial> filiais = listarFiliaisPorSupermercadoUseCase.execute(supermercadoId);
        List<FilialResponse> responses = filiais.stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        deletarFilialUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
