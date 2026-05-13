package com.smartmarket.supermarket.infrastructure.adapter.in.web;

import com.smartmarket.supermarket.application.usecase.AlterarStatusSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.CadastrarSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.ListarSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.AtualizarSupermercadoUseCase;
import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.model.SupermercadoStatus;
import com.smartmarket.supermarket.domain.service.BrandImageStorageService;
import com.smartmarket.supermarket.application.dto.SupermercadoRequest;
import com.smartmarket.supermarket.application.dto.SupermercadoResponse;
import com.smartmarket.supermarket.application.dto.PageMetadata;
import com.smartmarket.supermarket.application.dto.PagedSupermarketResponse;
import com.smartmarket.supermarket.application.dto.UpdateSupermarketStatusRequest;
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
        supermercado.setEmail(request.getEmail());
        supermercado.setTelefone(request.getTelefone());
        supermercado.setCep(request.getCep());
        supermercado.setCidade(request.getCidade());
        supermercado.setEstado(request.getEstado());
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
                supermercado.getEmail(),
                supermercado.getTelefone(),
                supermercado.getCep(),
                supermercado.getCidade(),
                supermercado.getEstado(),
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
    public ResponseEntity<?> atualizar(@PathVariable("id") UUID id, @RequestBody SupermercadoRequest request) {
        try {
            Supermercado supermercadoToUpdate = toDomain(request);
            Supermercado atualizado = atualizarSupermercadoUseCase.execute(id, supermercadoToUpdate);
            return ResponseEntity.ok(fromDomain(atualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/upload-logomarca")
    public ResponseEntity<?> uploadLogomarca(@PathVariable("id") UUID id, @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("O arquivo da logomarca não pode ser vazio.");
            }

            // O método buscarPorId já lança IllegalArgumentException se não encontrado
            Supermercado supermercadoExistente = listarSupermercadoUseCase.buscarPorId(id);

            // Deleta a logomarca antiga, se existir
            if (supermercadoExistente.getUrlLogomarca() != null && !supermercadoExistente.getUrlLogomarca().isEmpty()) {
                brandImageStorageService.delete(supermercadoExistente.getUrlLogomarca());
            }

            String newLogoUrl = brandImageStorageService.upload(
                    file.getOriginalFilename(),
                    file.getInputStream(),
                    file.getContentType(),
                    file.getSize()
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
    public ResponseEntity<PagedSupermarketResponse> listarTodos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        List<Supermercado> supermercados = listarSupermercadoUseCase.buscarTodos(page, size);
        List<SupermercadoResponse> responses = supermercados.stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
        
        PageMetadata pageMetadata = new PageMetadata(page, size, responses.size(), 1);
        PagedSupermarketResponse pagedResponse = new PagedSupermarketResponse(responses, pageMetadata);
        
        return ResponseEntity.ok(pagedResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable("id") UUID id) {
        try {
            // O método buscarPorId já lança IllegalArgumentException se não encontrado
            Supermercado supermercado = listarSupermercadoUseCase.buscarPorId(id);
            return ResponseEntity.ok(fromDomain(supermercado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/gestor/{gestorId}")
    public ResponseEntity<List<SupermercadoResponse>> buscarPorGestor(@PathVariable("gestorId") UUID gestorId) {
        List<Supermercado> supermercados = listarSupermercadoUseCase.buscarPorGestorId(gestorId);
        List<SupermercadoResponse> responses = supermercados.stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(@PathVariable("id") UUID id, @RequestBody UpdateSupermarketStatusRequest statusRequest) {
        try {
            Supermercado atualizado = alterarStatusSupermercadoUseCase.execute(id, statusRequest.getStatus());
            return ResponseEntity.ok(fromDomain(atualizado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── ENDPOINTS PÚBLICOS — vitrine e geolocalização (RF-06) ─────────────────────────────

    /**
     * RF-06.1 / RF-06.2: Retorna supermercados ATIVOS dentro do raio em metros a partir das
     * coordenadas GPS fornecidas. Não requer autenticação.
     * O cálculo usa fórmula de Haversine via query no banco (ver ARCHITECTURE.md seção 8).
     */
    @GetMapping("/public/nearby")
    public ResponseEntity<List<SupermercadoResponse>> buscarProximos(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam(value = "radiusMeters", defaultValue = "3000") Integer radiusMeters) {
        List<Supermercado> proximos = listarSupermercadoUseCase.buscarProximos(latitude, longitude, radiusMeters);
        List<SupermercadoResponse> responses = proximos.stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /**
     * RF-06.3: Fallback para quando o usuário nega permissão de GPS.
     * Aceita CEP (8 dígitos) ou nome de bairro. Não requer autenticação.
     */
    @GetMapping("/public/by-location")
    public ResponseEntity<?> buscarPorLocalizacao(
            @RequestParam(value = "cep", required = false) String cep,
            @RequestParam(value = "bairro", required = false) String bairro,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        if ((cep == null || cep.isBlank()) && (bairro == null || bairro.isBlank())) {
            return ResponseEntity.badRequest().body("Informe ao menos um parâmetro: cep ou bairro.");
        }
        List<Supermercado> supermercados = listarSupermercadoUseCase.buscarPorLocalizacao(cep, bairro, page, size);
        List<SupermercadoResponse> responses = supermercados.stream()
                .map(this::fromDomain)
                .collect(Collectors.toList());
        PageMetadata pageMetadata = new PageMetadata(page, size, responses.size(), 1);
        return ResponseEntity.ok(new PagedSupermarketResponse(responses, pageMetadata));
    }

    /**
     * Perfil público do supermercado — inclui whitelabel para renderização da vitrine (RF-05.3).
     * Não requer autenticação (RF-01.4).
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<?> buscarPublicoPorId(@PathVariable("id") UUID id) {
        try {
            Supermercado supermercado = listarSupermercadoUseCase.buscarPorId(id);
            if (supermercado.getStatus() != SupermercadoStatus.ATIVO) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(fromDomain(supermercado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}


