package com.smartmarket.concierge.infrastructure.adapter.out.client;

import com.smartmarket.concierge.application.dto.AssinaturaResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "billing-service", url = "${services.billing-service.url}")
public interface BillingClient {

    @GetMapping("/api/v1/assinaturas/supermercado/{supermercadoId}")
    AssinaturaResponse getAssinaturaBySupermercadoId(@PathVariable("supermercadoId") UUID supermercadoId);
}
