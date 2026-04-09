package com.smartmarket.product.infrastructure.web;

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

    public ProdutoBaseController(CadastrarProdutoBaseUseCase cadastrarProdutoBaseUseCase, ListarProdutoBaseUseCase listarProdutoBaseUseCase) {
        this.cadastrarProdutoBaseUseCase = cadastrarProdutoBaseUseCase;
        this.listarProdutoBaseUseCase = listarProdutoBaseUseCase;
    }

    @PostMapping
    public ResponseEntity<ProdutoBase> cadastrar(
            @RequestPart("produto") ProdutoBase produto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        ProdutoBase salvo = cadastrarProdutoBaseUseCase.execute(produto, imagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public ResponseEntity<List<ProdutoBase>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<ProdutoBase> produtos = listarProdutoBaseUseCase.execute(page, size);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/busca")
    public ResponseEntity<List<ProdutoBase>> buscarPorNome(@RequestParam String nome) {
        List<ProdutoBase> produtos = listarProdutoBaseUseCase.buscarPorNome(nome);
        return ResponseEntity.ok(produtos);
    }
}
