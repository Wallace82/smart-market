package com.smartmarket.billing.application.usecase;

import com.smartmarket.billing.domain.model.Plano;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.PlanoRepository;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.mapper.BillingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConsultarPlanoPorIdUseCase {

    private final PlanoRepository planoRepository;
    private final BillingMapper mapper;

    public Optional<Plano> execute(UUID id) {
        return planoRepository.findById(id).map(mapper::toDomain);
    }
}
