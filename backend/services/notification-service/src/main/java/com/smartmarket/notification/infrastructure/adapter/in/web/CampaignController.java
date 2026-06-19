package com.smartmarket.notification.infrastructure.adapter.in.web;

import com.smartmarket.notification.application.dto.CampaignResponse;
import com.smartmarket.notification.application.dto.CampaignTargetDto;
import com.smartmarket.notification.application.dto.CreateCampaignRequest;
import com.smartmarket.notification.application.dto.UpdateCampaignStatusRequest;
import com.smartmarket.notification.application.usecase.*;
import com.smartmarket.notification.domain.model.Campaign;
import com.smartmarket.notification.domain.model.CampaignTarget;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/campaigns")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Campanhas de Push", description = "Gerenciamento de campanhas de marketing geolocalizadas")
public class CampaignController {

    private final CriarCampanhaUseCase criarCampanhaUseCase;
    private final ListarCampanhasUseCase listarCampanhasUseCase;
    private final AlterarStatusCampanhaUseCase alterarStatusCampanhaUseCase;
    private final DeletarCampanhaUseCase deletarCampanhaUseCase;
    private final ObterCampanhaUseCase obterCampanhaUseCase;

    @PostMapping
    @Operation(summary = "Criar Campanha", description = "Cria uma nova campanha de push geolocalizada")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Campanha criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação ou de negócio")
    })
    public ResponseEntity<?> criar(@Valid @RequestBody CreateCampaignRequest request) {
        log.info("Recebida requisição para criar campanha: {}", request.getTitle());
        try {
            Campaign domain = toDomain(request);
            Campaign salvo = criarCampanhaUseCase.execute(domain);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(salvo));
        } catch (IllegalArgumentException e) {
            log.warn("Erro de negócio ao criar campanha: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/supermercado/{supermarketId}")
    @Operation(summary = "Listar Campanhas", description = "Lista todas as campanhas de um supermercado")
    public ResponseEntity<List<CampaignResponse>> listarPorSupermercado(@PathVariable("supermarketId") UUID supermarketId) {
        log.info("Listando campanhas para o supermercado: {}", supermarketId);
        List<Campaign> campaigns = listarCampanhasUseCase.execute(supermarketId);
        List<CampaignResponse> responses = campaigns.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter Detalhes da Campanha", description = "Retorna os detalhes de uma campanha pelo ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Campanha encontrada"),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    public ResponseEntity<CampaignResponse> obterPorId(@PathVariable("id") UUID id) {
        log.info("Buscando campanha por ID: {}", id);
        return obterCampanhaUseCase.execute(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Alterar Status", description = "Atualiza o status de uma campanha (ATIVA, PAUSADA)")
    public ResponseEntity<CampaignResponse> alterarStatus(
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateCampaignStatusRequest request) {
        log.info("Alterando status da campanha {} para {}", id, request.getStatus());
        Campaign campaign = alterarStatusCampanhaUseCase.execute(id, request.getStatus());
        return ResponseEntity.ok(toResponse(campaign));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir Campanha", description = "Remove uma campanha do sistema")
    @ApiResponses({
            @ApiResponse(responseCode = "24", description = "Campanha excluída"),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    public ResponseEntity<Void> deletar(@PathVariable("id") UUID id) {
        log.info("Excluindo campanha por ID: {}", id);
        try {
            deletarCampanhaUseCase.execute(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Erro ao excluir campanha {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    private Campaign toDomain(CreateCampaignRequest request) {
        CampaignTarget target = null;
        if (request.getTarget() != null) {
            target = CampaignTarget.builder()
                    .type(request.getTarget().getType())
                    .referenceId(request.getTarget().getReferenceId())
                    .build();
        }

        return Campaign.builder()
                .supermarketId(request.getSupermarketId())
                .title(request.getTitle())
                .message(request.getMessage())
                .radiusMeters(request.getRadiusMeters())
                .dailyLimitPerClient(request.getDailyLimitPerClient())
                .target(target)
                .build();
    }

    private CampaignResponse toResponse(Campaign domain) {
        CampaignTargetDto targetDto = null;
        if (domain.getTarget() != null) {
            targetDto = CampaignTargetDto.builder()
                    .type(domain.getTarget().getType())
                    .referenceId(domain.getTarget().getReferenceId())
                    .deepLink(domain.getTarget().getDeepLink())
                    .build();
        }

        return CampaignResponse.builder()
                .id(domain.getId())
                .supermarketId(domain.getSupermarketId())
                .title(domain.getTitle())
                .message(domain.getMessage())
                .radiusMeters(domain.getRadiusMeters())
                .dailyLimitPerClient(domain.getDailyLimitPerClient())
                .status(domain.getStatus())
                .target(targetDto)
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }

    private static class ErrorResponse {
        private final String message;
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
