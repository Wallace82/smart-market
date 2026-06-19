package com.smartmarket.notification.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PushSubscription {
    private UUID id;
    private UUID clientId;
    private String endpoint;
    private String authKey;
    private String p256dhKey;
    private LocalDateTime createdAt;
}
