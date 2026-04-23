package com.smartmarket.product.infrastructure.adapter.in.web;

import com.smartmarket.product.application.usecase.CriarEncarteDigitalUseCase;
import com.smartmarket.product.application.usecase.AtualizarEncarteDigitalUseCase;
import com.smartmarket.product.application.usecase.ListarEncartesDigitaisUseCase;
import com.smartmarket.product.application.usecase.AlterarStatusEncarteDigitalUseCase;
import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.domain.model.EncarteStatus;
import com.smartmarket.product.application.dto.EncarteDigitalRequest;
import com.smartmarket.product.application.dto.EncarteDigitalResponse;
import com.smartmarket.product.application.dto.EncarteItemResponse;
import com.smartmarket.product.infrastructure.adapter.in.web.mapper.EncarteDigitalWebMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/encartes")
@Tag(name = "Encartes Digitais", description = "Gerenciamento de Encartes Digitais das Lojas")
public class EncarteDigitalController {

    private final CriarEncarteDigitalUseCase criarEncarteDigitalUseCase;
    private final AtualizarEncarteDigitalUseCase atualizarEncarteDigitalUseCase;
    private final ListarEncartesDigitaisUseCase listarEncartesDigitaisUseCase;
    private final AlterarStatusEncarteDigitalUseCase alterarStatusEncarteDigitalUseCase;
    private final EncarteDigitalWebMapper mapper;

    public EncarteDigitalController(CriarEncarteDigitalUseCase criarEncarteDigitalUseCase,
                                    AtualizarEncarteDigitalUseCase atualizarEncarteDigitalUseCase,
                                    ListarEncartesDigitaisUseCase listarEncartesDigitaisUseCase,
                                    AlterarStatusEncarteDigitalUseCase alterarStatusEncarteDigitalUseCase,
                                    EncarteDigitalWebMapper mapper) {
        this.criarEncarteDigitalUseCase = criarEncarteDigitalUseCase;
        this.atualizarEncarteDigitalUseCase = atualizarEncarteDigitalUseCase;
        this.listarEncartesDigitaisUseCase = listarEncartesDigitaisUseCase;
        this.alterarStatusEncarteDigitalUseCase = alterarStatusEncarteDigitalUseCase;
        this.mapper = mapper;
    }

    @PostMapping
    @Operation(summary = "Criar Encarte", description = "Cria um novo encarte digital associado a um supermercado")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Encarte criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Payload inválido")
    })
    public ResponseEntity<EncarteDigitalResponse> criar(@RequestBody EncarteDigitalRequest request) {
        log.info("Iniciando criação de encarte digital para supermercado: {}", request.getSupermercadoId());
        EncarteDigital encarte = mapper.toDomain(request);
        EncarteDigital salvo = criarEncarteDigitalUseCase.execute(encarte);
        log.info("Encarte digital criado com sucesso. ID: {}", salvo.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toResponse(salvo));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar Encarte", description = "Atualiza os dados e ofertas de um encarte digital existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encarte atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Encarte não encontrado")
    })
    public ResponseEntity<EncarteDigitalResponse> atualizar(@PathVariable @Parameter(description = "ID do Encarte") UUID id, @RequestBody EncarteDigitalRequest request) {
        log.info("Atualizando encarte digital. ID: {}", id);
        EncarteDigital encarte = mapper.toDomain(request);
        EncarteDigital atualizado = atualizarEncarteDigitalUseCase.execute(id, encarte);
        return ResponseEntity.ok(mapper.toResponse(atualizado));
    }

    @GetMapping
    @Operation(summary = "Listar Encartes", description = "Lista todos os encartes, com opção de filtrar por supermercado")
    public ResponseEntity<List<EncarteDigitalResponse>> listarTodos(@RequestParam(required = false) @Parameter(description = "ID opcional do supermercado") UUID supermercadoId) {
        log.info("Listando encartes digitais. Filtro Supermercado: {}", supermercadoId);
        List<EncarteDigital> encartes;
        if (supermercadoId != null) {
            encartes = listarEncartesDigitaisUseCase.buscarPorSupermercado(supermercadoId);
        } else {
            encartes = listarEncartesDigitaisUseCase.buscarTodos();
        }
        
        List<EncarteDigitalResponse> responses = encartes.stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Encarte", description = "Busca um encarte digital pelo seu ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encarte encontrado"),
            @ApiResponse(responseCode = "404", description = "Encarte não encontrado")
    })
    public ResponseEntity<EncarteDigitalResponse> buscarPorId(@PathVariable @Parameter(description = "ID do Encarte") UUID id) {
        log.info("Buscando encarte digital por ID: {}", id);
        return listarEncartesDigitaisUseCase.buscarPorId(id)
                .map(mapper::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Encarte digital não encontrado. ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Alterar Status", description = "Altera o status (ex: ATIVO, INATIVO) de um encarte digital")
    public ResponseEntity<EncarteDigitalResponse> alterarStatus(@PathVariable @Parameter(description = "ID do Encarte") UUID id, @RequestParam @Parameter(description = "Novo status") EncarteStatus status) {
        log.info("Alterando status do encarte digital. ID: {}, Novo Status: {}", id, status);
        EncarteDigital atualizado = alterarStatusEncarteDigitalUseCase.execute(id, status);
        return ResponseEntity.ok(mapper.toResponse(atualizado));
    }
}



