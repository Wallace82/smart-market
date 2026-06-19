package com.smartmarket.notification.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.notification.domain.model.PushSubscription;
import com.smartmarket.notification.infrastructure.adapter.out.persistence.PushSubscriptionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PushSubscriptionMapper {
    PushSubscriptionEntity toEntity(PushSubscription domain);
    PushSubscription toDomain(PushSubscriptionEntity entity);
}
