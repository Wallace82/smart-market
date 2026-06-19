package com.smartmarket.notification.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupermarketDto {
    private UUID id;
    private String nomeFantasia;
    private Double latitude;
    private Double longitude;
}
