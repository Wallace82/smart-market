package com.smartmarket.concierge.infrastructure.adapter.in.web;

import com.smartmarket.concierge.application.usecase.CriarSolicitacaoUseCase;
import com.smartmarket.concierge.application.usecase.ReplicarSolicitacaoUseCase;
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
    private final com.smartmarket.concierge.application.usecase.RejeitarSolicitacaoUseCase rejeitarSolicitacaoUseCase;
    private final ReplicarSolicitacaoUseCase replicarSolicitacaoUseCase;

    public ConciergeController(CriarSolicitacaoUseCase criarSolicitacaoUseCase,
                               com.smartmarket.concierge.application.usecase.ConsultarFilaAtendimentoUseCase consultarFilaAtendimentoUseCase,
                               com.smartmarket.concierge.application.usecase.AssumirSolicitacaoUseCase assumirSolicitacaoUseCase,
                               com.smartmarket.concierge.application.usecase.ConcluirProcessamentoUseCase concluirProcessamentoUseCase,
                               com.smartmarket.concierge.application.usecase.AprovarSolicitacaoUseCase aprovarSolicitacaoUseCase,
                               com.smartmarket.concierge.application.usecase.RejeitarSolicitacaoUseCase rejeitarSolicitacaoUseCase,
                               ReplicarSolicitacaoUseCase replicarSolicitacaoUseCase) {
        this.criarSolicitacaoUseCase = criarSolicitacaoUseCase;
        this.consultarFilaAtendimentoUseCase = consultarFilaAtendimentoUseCase;
        this.assumirSolicitacaoUseCase = assumirSolicitacaoUseCase;
        this.concluirProcessamentoUseCase = concluirProcessamentoUseCase;
        this.aprovarSolicitacaoUseCase = aprovarSolicitacaoUseCase;
        this.rejeitarSolicitacaoUseCase = rejeitarSolicitacaoUseCase;
        this.replicarSolicitacaoUseCase = replicarSolicitacaoUseCase;
    }

    @GetMapping("/fila")
    @Operation(summary = "Lista a fila de atendimento ordenada por score de prioridade")
    public ResponseEntity<java.util.List<com.smartmarket.concierge.application.dto.ConciergeQueueResponse>> listarFila() {
        return ResponseEntity.ok(consultarFilaAtendimentoUseCase.execute());
    }

    @PatchMapping("/{id}/assumir")
    @Operation(summary = "Atendente assume o processamento de uma solicitação (Lock)")
    public ResponseEntity<SolicitacaoConcierge> assumir(
            @PathVariable(name = "id") UUID solicitacaoId,
            @RequestParam(name = "atendenteId") UUID atendenteId) {
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
            @PathVariable(name = "id") UUID solicitacaoId,
            @RequestParam(name = "atendenteId") UUID atendenteId,
            @RequestParam(name = "observacoes", required = false) String observacoes,
            @RequestParam(name = "encarteId", required = false) UUID encarteId) {
        return ResponseEntity.ok(concluirProcessamentoUseCase.execute(solicitacaoId, atendenteId, observacoes, encarteId));
    }

    @PatchMapping("/{id}/aprovar")
    @Operation(summary = "Gestor do supermercado aprova o cadastro realizado")
    public ResponseEntity<SolicitacaoConcierge> aprovar(
            @PathVariable(name = "id") UUID solicitacaoId,
            @RequestParam(name = "gestorId") UUID gestorId) {
        return ResponseEntity.ok(aprovarSolicitacaoUseCase.execute(solicitacaoId, gestorId));
    }

    @PatchMapping("/{id}/rejeitar")
    @Operation(summary = "Gestor do supermercado rejeita o cadastro realizado e solicita correcoes")
    public ResponseEntity<SolicitacaoConcierge> rejeitar(
            @PathVariable(name = "id") UUID solicitacaoId,
            @RequestParam(name = "gestorId") UUID gestorId,
            @RequestParam(name = "observacoes") String observacoes) {
        return ResponseEntity.ok(rejeitarSolicitacaoUseCase.execute(solicitacaoId, gestorId, observacoes));
    }

    @PostMapping(value = "/{id}/replicar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Supermercado envia uma réplica para a digitalização rejeitada")
    public ResponseEntity<?> replicar(
            @PathVariable(name = "id") UUID solicitacaoId,
            @RequestParam(name = "gestorId") UUID gestorId,
            @RequestParam(name = "observacoes") String observacoes,
            @RequestPart(name = "file", required = false) MultipartFile file) {
        try {
            String fileName = null;
            java.io.InputStream inputStream = null;
            String contentType = null;
            Long size = null;

            if (file != null && !file.isEmpty()) {
                fileName = file.getOriginalFilename();
                inputStream = file.getInputStream();
                contentType = file.getContentType();
                size = file.getSize();
            }

            SolicitacaoConcierge solicitacao = replicarSolicitacaoUseCase.execute(
                    solicitacaoId,
                    gestorId,
                    observacoes,
                    fileName,
                    inputStream,
                    contentType,
                    size
            );

            return ResponseEntity.ok(solicitacao);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Cria uma nova solicitação de concierge com upload de listagem")
    public ResponseEntity<?> criar(
            @RequestParam(name = "supermercadoId") UUID supermercadoId,
            @RequestParam(name = "titulo") String titulo,
            @RequestParam(name = "observacoes", required = false) String observacoes,
            @RequestParam(name = "complexidade", defaultValue = "1") Integer complexidade,
            @RequestPart(name = "file") MultipartFile file) {
        
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Arquivo não enviado.");
            }

            SolicitacaoConcierge solicitacao = criarSolicitacaoUseCase.execute(
                    supermercadoId,
                    titulo,
                    observacoes,
                    complexidade,
                    file.getOriginalFilename(),
                    file.getInputStream(),
                    file.getContentType(),
                    file.getSize()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(solicitacao);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
