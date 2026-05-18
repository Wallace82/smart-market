package com.smartmarket.billing.application.usecase;

import com.smartmarket.billing.domain.model.Assinatura;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.AssinaturaRepository;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.mapper.BillingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConsultarAssinaturaUseCase {

    private final AssinaturaRepository assinaturaRepository;
    private final BillingMapper mapper;

    public Optional<Assinatura> execute(UUID supermercadoId) {
        return assinaturaRepository.findBySupermercadoId(supermercadoId)
                .map(mapper::toDomain);
    }
}
