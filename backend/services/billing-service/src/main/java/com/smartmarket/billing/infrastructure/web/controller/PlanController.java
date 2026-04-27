package com.smartmarket.billing.infrastructure.web.controller;

import com.smartmarket.billing.application.dto.PlanDTO;
import com.smartmarket.billing.application.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @GetMapping
    public ResponseEntity<List<PlanDTO>> getActivePlans() {
        return ResponseEntity.ok(planService.getAllActivePlans());
    }

    @PostMapping
    public ResponseEntity<PlanDTO> createPlan(@RequestBody PlanDTO planDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.createPlan(planDTO));
    }
}
