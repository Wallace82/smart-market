package com.smartmarket.notification.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.notification.domain.model.NotificationDelivery;
import com.smartmarket.notification.infrastructure.adapter.out.persistence.NotificationDeliveryEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationDeliveryMapper {
    NotificationDeliveryEntity toEntity(NotificationDelivery domain);
    NotificationDelivery toDomain(NotificationDeliveryEntity entity);
}
