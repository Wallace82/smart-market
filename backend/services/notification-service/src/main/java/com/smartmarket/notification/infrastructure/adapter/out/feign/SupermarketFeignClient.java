package com.smartmarket.notification.infrastructure.adapter.out.feign;

import com.smartmarket.notification.application.dto.SupermarketDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "supermarket-service", url = "${services.supermarket-service.url}")
public interface SupermarketFeignClient {

    @GetMapping("/api/v1/supermercados/public/nearby")
    ResponseEntity<List<SupermarketDto>> buscarProximos(
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam("radiusMeters") Integer radiusMeters
    );

    @GetMapping("/api/v1/campanhas/supermercado/{supermercadoId}")
    ResponseEntity<List<FeignCampaignResponse>> listarCampanhasPorSupermercado(
            @PathVariable("supermercadoId") UUID supermercadoId
    );
}
