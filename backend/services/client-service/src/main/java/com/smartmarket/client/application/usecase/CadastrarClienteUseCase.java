package com.smartmarket.client.application.usecase;

import com.smartmarket.client.application.port.in.CadastrarClientePort;
import com.smartmarket.client.application.port.out.ClienteDomainRepository;
import com.smartmarket.client.domain.model.Cliente;
import com.smartmarket.client.domain.model.ClienteStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class CadastrarClienteUseCase implements CadastrarClientePort {

    private final ClienteDomainRepository clienteRepository;

    public CadastrarClienteUseCase(ClienteDomainRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public Cliente execute(Cliente cliente) {
        log.info("Iniciando cadastro de cliente com CPF: {}", cliente.getCpf());

        if (clienteRepository.existsByCpf(cliente.getCpf())) {
            log.warn("Tentativa de cadastro com CPF já existente: {}", cliente.getCpf());
            throw new IllegalArgumentException("CPF já cadastrado no sistema.");
        }

        cliente.setCriadoEm(LocalDateTime.now());
        cliente.setAtualizadoEm(LocalDateTime.now());
        cliente.setStatus(ClienteStatus.ATIVO);

        Cliente saved = clienteRepository.save(cliente);
        
        log.info("Cliente cadastrado com sucesso. ID: {}", saved.getId());
        return saved;
    }
}
