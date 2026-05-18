package com.smartmarket.billing.application.usecase;

import com.smartmarket.billing.domain.model.Assinatura;
import com.smartmarket.billing.domain.model.CicloCobranca;
import com.smartmarket.billing.domain.model.StatusAssinatura;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.AssinaturaEntity;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.AssinaturaRepository;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.PlanoRepository;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.mapper.BillingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssinarPlanoUseCase {

    private final AssinaturaRepository assinaturaRepository;
    private final PlanoRepository planoRepository;
    private final BillingMapper mapper;

    @Transactional
    public Assinatura execute(UUID supermercadoId, UUID planoId, CicloCobranca ciclo) {
        var planoEntity = planoRepository.findById(planoId)
                .orElseThrow(() -> new IllegalArgumentException("Plano não encontrado"));

        var assinaturaOpt = assinaturaRepository.findBySupermercadoId(supermercadoId);
        
        AssinaturaEntity entity;
        if (assinaturaOpt.isPresent()) {
            entity = assinaturaOpt.get();
            entity.setPlano(planoEntity);
            entity.setCiclo(ciclo);
            // RN-11.2: Upgrade Imediato
            entity.setStatus(StatusAssinatura.ATIVA); 
        } else {
            entity = AssinaturaEntity.builder()
                    .id(UUID.randomUUID())
                    .supermercadoId(supermercadoId)
                    .plano(planoEntity)
                    .ciclo(ciclo)
                    .status(StatusAssinatura.ATIVA)
                    .dataInicio(LocalDateTime.now())
                    .renovacaoAutomatica(true)
                    .build();
        }

        // Calcula data de fim baseada no ciclo
        entity.setDataFim(calcularDataFim(entity.getDataInicio(), ciclo));

        return mapper.toDomain(assinaturaRepository.save(entity));
    }

    private LocalDateTime calcularDataFim(LocalDateTime inicio, CicloCobranca ciclo) {
        return switch (ciclo) {
            case MENSAL -> inicio.plusMonths(1);
            case SEMESTRAL -> inicio.plusMonths(6);
            case ANUAL -> inicio.plusYears(1);
        };
    }
}
