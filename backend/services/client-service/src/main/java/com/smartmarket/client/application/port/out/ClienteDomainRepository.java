package com.smartmarket.client.application.port.out;

import com.smartmarket.client.domain.model.Cliente;
import java.util.Optional;
import java.util.UUID;

public interface ClienteDomainRepository {
    Cliente save(Cliente cliente);
    Optional<Cliente> findById(UUID id);
    Optional<Cliente> findByCpf(String cpf);
    boolean existsByCpf(String cpf);
}
