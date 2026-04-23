package com.smartmarket.product.infrastructure.adapter.in.web.mapper;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.application.dto.EncarteDigitalRequest;
import com.smartmarket.product.application.dto.EncarteDigitalResponse;
import com.smartmarket.product.application.dto.EncarteItemRequest;
import com.smartmarket.product.application.dto.EncarteItemResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface EncarteDigitalWebMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    @Mapping(target = "atualizadoEm", ignore = true)
    EncarteDigital toDomain(EncarteDigitalRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "encarteId", ignore = true)
    EncarteItem toItemDomain(EncarteItemRequest request);

    EncarteDigitalResponse toResponse(EncarteDigital domain);

    EncarteItemResponse toItemResponse(EncarteItem domain);
}


