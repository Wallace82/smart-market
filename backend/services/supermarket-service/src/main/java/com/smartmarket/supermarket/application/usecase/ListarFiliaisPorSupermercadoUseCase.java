package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.application.port.out.FilialDomainRepository;
import com.smartmarket.supermarket.domain.model.Filial;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ListarFiliaisPorSupermercadoUseCase {

    private final FilialDomainRepository repository;

    public ListarFiliaisPorSupermercadoUseCase(FilialDomainRepository repository) {
        this.repository = repository;
    }

    public List<Filial> execute(UUID supermercadoId) {
        return repository.findBySupermercadoId(supermercadoId);
    }
}
