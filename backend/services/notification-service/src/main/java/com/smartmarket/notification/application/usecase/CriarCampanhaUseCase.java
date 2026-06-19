package com.smartmarket.notification.application.usecase;

import com.smartmarket.notification.application.port.out.CampaignRepositoryPort;
import com.smartmarket.notification.domain.model.Campaign;
import com.smartmarket.notification.domain.model.CampaignTarget;
import com.smartmarket.notification.infrastructure.adapter.out.feign.FeignEncarteResponse;
import com.smartmarket.notification.infrastructure.adapter.out.feign.FeignOfferResponse;
import com.smartmarket.notification.infrastructure.adapter.out.feign.ProductFeignClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CriarCampanhaUseCase {

    private final CampaignRepositoryPort campaignRepository;
    private final ProductFeignClient productFeignClient;

    public Campaign execute(Campaign campaign) {
        log.info("Processando criação de campanha: '{}' para supermercado: {}", campaign.getTitle(), campaign.getSupermarketId());

        // Validações do Vínculo (Target)
        if (campaign.getTarget() != null && campaign.getTarget().getType() != null) {
            String type = campaign.getTarget().getType();
            UUID refId = campaign.getTarget().getReferenceId();

            if (!"NONE".equalsIgnoreCase(type) && refId == null) {
                throw new IllegalArgumentException("A referência do alvo (referenceId) é obrigatória para o tipo " + type);
            }

            if ("PRODUCT".equalsIgnoreCase(type)) {
                log.info("Validando oferta ID: {} para supermercado: {}", refId, campaign.getSupermarketId());
                ResponseEntity<FeignOfferResponse> offerResp = productFeignClient.buscarOfertaPorId(refId);
                if (!offerResp.getStatusCode().is2xxSuccessful() || offerResp.getBody() == null) {
                    throw new IllegalArgumentException("Oferta informada como alvo não encontrada.");
                }

                FeignOfferResponse offer = offerResp.getBody();
                if (!offer.isAtivo()) {
                    throw new IllegalArgumentException("A oferta selecionada não está ativa.");
                }
                if (offer.getSupermercadoId() != null && !offer.getSupermercadoId().equals(campaign.getSupermarketId())) {
                    throw new IllegalArgumentException("A oferta selecionada pertence a outro supermercado.");
                }
                if (offer.getDataFimPromocao() != null && offer.getDataFimPromocao().isBefore(LocalDateTime.now())) {
                    throw new IllegalArgumentException("A oferta selecionada está expirada.");
                }
            } else if ("FLYER".equalsIgnoreCase(type)) {
                log.info("Validando encarte ID: {} para supermercado: {}", refId, campaign.getSupermarketId());
                ResponseEntity<FeignEncarteResponse> encarteResp = productFeignClient.buscarEncartePorId(refId);
                if (!encarteResp.getStatusCode().is2xxSuccessful() || encarteResp.getBody() == null) {
                    throw new IllegalArgumentException("Encarte informado como alvo não encontrado.");
                }

                FeignEncarteResponse encarte = encarteResp.getBody();
                if ("ENCERRADO".equalsIgnoreCase(encarte.getStatus())) {
                    throw new IllegalArgumentException("O encarte selecionado está encerrado.");
                }
                if (encarte.getSupermercadoId() != null && !encarte.getSupermercadoId().equals(campaign.getSupermarketId())) {
                    throw new IllegalArgumentException("O encarte selecionado pertence a outro supermercado.");
                }
            }
        }

        // Configuração dos campos padrão
        if (campaign.getId() == null) {
            campaign.setId(UUID.randomUUID());
        }
        if (campaign.getStatus() == null) {
            campaign.setStatus("ATIVA");
        }
        campaign.setCreatedAt(LocalDateTime.now());
        campaign.setUpdatedAt(LocalDateTime.now());

        log.info("Salvando campanha com ID: {}", campaign.getId());
        return campaignRepository.save(campaign);
    }
}
