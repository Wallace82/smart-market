package com.smartmarket.notification.infrastructure.adapter.in.web;

import com.smartmarket.notification.application.dto.NotificationDeliveryResponse;
import com.smartmarket.notification.application.dto.PageMetadata;
import com.smartmarket.notification.application.dto.PagedDeliveryResponse;
import com.smartmarket.notification.application.dto.PushSubscriptionRequest;
import com.smartmarket.notification.application.usecase.ListarHistoricoUseCase;
import com.smartmarket.notification.application.usecase.SalvarInscricaoUseCase;
import com.smartmarket.notification.domain.model.PushSubscription;
import com.smartmarket.notification.infrastructure.config.WebPushConfig;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final SalvarInscricaoUseCase salvarInscricaoUseCase;
    private final ListarHistoricoUseCase listarHistoricoUseCase;
    private final WebPushConfig webPushConfig;

    @PostMapping("/subscribe")
    public ResponseEntity<PushSubscription> inscreverPush(@Valid @RequestBody PushSubscriptionRequest request) {
        PushSubscription subscription = salvarInscricaoUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(subscription);
    }

    @GetMapping("/history")
    public ResponseEntity<PagedDeliveryResponse> listarHistorico(
            @RequestParam(value = "campaignId", required = false) UUID campaignId,
            @RequestParam(value = "clientId", required = false) UUID clientId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        List<NotificationDeliveryResponse> deliveries = 
                listarHistoricoUseCase.execute(campaignId, clientId, status, page, size);
        
        long totalElements = listarHistoricoUseCase.count(campaignId, clientId, status);
        int totalPages = (int) Math.ceil((double) totalElements / size);

        PageMetadata pageMetadata = PageMetadata.builder()
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .build();

        PagedDeliveryResponse response = PagedDeliveryResponse.builder()
                .content(deliveries)
                .page(pageMetadata)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/vapid/public-key")
    public ResponseEntity<Map<String, String>> obterChavePublicaVapid() {
        Map<String, String> response = new HashMap<>();
        response.put("publicKey", webPushConfig.getPublicKey());
        return ResponseEntity.ok(response);
    }
}
