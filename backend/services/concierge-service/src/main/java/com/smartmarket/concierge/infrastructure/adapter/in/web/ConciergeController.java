package com.smartmarket.concierge.infrastructure.adapter.in.web;

import com.smartmarket.concierge.application.usecase.CriarSolicitacaoUseCase;
import com.smartmarket.concierge.domain.model.SolicitacaoConcierge;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/concierge/solicitacoes")
@Tag(name = "Concierge", description = "Endpoints para operação assistida de criação de ofertas")
public class ConciergeController {

    private final CriarSolicitacaoUseCase criarSolicitacaoUseCase;
    private final com.smartmarket.concierge.application.usecase.ConsultarFilaAtendimentoUseCase consultarFilaAtendimentoUseCase;
    private final com.smartmarket.concierge.application.usecase.AssumirSolicitacaoUseCase assumirSolicitacaoUseCase;
    private final com.smartmarket.concierge.application.usecase.ConcluirProcessamentoUseCase concluirProcessamentoUseCase;
    private final com.smartmarket.concierge.application.usecase.AprovarSolicitacaoUseCase aprovarSolicitacaoUseCase;

    public ConciergeController(CriarSolicitacaoUseCase criarSolicitacaoUseCase,
                               com.smartmarket.concierge.application.usecase.ConsultarFilaAtendimentoUseCase consultarFilaAtendimentoUseCase,
                               com.smartmarket.concierge.application.usecase.AssumirSolicitacaoUseCase assumirSolicitacaoUseCase,
                               com.smartmarket.concierge.application.usecase.ConcluirProcessamentoUseCase concluirProcessamentoUseCase,
                               com.smartmarket.concierge.application.usecase.AprovarSolicitacaoUseCase aprovarSolicitacaoUseCase) {
        this.criarSolicitacaoUseCase = criarSolicitacaoUseCase;
        this.consultarFilaAtendimentoUseCase = consultarFilaAtendimentoUseCase;
        this.assumirSolicitacaoUseCase = assumirSolicitacaoUseCase;
        this.concluirProcessamentoUseCase = concluirProcessamentoUseCase;
        this.aprovarSolicitacaoUseCase = aprovarSolicitacaoUseCase;
    }

    @GetMapping("/fila")
    @Operation(summary = "Lista a fila de atendimento ordenada por score de prioridade")
    public ResponseEntity<java.util.List<com.smartmarket.concierge.application.dto.ConciergeQueueResponse>> listarFila() {
        return ResponseEntity.ok(consultarFilaAtendimentoUseCase.execute());
    }

    @PatchMapping("/{id}/assumir")
    @Operation(summary = "Atendente assume o processamento de uma solicitação (Lock)")
    public ResponseEntity<SolicitacaoConcierge> assumir(
            @PathVariable("id") UUID solicitacaoId,
            @RequestParam("atendenteId") UUID atendenteId) {
        try {
            return ResponseEntity.ok(assumirSolicitacaoUseCase.execute(solicitacaoId, atendenteId));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/concluir")
    @Operation(summary = "Atendente conclui o processamento e envia para aprovação do gestor")
    public ResponseEntity<SolicitacaoConcierge> concluir(
            @PathVariable("id") UUID solicitacaoId,
            @RequestParam("atendenteId") UUID atendenteId,
            @RequestParam(value = "observacoes", required = false) String observacoes) {
        return ResponseEntity.ok(concluirProcessamentoUseCase.execute(solicitacaoId, atendenteId, observacoes));
    }

    @PatchMapping("/{id}/aprovar")
    @Operation(summary = "Gestor do supermercado aprova o cadastro realizado")
    public ResponseEntity<SolicitacaoConcierge> aprovar(
            @PathVariable("id") UUID solicitacaoId,
            @RequestParam("gestorId") UUID gestorId) {
        return ResponseEntity.ok(aprovarSolicitacaoUseCase.execute(solicitacaoId, gestorId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Cria uma nova solicitação de concierge com upload de listagem")
    public ResponseEntity<SolicitacaoConcierge> criar(
            @RequestParam("supermercadoId") UUID supermercadoId,
            @RequestParam("titulo") String titulo,
            @RequestParam(value = "observacoes", required = false) String observacoes,
            @RequestParam(value = "complexidade", defaultValue = "1") Integer complexidade,
            @RequestParam(value = "plano", defaultValue = "BASICO") String plano,
            @RequestPart("file") MultipartFile file) {
        
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            SolicitacaoConcierge solicitacao = criarSolicitacaoUseCase.execute(
                    supermercadoId,
                    titulo,
                    observacoes,
                    complexidade,
                    plano,
                    file.getOriginalFilename(),
                    file.getInputStream(),
                    file.getContentType(),
                    file.getSize()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(solicitacao);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
