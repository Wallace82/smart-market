package com.smartmarket.billing.application.service;

import com.smartmarket.billing.application.dto.PlanDTO;
import com.smartmarket.billing.application.dto.SubscriptionDTO;
import com.smartmarket.billing.infrastructure.persistence.entity.PlanEntity;
import com.smartmarket.billing.infrastructure.persistence.entity.SubscriptionEntity;
import com.smartmarket.billing.infrastructure.persistence.repository.PlanRepository;
import com.smartmarket.billing.infrastructure.persistence.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PlanRepository planRepository;

    @Transactional(readOnly = true)
    public SubscriptionDTO getActiveSubscriptionForSupermarket(UUID supermarketId) {
        return subscriptionRepository.findBySupermarketIdAndStatusIn(supermarketId, List.of("active", "trialing"))
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Nenhuma assinatura ativa encontrada para este supermercado."));
    }

    @Transactional
    public SubscriptionDTO subscribe(UUID supermarketId, UUID planId) {
        // Validação: supermercado já tem assinatura ativa?
        subscriptionRepository.findBySupermarketIdAndStatusIn(supermarketId, List.of("active", "trialing"))
                .ifPresent(sub -> {
                    throw new RuntimeException("O supermercado já possui uma assinatura ativa.");
                });

        PlanEntity plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plano não encontrado."));

        SubscriptionEntity subscription = new SubscriptionEntity();
        subscription.setSupermarketId(supermarketId);
        subscription.setPlan(plan);
        subscription.setAutoRenew(true);
        subscription.setStartDate(LocalDateTime.now());
        
        if (plan.getTrialDays() > 0) {
            subscription.setStatus("trialing");
            subscription.setRenewalDate(LocalDateTime.now().plusDays(plan.getTrialDays()));
        } else {
            subscription.setStatus("pending"); // Aguardando pagamento
            subscription.setRenewalDate(LocalDateTime.now());
        }

        subscription = subscriptionRepository.save(subscription);
        return toDTO(subscription);
    }

    private SubscriptionDTO toDTO(SubscriptionEntity entity) {
        SubscriptionDTO dto = new SubscriptionDTO();
        dto.setId(entity.getId());
        dto.setSupermarketId(entity.getSupermarketId());
        dto.setStatus(entity.getStatus());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setRenewalDate(entity.getRenewalDate());
        dto.setAutoRenew(entity.getAutoRenew());
        
        if (entity.getPlan() != null) {
            PlanDTO planDTO = new PlanDTO();
            planDTO.setId(entity.getPlan().getId());
            planDTO.setName(entity.getPlan().getName());
            dto.setPlan(planDTO);
        }
        return dto;
    }
}
