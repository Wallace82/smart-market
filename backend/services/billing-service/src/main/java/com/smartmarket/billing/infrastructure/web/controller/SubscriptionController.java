package com.smartmarket.billing.infrastructure.web.controller;

import com.smartmarket.billing.application.dto.SubscriptionDTO;
import com.smartmarket.billing.application.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/supermarket/{supermarketId}")
    public ResponseEntity<SubscriptionDTO> getActiveSubscription(@PathVariable UUID supermarketId) {
        return ResponseEntity.ok(subscriptionService.getActiveSubscriptionForSupermarket(supermarketId));
    }

    @PostMapping("/supermarket/{supermarketId}/subscribe")
    public ResponseEntity<SubscriptionDTO> subscribe(
            @PathVariable UUID supermarketId,
            @RequestParam UUID planId) {
        return ResponseEntity.ok(subscriptionService.subscribe(supermarketId, planId));
    }
}
