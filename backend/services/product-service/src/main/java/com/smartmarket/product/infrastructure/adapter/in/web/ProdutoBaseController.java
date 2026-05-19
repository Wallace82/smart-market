package com.smartmarket.product.infrastructure.adapter.in.web;

import com.smartmarket.product.application.usecase.CadastrarProdutoBaseUseCase;
import com.smartmarket.product.application.usecase.ListarProdutoBaseUseCase;
import com.smartmarket.product.domain.model.ProdutoBase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/produtos-base")
public class ProdutoBaseController {

    private final CadastrarProdutoBaseUseCase cadastrarProdutoBaseUseCase;
    private final ListarProdutoBaseUseCase listarProdutoBaseUseCase;
    private final com.smartmarket.product.application.usecase.AtualizarProdutoBaseUseCase atualizarProdutoBaseUseCase;

    public ProdutoBaseController(CadastrarProdutoBaseUseCase cadastrarProdutoBaseUseCase, 
                                 ListarProdutoBaseUseCase listarProdutoBaseUseCase,
                                 com.smartmarket.product.application.usecase.AtualizarProdutoBaseUseCase atualizarProdutoBaseUseCase) {
        this.cadastrarProdutoBaseUseCase = cadastrarProdutoBaseUseCase;
        this.listarProdutoBaseUseCase = listarProdutoBaseUseCase;
        this.atualizarProdutoBaseUseCase = atualizarProdutoBaseUseCase;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProdutoBase> cadastrar(
            @RequestPart("produto") ProdutoBase produto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        ProdutoBase salvo = cadastrarProdutoBaseUseCase.execute(produto, imagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PostMapping(consumes = {"application/json"})
    public ResponseEntity<ProdutoBase> cadastrarJson(@RequestBody ProdutoBase produto) {
        ProdutoBase salvo = cadastrarProdutoBaseUseCase.execute(produto, null);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProdutoBase> atualizar(
            @PathVariable("id") java.util.UUID id,
            @RequestPart("produto") ProdutoBase produto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        return ResponseEntity.ok(atualizarProdutoBaseUseCase.execute(id, produto, imagem));
    }

    @PutMapping(value = "/{id}", consumes = {"application/json"})
    public ResponseEntity<ProdutoBase> atualizarJson(
            @PathVariable("id") java.util.UUID id,
            @RequestBody ProdutoBase produto) {
        return ResponseEntity.ok(atualizarProdutoBaseUseCase.execute(id, produto, null));
    }

    @GetMapping
    public ResponseEntity<List<ProdutoBase>> listarTodos(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        List<ProdutoBase> produtos = listarProdutoBaseUseCase.execute(page, size);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/busca")
    public ResponseEntity<List<ProdutoBase>> buscarPorNome(@RequestParam("nome") String nome) {
        List<ProdutoBase> produtos = listarProdutoBaseUseCase.buscarPorNome(nome);
        return ResponseEntity.ok(produtos);
    }
}

