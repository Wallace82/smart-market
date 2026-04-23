package com.smartmarket.client.application.port.in;

import com.smartmarket.client.domain.model.Cliente;

public interface CadastrarClientePort {
    Cliente execute(Cliente cliente);
}
