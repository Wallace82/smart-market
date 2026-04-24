package com.smartmarket.product.infrastructure.adapter.in.web.mapper;

import com.smartmarket.product.domain.model.EncarteDigital;
import com.smartmarket.product.domain.model.EncarteItem;
import com.smartmarket.product.application.dto.EncarteDigitalRequest;
import com.smartmarket.product.application.dto.EncarteDigitalResponse;
import com.smartmarket.product.application.dto.EncarteItemRequest;
import com.smartmarket.product.application.dto.EncarteItemResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EncarteDigitalWebMapper {

    public EncarteDigital toDomain(EncarteDigitalRequest request) {
        if (request == null) return null;
        EncarteDigital domain = new EncarteDigital();
        domain.setSupermercadoId(request.getSupermercadoId());
        domain.setTemaId(request.getTemaId());
        domain.setTitulo(request.getTitulo());
        domain.setDataInicio(request.getDataInicio());
        domain.setDataFim(request.getDataFim());

        if (request.getItens() != null) {
            domain.setItens(request.getItens().stream().map(this::toItemDomain).collect(Collectors.toList()));
        }

        return domain;
    }

    public EncarteItem toItemDomain(EncarteItemRequest request) {
        if (request == null) return null;
        EncarteItem domain = new EncarteItem();
        domain.setOfertaId(request.getOfertaId());
        domain.setOrdemExibicao(request.getOrdemExibicao());
        domain.setDestaque(request.isDestaque());
        return domain;
    }

    public EncarteDigitalResponse toResponse(EncarteDigital domain) {
        if (domain == null) return null;
        
        List<EncarteItemResponse> itemResponses = null;
        if (domain.getItens() != null) {
            itemResponses = domain.getItens().stream().map(this::toItemResponse).collect(Collectors.toList());
        }

        return new EncarteDigitalResponse(
            domain.getId(),
            domain.getSupermercadoId(),
            domain.getTemaId(),
            domain.getTitulo(),
            domain.getDataInicio(),
            domain.getDataFim(),
            domain.getStatus(),
            domain.getCriadoEm(),
            domain.getAtualizadoEm(),
            itemResponses
        );
    }

    public EncarteItemResponse toItemResponse(EncarteItem domain) {
        if (domain == null) return null;
        return new EncarteItemResponse(
            domain.getId(),
            domain.getOfertaId(),
            domain.getOrdemExibicao(),
            domain.isDestaque()
        );
    }
}


