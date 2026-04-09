package com.smartmarket.product.infrastructure.web;

import com.smartmarket.product.application.usecase.CriarEncarteDigitalUseCase;
import com.smartmarket.product.application.usecase.AtualizarEncarteDigitalUseCase;
import com.smartmarket.product.application.usecase.ListarEncartesDigitaisUseCase;
import com.smartmarket.product.application.usecase.AlterarStatusEncarteDigitalUseCase;
import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.domain.model.EncarteStatus;
import com.smartmarket.product.infrastructure.web.dto.EncarteDigitalRequest;
import com.smartmarket.product.infrastructure.web.dto.EncarteDigitalResponse;
import com.smartmarket.product.infrastructure.web.dto.EncarteItemResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/encartes")
public class EncarteDigitalController {

    private final CriarEncarteDigitalUseCase criarEncarteDigitalUseCase;
    private final AtualizarEncarteDigitalUseCase atualizarEncarteDigitalUseCase;
    private final ListarEncartesDigitaisUseCase listarEncartesDigitaisUseCase;
    private final AlterarStatusEncarteDigitalUseCase alterarStatusEncarteDigitalUseCase;

    public EncarteDigitalController(CriarEncarteDigitalUseCase criarEncarteDigitalUseCase,
                                    AtualizarEncarteDigitalUseCase atualizarEncarteDigitalUseCase,
                                    ListarEncartesDigitaisUseCase listarEncartesDigitaisUseCase,
                                    AlterarStatusEncarteDigitalUseCase alterarStatusEncarteDigitalUseCase) {
        this.criarEncarteDigitalUseCase = criarEncarteDigitalUseCase;
        this.atualizarEncarteDigitalUseCase = atualizarEncarteDigitalUseCase;
        this.listarEncartesDigitaisUseCase = listarEncartesDigitaisUseCase;
        this.alterarStatusEncarteDigitalUseCase = alterarStatusEncarteDigitalUseCase;
    }

    private EncarteDigital toDomain(EncarteDigitalRequest request) {
        EncarteDigital encarte = new EncarteDigital();
        encarte.setSupermercadoId(request.getSupermercadoId());
        encarte.setTemaId(request.getTemaId());
        encarte.setTitulo(request.getTitulo());
        encarte.setDataInicio(request.getDataInicio());
        encarte.setDataFim(request.getDataFim());
        
        if (request.getItens() != null) {
            List<EncarteItem> itens = request.getItens().stream().map(itemReq -> {
                EncarteItem item = new EncarteItem();
                item.setOfertaId(itemReq.getOfertaId());
                item.setOrdemExibicao(itemReq.getOrdemExibicao());
                item.setDestaque(itemReq.isDestaque());
                return item;
            }).collect(Collectors.toList());
            encarte.setItens(itens);
        }
        
        return encarte;
    }

    private EncarteDigitalResponse fromDomain(EncarteDigital encarte) {
        List<EncarteItemResponse> itens = null;
        if (encarte.getItens() != null) {
            itens = encarte.getItens().stream()
                    .map(item -> new EncarteItemResponse(item.getId(), item.getOfertaId(), item.getOrdemExibicao(), item.isDestaque()))
                    .collect(Collectors.toList());
        }

        return new EncarteDigitalResponse(
                encarte.getId(),
                encarte.getSupermercadoId(),
                encarte.getTemaId(),
                encarte.getTitulo(),
                encarte.getDataInicio(),
                encarte.getDataFim(),
                encarte.getStatus(),
                encarte.getCriadoEm(),
                encarte.getAtualizadoEm(),
                itens
        );
    }

    @PostMapping
    public ResponseEntity<EncarteDigitalResponse> criar(@RequestBody EncarteDigitalRequest request) {
        EncarteDigital encarte = toDomain(request);
        EncarteDigital salvo = criarEncarteDigitalUseCase.execute(encarte);
        return ResponseEntity.status(HttpStatus.CREATED).body(fromDomain(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EncarteDigitalResponse> atualizar(@PathVariable UUID id, @RequestBody EncarteDigitalRequest request) {
        EncarteDigital encarte = toDomain(request);
        EncarteDigital atualizado = atualizarEncarteDigitalUseCase.execute(id, encarte);
        return ResponseEntity.ok(fromDomain(atualizado));
    }

    @GetMapping
    public ResponseEntity<List<EncarteDigitalResponse>> listarTodos(@RequestParam(required = false) UUID supermercadoId) {
        List<EncarteDigital> encartes;
        if (supermercadoId != null) {
            encartes = listarEncartesDigitaisUseCase.buscarPorSupermercado(supermercadoId);
        } else {
            encartes = listarEncartesDigitaisUseCase.buscarTodos();
        }
        
        List<EncarteDigitalResponse> responses = encartes.stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EncarteDigitalResponse> buscarPorId(@PathVariable UUID id) {
        return listarEncartesDigitaisUseCase.buscarPorId(id)
                .map(this::fromDomain)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EncarteDigitalResponse> alterarStatus(@PathVariable UUID id, @RequestParam EncarteStatus status) {
        EncarteDigital atualizado = alterarStatusEncarteDigitalUseCase.execute(id, status);
        return ResponseEntity.ok(fromDomain(atualizado));
    }
}
