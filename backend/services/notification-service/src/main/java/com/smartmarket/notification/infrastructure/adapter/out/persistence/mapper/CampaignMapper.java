package com.smartmarket.notification.infrastructure.adapter.out.persistence.mapper;

import com.smartmarket.notification.domain.model.Campaign;
import com.smartmarket.notification.infrastructure.adapter.out.persistence.CampaignEntity;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CampaignMapper {

    @Mapping(source = "target.type", target = "targetType")
    @Mapping(source = "target.referenceId", target = "targetReferenceId")
    CampaignEntity toEntity(Campaign domain);

    @Mapping(source = "targetType", target = "target.type")
    @Mapping(source = "targetReferenceId", target = "target.referenceId")
    Campaign toDomain(CampaignEntity entity);

    @AfterMapping
    default void enrichDeepLink(CampaignEntity entity, @MappingTarget Campaign domain) {
        if (domain.getTarget() != null && domain.getTarget().getType() != null && domain.getTarget().getReferenceId() != null) {
            String type = domain.getTarget().getType();
            String refId = domain.getTarget().getReferenceId().toString();
            if ("PRODUCT".equalsIgnoreCase(type)) {
                domain.getTarget().setDeepLink("/offers/" + refId);
            } else if ("FLYER".equalsIgnoreCase(type)) {
                domain.getTarget().setDeepLink("/flyer/" + refId);
            }
        }
    }

    @AfterMapping
    default void handleNullTarget(CampaignEntity entity, @MappingTarget Campaign domain) {
        if (entity.getTargetType() == null && entity.getTargetReferenceId() == null) {
            domain.setTarget(null);
        }
    }
}
