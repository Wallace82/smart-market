package com.smartmarket.product.infrastructure.web;

import com.smartmarket.product.application.usecase.CadastrarTemaEncarteUseCase;
import com.smartmarket.product.application.usecase.AtualizarTemaEncarteUseCase;
import com.smartmarket.product.application.usecase.ListarTemasEncarteUseCase;
import com.smartmarket.product.application.usecase.UploadTemaAssetUseCase;
import com.smartmarket.product.domain.model.TemaEncarte;
import com.smartmarket.product.infrastructure.web.dto.TemaEncarteRequest;
import com.smartmarket.product.infrastructure.web.dto.TemaEncarteResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/temas-encarte")
public class TemaEncarteController {

    private final CadastrarTemaEncarteUseCase cadastrarTemaEncarteUseCase;
    private final AtualizarTemaEncarteUseCase atualizarTemaEncarteUseCase;
    private final ListarTemasEncarteUseCase listarTemasEncarteUseCase;
    private final UploadTemaAssetUseCase uploadTemaAssetUseCase;

    public TemaEncarteController(CadastrarTemaEncarteUseCase cadastrarTemaEncarteUseCase,
                                 AtualizarTemaEncarteUseCase atualizarTemaEncarteUseCase,
                                 ListarTemasEncarteUseCase listarTemasEncarteUseCase,
                                 UploadTemaAssetUseCase uploadTemaAssetUseCase) {
        this.cadastrarTemaEncarteUseCase = cadastrarTemaEncarteUseCase;
        this.atualizarTemaEncarteUseCase = atualizarTemaEncarteUseCase;
        this.listarTemasEncarteUseCase = listarTemasEncarteUseCase;
        this.uploadTemaAssetUseCase = uploadTemaAssetUseCase;
    }

    private TemaEncarte toDomain(TemaEncarteRequest request) {
        TemaEncarte tema = new TemaEncarte();
        tema.setNome(request.getNome());
        tema.setUrlBackgroundDecorativo(request.getUrlBackgroundDecorativo());
        tema.setCorFundoHex(request.getCorFundoHex());
        tema.setAtivo(request.isAtivo());
        return tema;
    }

    private TemaEncarteResponse fromDomain(TemaEncarte tema) {
        return new TemaEncarteResponse(
                tema.getId(),
                tema.getNome(),
                tema.getUrlBackgroundDecorativo(),
                tema.getCorFundoHex(),
                tema.isAtivo(),
                tema.getCriadoEm()
        );
    }

    @PostMapping
    public ResponseEntity<TemaEncarteResponse> cadastrar(@RequestBody TemaEncarteRequest request) {
        TemaEncarte tema = toDomain(request);
        TemaEncarte salvo = cadastrarTemaEncarteUseCase.execute(tema);
        return ResponseEntity.status(HttpStatus.CREATED).body(fromDomain(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemaEncarteResponse> atualizar(@PathVariable UUID id, @RequestBody TemaEncarteRequest request) {
        TemaEncarte tema = toDomain(request);
        TemaEncarte atualizado = atualizarTemaEncarteUseCase.execute(id, tema);
        return ResponseEntity.ok(fromDomain(atualizado));
    }

    @GetMapping
    public ResponseEntity<List<TemaEncarteResponse>> listarTodos() {
        List<TemaEncarteResponse> temas = listarTemasEncarteUseCase.buscarTodos().stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(temas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemaEncarteResponse> buscarPorId(@PathVariable UUID id) {
        return listarTemasEncarteUseCase.buscarPorId(id)
                .map(this::fromDomain)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/upload-background")
    public ResponseEntity<TemaEncarteResponse> uploadBackground(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            String newUrl = uploadTemaAssetUseCase.execute(id, file.getOriginalFilename(), file.getInputStream(), file.getContentType());
            TemaEncarte temaAtualizado = listarTemasEncarteUseCase.buscarPorId(id)
                    .orElseThrow(() -> new IllegalArgumentException("Tema de encarte não encontrado com ID: " + id));
            return ResponseEntity.ok(fromDomain(temaAtualizado));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
