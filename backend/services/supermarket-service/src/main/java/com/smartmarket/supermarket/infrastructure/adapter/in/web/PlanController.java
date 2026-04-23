package com.smartmarket.supermarket.infrastructure.adapter.in.web;

import com.smartmarket.supermarket.application.dto.CreatePlanRequest;
import com.smartmarket.supermarket.application.dto.PlanResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/plans")
public class PlanController {

    @GetMapping
    public ResponseEntity<List<PlanResponse>> listarPlanos() {
        return ResponseEntity.ok(List.of(
            new PlanResponse(UUID.randomUUID(), "FREE", 0.0, 100, 1, 2),
            new PlanResponse(UUID.randomUUID(), "BASIC", 99.90, 1000, 3, 10),
            new PlanResponse(UUID.randomUUID(), "PREMIUM", 199.90, 5000, 10, 30)
        ));
    }

    @PostMapping
    public ResponseEntity<PlanResponse> criarPlano(@RequestBody CreatePlanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            new PlanResponse(UUID.randomUUID(), request.getName(), request.getMonthlyPrice(),
                             request.getProductLimit(), request.getManagerLimit(), request.getPublicationLimit())
        );
    }
}

