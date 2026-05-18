package com.smartmarket.billing.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.billing.domain.model.Assinatura;
import com.smartmarket.billing.domain.model.Plano;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.AssinaturaEntity;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.PlanoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BillingMapper {

    Plano toDomain(PlanoEntity entity);
    PlanoEntity toEntity(Plano domain);

    Assinatura toDomain(AssinaturaEntity entity);
    AssinaturaEntity toEntity(Assinatura domain);
}
