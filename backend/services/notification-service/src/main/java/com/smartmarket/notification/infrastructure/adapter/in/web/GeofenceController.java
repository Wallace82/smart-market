package com.smartmarket.notification.infrastructure.adapter.in.web;

import com.smartmarket.notification.application.dto.GeofenceEvaluateRequest;
import com.smartmarket.notification.application.dto.GeofenceEvaluateResponse;
import com.smartmarket.notification.application.usecase.AvaliarGeofenceUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/geofence")
@RequiredArgsConstructor
@Slf4j
public class GeofenceController {

    private final AvaliarGeofenceUseCase avaliarGeofenceUseCase;

    @PostMapping("/evaluate")
    public ResponseEntity<GeofenceEvaluateResponse> avaliarGeofence(@Valid @RequestBody GeofenceEvaluateRequest request) {
        String traceId = UUID.randomUUID().toString();
        
        // Dispara o Use Case assíncrono
        avaliarGeofenceUseCase.execute(request);
        
        GeofenceEvaluateResponse response = GeofenceEvaluateResponse.builder()
                .accepted(true)
                .traceId(traceId)
                .build();
                
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
