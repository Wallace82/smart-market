package com.smartmarket.product.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.infrastructure.adapter.out.persistence.EncarteDigitalEntity;
import com.smartmarket.product.infrastructure.adapter.out.persistence.EncarteItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface EncarteDigitalMapper {

    @Mapping(target = "itens", source = "itens")
    EncarteDigitalEntity toEntity(EncarteDigital domain);

    @Mapping(target = "itens", source = "itens")
    EncarteDigital toDomain(EncarteDigitalEntity entity);

    @Mapping(target = "encarteDigital", ignore = true)
    EncarteItemEntity toItemEntity(EncarteItem domain);

    @Mapping(target = "encarteId", source = "encarteDigital.id")
    EncarteItem toItemDomain(EncarteItemEntity entity);
}

