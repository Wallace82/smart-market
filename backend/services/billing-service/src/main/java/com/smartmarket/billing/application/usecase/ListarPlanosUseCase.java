package com.smartmarket.billing.application.usecase;

import com.smartmarket.billing.domain.model.Plano;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.PlanoRepository;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.mapper.BillingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListarPlanosUseCase {

    private final PlanoRepository planoRepository;
    private final BillingMapper mapper;

    public List<Plano> execute() {
        return planoRepository.findByAtivoTrue().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}
