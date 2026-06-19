package com.smartmarket.notification.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagedDeliveryResponse {
    private List<NotificationDeliveryResponse> content;
    private PageMetadata page;
}
