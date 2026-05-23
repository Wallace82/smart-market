package com.smartmarket.client.application.port.in;

import com.smartmarket.client.domain.model.PreferenciaProduto;

import java.util.List;
import java.util.UUID;

public interface GerenciarPreferenciasPort {
    List<PreferenciaProduto> listar(UUID clienteAuthId);
    PreferenciaProduto salvar(UUID clienteAuthId, PreferenciaProduto preferencia);
    void remover(UUID clienteAuthId, UUID preferenciaId);
}
