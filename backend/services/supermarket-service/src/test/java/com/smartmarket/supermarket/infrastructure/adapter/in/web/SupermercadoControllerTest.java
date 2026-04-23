package com.smartmarket.supermarket.infrastructure.adapter.in.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartmarket.supermarket.application.dto.SupermercadoRequest;
import com.smartmarket.supermarket.application.usecase.AlterarStatusSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.AtualizarSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.CadastrarSupermercadoUseCase;
import com.smartmarket.supermarket.application.usecase.ListarSupermercadoUseCase;
import com.smartmarket.supermarket.domain.model.Supermercado;
import com.smartmarket.supermarket.domain.model.SupermercadoStatus;
import com.smartmarket.supermarket.domain.service.BrandImageStorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SupermercadoController.class)
@AutoConfigureMockMvc(addFilters = false)
class SupermercadoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CadastrarSupermercadoUseCase cadastrarSupermercadoUseCase;

    @MockBean
    private AlterarStatusSupermercadoUseCase alterarStatusSupermercadoUseCase;

    @MockBean
    private ListarSupermercadoUseCase listarSupermercadoUseCase;

    @MockBean
    private AtualizarSupermercadoUseCase atualizarSupermercadoUseCase;

    @MockBean
    private BrandImageStorageService brandImageStorageService;

    @Test
    void shouldCadastrarSupermercado() throws Exception {
        SupermercadoRequest request = new SupermercadoRequest();
        request.setNomeFantasia("Supermercado Teste");
        request.setCnpj("12.345.678/0001-90");

        Supermercado salvo = new Supermercado();
        salvo.setId(UUID.randomUUID());
        salvo.setNomeFantasia("Supermercado Teste");
        salvo.setStatus(SupermercadoStatus.ATIVO);

        when(cadastrarSupermercadoUseCase.execute(any(Supermercado.class))).thenReturn(salvo);

        mockMvc.perform(post("/api/v1/supermercados")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nomeFantasia").value("Supermercado Teste"))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void shouldBuscarPorId() throws Exception {
        UUID id = UUID.randomUUID();
        Supermercado supermercado = new Supermercado();
        supermercado.setId(id);
        supermercado.setNomeFantasia("Supermercado Encontrado");

        when(listarSupermercadoUseCase.buscarPorId(id)).thenReturn(supermercado);

        mockMvc.perform(get("/api/v1/supermercados/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomeFantasia").value("Supermercado Encontrado"));
    }

    @Test
    void shouldRetornar404QuandoNaoEncontrado() throws Exception {
        UUID id = UUID.randomUUID();
        when(listarSupermercadoUseCase.buscarPorId(id)).thenThrow(new IllegalArgumentException("Não encontrado"));

        mockMvc.perform(get("/api/v1/supermercados/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldListarTodos() throws Exception {
        when(listarSupermercadoUseCase.buscarTodos(0, 20)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/supermercados"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }
}
