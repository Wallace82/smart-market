package com.smartmarket.billing.application.service;

import com.smartmarket.billing.application.dto.PlanDTO;
import com.smartmarket.billing.infrastructure.persistence.entity.PlanEntity;
import com.smartmarket.billing.infrastructure.persistence.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    @Transactional(readOnly = true)
    public List<PlanDTO> getAllActivePlans() {
        return planRepository.findByActiveTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlanDTO createPlan(PlanDTO dto) {
        PlanEntity entity = toEntity(dto);
        entity = planRepository.save(entity);
        return toDTO(entity);
    }

    private PlanDTO toDTO(PlanEntity entity) {
        PlanDTO dto = new PlanDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setBillingCycle(entity.getBillingCycle());
        dto.setMaxOffers(entity.getMaxOffers());
        dto.setMaxPushNotifications(entity.getMaxPushNotifications());
        dto.setAllowCustomerPreferences(entity.getAllowCustomerPreferences());
        dto.setTrialDays(entity.getTrialDays());
        dto.setActive(entity.getActive());
        return dto;
    }

    private PlanEntity toEntity(PlanDTO dto) {
        PlanEntity entity = new PlanEntity();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setBillingCycle(dto.getBillingCycle());
        entity.setMaxOffers(dto.getMaxOffers());
        entity.setMaxPushNotifications(dto.getMaxPushNotifications());
        entity.setAllowCustomerPreferences(dto.getAllowCustomerPreferences() != null ? dto.getAllowCustomerPreferences() : false);
        entity.setTrialDays(dto.getTrialDays() != null ? dto.getTrialDays() : 0);
        entity.setActive(dto.getActive() != null ? dto.getActive() : true);
        return entity;
    }
}
