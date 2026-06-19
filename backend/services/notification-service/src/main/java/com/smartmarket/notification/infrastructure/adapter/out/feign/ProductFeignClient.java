package com.smartmarket.notification.infrastructure.adapter.out.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "product-service", url = "${services.product-service.url}")
public interface ProductFeignClient {

    @GetMapping("/api/v1/ofertas/{id}")
    ResponseEntity<FeignOfferResponse> buscarOfertaPorId(@PathVariable("id") UUID id);

    @GetMapping("/api/v1/encartes/{id}")
    ResponseEntity<FeignEncarteResponse> buscarEncartePorId(@PathVariable("id") UUID id);
}
