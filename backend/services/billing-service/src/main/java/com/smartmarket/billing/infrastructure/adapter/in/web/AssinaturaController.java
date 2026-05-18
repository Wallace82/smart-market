package com.smartmarket.billing.infrastructure.adapter.in.web;

import com.smartmarket.billing.application.dto.AssinaturaResponse;
import com.smartmarket.billing.application.dto.ContratarPlanoRequest;
import com.smartmarket.billing.application.dto.PlanoResponse;
import com.smartmarket.billing.application.usecase.AssinarPlanoUseCase;
import com.smartmarket.billing.application.usecase.ConsultarAssinaturaUseCase;
import com.smartmarket.billing.domain.model.Assinatura;
import com.smartmarket.billing.domain.model.Plano;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assinaturas")
@RequiredArgsConstructor
@Tag(name = "Assinaturas", description = "Endpoints para gestão de assinaturas de supermercados")
public class AssinaturaController {

    private final AssinarPlanoUseCase assinarPlanoUseCase;
    private final ConsultarAssinaturaUseCase consultarAssinaturaUseCase;

    @PostMapping
    @Operation(summary = "Contratar ou Alterar Plano", description = "Cria uma nova assinatura ou realiza o upgrade/downgrade de um plano existente")
    public ResponseEntity<AssinaturaResponse> assinar(@RequestBody ContratarPlanoRequest request) {
        Assinatura assinatura = assinarPlanoUseCase.execute(request.getSupermercadoId(), request.getPlanoId(), request.getCiclo());
        return ResponseEntity.ok(toResponse(assinatura));
    }

    @GetMapping("/supermercado/{supermercadoId}")
    @Operation(summary = "Consultar Assinatura do Supermercado", description = "Retorna os detalhes da assinatura ativa de um supermercado específico")
    public ResponseEntity<AssinaturaResponse> consultar(@PathVariable UUID supermercadoId) {
        return consultarAssinaturaUseCase.execute(supermercadoId)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private AssinaturaResponse toResponse(Assinatura domain) {
        return AssinaturaResponse.builder()
                .id(domain.getId())
                .supermercadoId(domain.getSupermercadoId())
                .plano(toPlanoResponse(domain.getPlano()))
                .ciclo(domain.getCiclo())
                .status(domain.getStatus())
                .dataInicio(domain.getDataInicio())
                .dataFim(domain.getDataFim())
                .renovacaoAutomatica(domain.isRenovacaoAutomatica())
                .build();
    }

    private PlanoResponse toPlanoResponse(Plano domain) {
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
