package com.smartmarket.client.infrastructure.adapter.in.web;

import com.smartmarket.client.application.dto.LocalFavoritoRequest;
import com.smartmarket.client.application.dto.LocalFavoritoResponse;
import com.smartmarket.client.application.dto.PreferenciaProdutoRequest;
import com.smartmarket.client.application.dto.PreferenciaProdutoResponse;
import com.smartmarket.client.application.port.in.GerenciarLocaisPort;
import com.smartmarket.client.application.port.in.GerenciarPreferenciasPort;
import com.smartmarket.client.domain.model.LocalFavorito;
import com.smartmarket.client.domain.model.PreferenciaProduto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controller REST para preferências do cliente autenticado.
 * A autenticação é gerenciada pelo API Gateway, que propaga:
 *   - X-User-Id: UUID do usuário autenticado
 *   - X-User-Email: email do usuário
 *   - X-User-Roles: roles separadas por vírgula
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/clientes/me")
@RequiredArgsConstructor
public class ClientePreferenciasController {

    private final GerenciarLocaisPort gerenciarLocaisPort;
    private final GerenciarPreferenciasPort gerenciarPreferenciasPort;

    // ==================== LOCAIS FAVORITOS ====================

    @GetMapping("/locais")
    public ResponseEntity<List<LocalFavoritoResponse>> listarLocais(
            @RequestHeader("X-User-Id") String userId) {
        UUID clienteAuthId = UUID.fromString(userId);
        List<LocalFavoritoResponse> locais = gerenciarLocaisPort.listar(clienteAuthId)
                .stream().map(this::toLocalResponse).collect(Collectors.toList());
        return ResponseEntity.ok(locais);
    }

    @PostMapping("/locais")
    public ResponseEntity<LocalFavoritoResponse> salvarLocal(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody LocalFavoritoRequest request) {
        UUID clienteAuthId = UUID.fromString(userId);
        LocalFavorito local = toLocalDomain(request);
        LocalFavorito salvo = gerenciarLocaisPort.salvar(clienteAuthId, local);
        return ResponseEntity.status(HttpStatus.CREATED).body(toLocalResponse(salvo));
    }

    @DeleteMapping("/locais/{localId}")
    public ResponseEntity<Void> removerLocal(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID localId) {
        UUID clienteAuthId = UUID.fromString(userId);
        gerenciarLocaisPort.remover(clienteAuthId, localId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/locais/{localId}/ativar")
    public ResponseEntity<LocalFavoritoResponse> ativarLocal(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID localId) {
        UUID clienteAuthId = UUID.fromString(userId);
        LocalFavorito ativo = gerenciarLocaisPort.definirAtivo(clienteAuthId, localId);
        return ResponseEntity.ok(toLocalResponse(ativo));
    }

    // ==================== PREFERÊNCIAS DE PRODUTO ====================

    @GetMapping("/preferencias")
    public ResponseEntity<List<PreferenciaProdutoResponse>> listarPreferencias(
            @RequestHeader("X-User-Id") String userId) {
        UUID clienteAuthId = UUID.fromString(userId);
        List<PreferenciaProdutoResponse> prefs = gerenciarPreferenciasPort.listar(clienteAuthId)
                .stream().map(this::toPrefResponse).collect(Collectors.toList());
        return ResponseEntity.ok(prefs);
    }

    @PostMapping("/preferencias")
    public ResponseEntity<PreferenciaProdutoResponse> salvarPreferencia(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody PreferenciaProdutoRequest request) {
        UUID clienteAuthId = UUID.fromString(userId);
        PreferenciaProduto pref = toPrefDomain(request);
        PreferenciaProduto salva = gerenciarPreferenciasPort.salvar(clienteAuthId, pref);
        return ResponseEntity.status(HttpStatus.CREATED).body(toPrefResponse(salva));
    }

    @DeleteMapping("/preferencias/{preferenciaId}")
    public ResponseEntity<Void> removerPreferencia(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID preferenciaId) {
        UUID clienteAuthId = UUID.fromString(userId);
        gerenciarPreferenciasPort.remover(clienteAuthId, preferenciaId);
        return ResponseEntity.noContent().build();
    }

    // ==================== MAPEAMENTOS ====================

    private LocalFavorito toLocalDomain(LocalFavoritoRequest r) {
        LocalFavorito d = new LocalFavorito();
        d.setApelido(r.getApelido());
        d.setEndereco(r.getEndereco());
        d.setCep(r.getCep());
        d.setBairro(r.getBairro());
        d.setCidade(r.getCidade());
        d.setEstado(r.getEstado());
        d.setLatitude(r.getLatitude());
        d.setLongitude(r.getLongitude());
        d.setRaioKm(r.getRaioKm() != null ? r.getRaioKm() : 10);
        return d;
    }

    private LocalFavoritoResponse toLocalResponse(LocalFavorito d) {
        LocalFavoritoResponse r = new LocalFavoritoResponse();
        r.setId(d.getId());
        r.setApelido(d.getApelido());
        r.setEndereco(d.getEndereco());
        r.setCep(d.getCep());
        r.setBairro(d.getBairro());
        r.setCidade(d.getCidade());
        r.setEstado(d.getEstado());
        r.setLatitude(d.getLatitude());
        r.setLongitude(d.getLongitude());
        r.setRaioKm(d.getRaioKm());
        r.setAtivo(d.isAtivo());
        r.setCriadoEm(d.getCriadoEm());
        return r;
    }

    private PreferenciaProduto toPrefDomain(PreferenciaProdutoRequest r) {
        PreferenciaProduto d = new PreferenciaProduto();
        d.setProdutoBaseId(r.getProdutoBaseId());
        d.setNomeProduto(r.getNomeProduto());
        d.setCategoriaId(r.getCategoriaId());
        d.setCategoriaNome(r.getCategoriaNome());
        d.setMarca(r.getMarca());
        d.setUnidadeMedida(r.getUnidadeMedida());
        d.setUrlImagem(r.getUrlImagem());
        return d;
    }

    private PreferenciaProdutoResponse toPrefResponse(PreferenciaProduto d) {
        PreferenciaProdutoResponse r = new PreferenciaProdutoResponse();
        r.setId(d.getId());
        r.setProdutoBaseId(d.getProdutoBaseId());
        r.setNomeProduto(d.getNomeProduto());
        r.setCategoriaId(d.getCategoriaId());
        r.setCategoriaNome(d.getCategoriaNome());
        r.setMarca(d.getMarca());
        r.setUnidadeMedida(d.getUnidadeMedida());
        r.setUrlImagem(d.getUrlImagem());
        r.setCriadoEm(d.getCriadoEm());
        return r;
    }
}
