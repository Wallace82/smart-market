package com.smartmarket.notification.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignTarget {
    private String type; // PRODUCT, FLYER
    private UUID referenceId;
    private String deepLink;
}
