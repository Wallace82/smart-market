package com.smartmarket.supermarket.application.usecase;

import com.smartmarket.supermarket.application.port.out.FilialDomainRepository;
import com.smartmarket.supermarket.domain.model.Filial;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CadastrarFilialUseCase {

    private final FilialDomainRepository repository;

    public CadastrarFilialUseCase(FilialDomainRepository repository) {
        this.repository = repository;
    }

    public Filial execute(Filial filial) {
        if (filial.getId() == null) {
            filial.setId(UUID.randomUUID());
        }
        return repository.save(filial);
    }
}
