package com.smartmarket.billing.infrastructure.adapter.in.web;

import com.smartmarket.billing.application.dto.AtualizarPlanoRequest;
import com.smartmarket.billing.application.dto.CriarPlanoRequest;
import com.smartmarket.billing.application.dto.PlanoResponse;
import com.smartmarket.billing.application.usecase.AtualizarPlanoUseCase;
import com.smartmarket.billing.application.usecase.ConsultarPlanoPorIdUseCase;
import com.smartmarket.billing.application.usecase.CriarPlanoUseCase;
import com.smartmarket.billing.application.usecase.ListarPlanosUseCase;
import com.smartmarket.billing.domain.model.Plano;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/planos")
@RequiredArgsConstructor
@Tag(name = "Planos", description = "Endpoints para consulta e gestão de planos")
public class PlanoController {

    private final ListarPlanosUseCase listarPlanosUseCase;
    private final ConsultarPlanoPorIdUseCase consultarPlanoPorIdUseCase;
    private final AtualizarPlanoUseCase atualizarPlanoUseCase;
    private final CriarPlanoUseCase criarPlanoUseCase;

    @PostMapping
    @Operation(summary = "Criar Plano", description = "Cria um novo plano de assinatura")
    public ResponseEntity<PlanoResponse> create(@RequestBody CriarPlanoRequest request) {
        try {
            Plano criado = criarPlanoUseCase.execute(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(criado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    @Operation(summary = "Listar Planos Ativos", description = "Retorna todos os planos disponíveis para contratação com seus respectivos limites e preços")
    public ResponseEntity<List<PlanoResponse>> listar() {
        List<PlanoResponse> response = listarPlanosUseCase.execute().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar Plano por ID", description = "Retorna os detalhes de um plano específico")
    public ResponseEntity<PlanoResponse> getById(@PathVariable("id") UUID id) {
        return consultarPlanoPorIdUseCase.execute(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar Plano", description = "Atualiza as configurações, limites e preços de um plano existente")
    public ResponseEntity<PlanoResponse> update(@PathVariable("id") UUID id, @RequestBody AtualizarPlanoRequest request) {
        try {
            Plano atualizado = atualizarPlanoUseCase.execute(id, request);
            return ResponseEntity.ok(toResponse(atualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private PlanoResponse toResponse(Plano domain) {
        return PlanoResponse.builder()
                .id(domain.getId())
                .nome(domain.getNome())
                .limiteOfertasMensais(domain.getLimiteOfertasMensais())
                .limiteEncartesAtivos(domain.getLimiteEncartesAtivos())
                .raioAtuacaoKm(domain.getRaioAtuacaoKm())
                .limiteNotificacoesMensais(domain.getLimiteNotificacoesMensais())
                .possuiConcierge(domain.isPossuiConcierge())
                .conciergeUploadsMensais(domain.getConciergeUploadsMensais())
                .slaAtendimentoHoras(domain.getSlaAtendimentoHoras())
                .prioridadeFila(domain.getPrioridadeFila())
                .precoMensal(domain.getPrecoMensal())
                .precoSemestral(domain.getPrecoSemestral())
                .precoAnual(domain.getPrecoAnual())
                .ativo(domain.isAtivo())
                .build();
    }
}
