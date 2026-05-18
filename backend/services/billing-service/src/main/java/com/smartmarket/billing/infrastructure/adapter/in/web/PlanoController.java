package com.smartmarket.billing.infrastructure.adapter.in.web;

import com.smartmarket.billing.application.dto.PlanoResponse;
import com.smartmarket.billing.application.usecase.ListarPlanosUseCase;
import com.smartmarket.billing.domain.model.Plano;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/planos")
@RequiredArgsConstructor
@Tag(name = "Planos", description = "Endpoints para consulta de planos e preços")
public class PlanoController {

    private final ListarPlanosUseCase listarPlanosUseCase;

    @GetMapping
    @Operation(summary = "Listar Planos Ativos", description = "Retorna todos os planos disponíveis para contratação com seus respectivos limites e preços")
    public ResponseEntity<List<PlanoResponse>> listar() {
        List<PlanoResponse> response = listarPlanosUseCase.execute().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
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
                .build();
    }
}
