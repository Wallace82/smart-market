package com.smartmarket.supermarket.infrastructure.web;

import com.smartmarket.supermarket.application.usecase.AlterarStatusSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.CadastrarSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.ListarSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.AtualizarSupermercadoUseCase;
import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.model.SupermercadoStatus;
import com.smartmarket.supermarket.domain.service.BrandImageStorageService;
import com.smartmarket.supermarket.infrastructure.web.dto.SupermercadoRequest;
import com.smartmarket.supermarket.infrastructure.web.dto.SupermercadoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/supermercados")
public class SupermercadoController {

    private final CadastrarSupermercadoUseCase cadastrarSupermercadoUseCase;
    private final AlterarStatusSupermercadoUseCase alterarStatusSupermercadoUseCase;
    private final ListarSupermercadoUseCase listarSupermercadoUseCase;
    private final AtualizarSupermercadoUseCase atualizarSupermercadoUseCase;
    private final BrandImageStorageService brandImageStorageService;

    public SupermercadoController(CadastrarSupermercadoUseCase cadastrarSupermercadoUseCase,
                                  AlterarStatusSupermercadoUseCase alterarStatusSupermercadoUseCase,
                                  ListarSupermercadoUseCase listarSupermercadoUseCase,
                                  AtualizarSupermercadoUseCase atualizarSupermercadoUseCase,
                                  BrandImageStorageService brandImageStorageService) {
        this.cadastrarSupermercadoUseCase = cadastrarSupermercadoUseCase;
        this.alterarStatusSupermercadoUseCase = alterarStatusSupermercadoUseCase;
        this.listarSupermercadoUseCase = listarSupermercadoUseCase;
        this.atualizarSupermercadoUseCase = atualizarSupermercadoUseCase;
        this.brandImageStorageService = brandImageStorageService;
    }

    // Helper method to convert Request DTO to Domain Model
    private Supermercado toDomain(SupermercadoRequest request) {
        Supermercado supermercado = new Supermercado();
        supermercado.setNomeFantasia(request.getNomeFantasia());
        supermercado.setCnpj(request.getCnpj());
        supermercado.setEndereco(request.getEndereco());
        supermercado.setLatitude(request.getLatitude());
        supermercado.setLongitude(request.getLongitude());
        supermercado.setRaioAtuacao(request.getRaioAtuacao());
        supermercado.setGestorId(request.getGestorId());
        supermercado.setUrlLogomarca(request.getUrlLogomarca());
        supermercado.setCorPrimariaHex(request.getCorPrimariaHex());
        supermercado.setCorSecundariaHex(request.getCorSecundariaHex());
        return supermercado;
    }

    // Helper method to convert Domain Model to Response DTO
    private SupermercadoResponse fromDomain(Supermercado supermercado) {
        return new SupermercadoResponse(
                supermercado.getId(),
                supermercado.getNomeFantasia(),
                supermercado.getCnpj(),
                supermercado.getStatus(),
                supermercado.getEndereco(),
                supermercado.getLatitude(),
                supermercado.getLongitude(),
                supermercado.getRaioAtuacao(),
                supermercado.getGestorId(),
                supermercado.getUrlLogomarca(),
                supermercado.getCorPrimariaHex(),
                supermercado.getCorSecundariaHex(),
                supermercado.getCriadoEm(),
                supermercado.getAtualizadoEm()
        );
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody SupermercadoRequest request) {
        try {
            Supermercado supermercadoToSave = toDomain(request);
            Supermercado salvo = cadastrarSupermercadoUseCase.execute(supermercadoToSave);
            return ResponseEntity.status(HttpStatus.CREATED).body(fromDomain(salvo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable UUID id, @RequestBody SupermercadoRequest request) {
        try {
            Supermercado supermercadoToUpdate = toDomain(request);
            Supermercado atualizado = atualizarSupermercadoUseCase.execute(id, supermercadoToUpdate);
            return ResponseEntity.ok(fromDomain(atualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/upload-logomarca")
    public ResponseEntity<?> uploadLogomarca(@PathVariable UUID id, @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("O arquivo da logomarca não pode ser vazio.");
            }

            Supermercado supermercadoExistente = listarSupermercadoUseCase.buscarPorId(id)
                    .orElseThrow(() -> new IllegalArgumentException("Supermercado não encontrado com ID: " + id));

            // Deleta a logomarca antiga, se existir
            if (supermercadoExistente.getUrlLogomarca() != null && !supermercadoExistente.getUrlLogomarca().isEmpty()) {
                brandImageStorageService.delete(supermercadoExistente.getUrlLogomarca());
            }

            String newLogoUrl = brandImageStorageService.upload(
                    file.getOriginalFilename(),
                    file.getInputStream(),
                    file.getContentType()
            );

            // Atualiza a URL da logomarca no supermercado
            supermercadoExistente.setUrlLogomarca(newLogoUrl);
            Supermercado atualizado = atualizarSupermercadoUseCase.execute(id, supermercadoExistente);

            return ResponseEntity.ok(fromDomain(atualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar o arquivo: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao fazer upload da logomarca: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<SupermercadoResponse>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Supermercado> supermercados = listarSupermercadoUseCase.buscarTodos(page, size);
        List<SupermercadoResponse> responses = supermercados.stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable UUID id) {
        try {
            return listarSupermercadoUseCase.buscarPorId(id)
                    .map(this::fromDomain)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/gestor/{gestorId}")
    public ResponseEntity<List<SupermercadoResponse>> buscarPorGestor(@PathVariable UUID gestorId) {
        List<Supermercado> supermercados = listarSupermercadoUseCase.buscarPorGestorId(gestorId);
        List<SupermercadoResponse> responses = supermercados.stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(@PathVariable UUID id, @RequestParam SupermercadoStatus novoStatus) {
        try {
            Supermercado atualizado = alterarStatusSupermercadoUseCase.execute(id, novoStatus);
            return ResponseEntity.ok(fromDomain(atualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
