package com.smartmarket.notification.application.usecase;

import com.smartmarket.notification.application.dto.GeofenceEvaluateRequest;
import com.smartmarket.notification.application.dto.SupermarketDto;
import com.smartmarket.notification.application.port.out.NotificationDeliveryRepositoryPort;
import com.smartmarket.notification.application.port.out.PushNotificationSenderPort;
import com.smartmarket.notification.application.port.out.PushSubscriptionRepositoryPort;
import com.smartmarket.notification.application.port.out.CampaignRepositoryPort;
import com.smartmarket.notification.domain.model.Campaign;
import com.smartmarket.notification.domain.model.NotificationDelivery;
import com.smartmarket.notification.domain.model.PushSubscription;
import com.smartmarket.notification.infrastructure.adapter.out.feign.SupermarketFeignClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvaliarGeofenceUseCase {

    private final SupermarketFeignClient supermarketFeignClient;
    private final CampaignRepositoryPort campaignRepository;
    private final PushSubscriptionRepositoryPort subscriptionRepository;
    private final PushNotificationSenderPort pushNotificationSender;
    private final NotificationDeliveryRepositoryPort deliveryRepository;

    public void execute(GeofenceEvaluateRequest request) {
        String traceId = UUID.randomUUID().toString();
        log.info("Recebida avaliação de geofencing [TraceId: {}] para o cliente: {} nas coordenadas ({}, {})",
                traceId, request.getClientId(), request.getLatitude(), request.getLongitude());

        // Processa de forma assíncrona para liberar o endpoint imediatamente
        CompletableFuture.runAsync(() -> {
            try {
                processarAvaliacao(request, traceId);
            } catch (Exception e) {
                log.error("Erro ao processar avaliação de geofencing assíncrona [TraceId: {}]", traceId, e);
            }
        });
    }

    private void processarAvaliacao(GeofenceEvaluateRequest request, String traceId) {
        log.info("[TraceId: {}] Buscando supermercados próximos...", traceId);
        
        // Busca supermercados num raio de 50km
        ResponseEntity<List<SupermarketDto>> response = supermarketFeignClient.buscarProximos(
                request.getLatitude(), request.getLongitude(), 50000
            );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null || response.getBody().isEmpty()) {
            log.info("[TraceId: {}] Nenhum supermercado encontrado na região.", traceId);
            return;
        }

        List<SupermarketDto> supermercados = response.getBody();
        log.info("[TraceId: {}] Encontrados {} supermercados candidatos.", traceId, supermercados.size());

        for (SupermarketDto supermarket : supermercados) {
            double distancia = calcularDistanciaHaversine(
                    request.getLatitude(), request.getLongitude(),
                    supermarket.getLatitude(), supermarket.getLongitude()
            );

            log.info("[TraceId: {}] Supermercado {} está a {} metros de distância.", 
                    traceId, supermarket.getNomeFantasia(), (int) distancia);

            // Busca as campanhas ativas locais do supermercado
            List<Campaign> campanhas = campaignRepository.findActiveBySupermarketId(supermarket.getId());

            for (Campaign campanha : campanhas) {
                int raioCampanha = campanha.getRadiusMeters() != null ? campanha.getRadiusMeters() : 3000;
                log.info("[TraceId: {}] Avaliando campanha '{}' (Raio: {}m)", 
                        traceId, campanha.getTitle(), raioCampanha);

                if (distancia <= raioCampanha) {
                    log.info("[TraceId: {}] Cliente dentro do raio da campanha. Iniciando validações de disparo...", traceId);
                    processarDisparoCampanha(request, campanha, traceId);
                }
            }
        }
    }

    private void processarDisparoCampanha(GeofenceEvaluateRequest request, Campaign campanha, String traceId) {
        UUID campaignId = campanha.getId();
        UUID clientId = request.getClientId();
        String mensagem = campanha.getMessage() != null ? campanha.getMessage() : "";
        String titulo = campanha.getTitle() != null ? campanha.getTitle() : "";
        String messageHash = gerarHashMensagem(campaignId, clientId, mensagem);
        String deepLink = campanha.getTarget() != null ? campanha.getTarget().getDeepLink() : null;

        // 1. Consentimento Push (Simulação de Consentimento, bloqueia se explicitamente proibido)
        // No MVP/Pós-MVP inicial, caso não tenhamos o client-service ativo com opt-out, assume true.
        boolean consentPush = true; 
        if (!consentPush) {
            gravarHistoricoBloqueado(campaignId, clientId, "CONSENT_REVOKED", messageHash, deepLink);
            log.info("[TraceId: {}] Disparo bloqueado: consentimento de push revogado.", traceId);
            return;
        }

        // 2. Frequency Capping
        int dailyLimit = campanha.getDailyLimitPerClient() != null ? campanha.getDailyLimitPerClient() : 1;
        long enviosHoje = deliveryRepository.countDeliveriesToday(clientId, campaignId);
        if (enviosHoje >= dailyLimit) {
            gravarHistoricoBloqueado(campaignId, clientId, "FREQUENCY_CAP_EXCEEDED", messageHash, deepLink);
            log.info("[TraceId: {}] Disparo bloqueado: Frequency Capping atingido ({} envios hoje).", traceId, enviosHoje);
            return;
        }

        // 3. Deduplicação de Mensagem
        boolean duplicada = deliveryRepository.existsDuplicate(campaignId, clientId, messageHash);
        if (duplicada) {
            gravarHistoricoBloqueado(campaignId, clientId, "DUPLICATE_MESSAGE", messageHash, deepLink);
            log.info("[TraceId: {}] Disparo bloqueado: Mensagem duplicada para o cliente.", traceId);
            return;
        }

        // 4. Disparo do Push
        List<PushSubscription> subscriptions = subscriptionRepository.findAllByClientId(clientId);
        if (subscriptions.isEmpty()) {
            NotificationDelivery delivery = NotificationDelivery.builder()
                    .id(UUID.randomUUID())
                    .campaignId(campaignId)
                    .clientId(clientId)
                    .status("FALHA")
                    .blockReason(null)
                    .sentAt(LocalDateTime.now())
                    .messageHash(messageHash)
                    .deepLink(deepLink)
                    .build();
            deliveryRepository.save(delivery);
            log.info("[TraceId: {}] Disparo falhou: nenhuma inscrição de push ativa para o cliente.", traceId);
            return;
        }

        // Envia para todos os dispositivos inscritos do cliente
        boolean algumEnviado = false;
        for (PushSubscription subscription : subscriptions) {
            try {
                pushNotificationSender.sendPush(subscription, titulo, mensagem, deepLink);
                algumEnviado = true;
            } catch (Exception e) {
                log.error("[TraceId: {}] Erro ao enviar Web Push para o endpoint: {}", traceId, subscription.getEndpoint(), e);
            }
        }

        NotificationDelivery delivery = NotificationDelivery.builder()
                .id(UUID.randomUUID())
                .campaignId(campaignId)
                .clientId(clientId)
                .status(algumEnviado ? "ENVIADA" : "FALHA")
                .sentAt(LocalDateTime.now())
                .messageHash(messageHash)
                .deepLink(deepLink)
                .build();
        deliveryRepository.save(delivery);

        log.info("[TraceId: {}] Avaliação concluída. Status do envio: {}", traceId, delivery.getStatus());
    }

    private void gravarHistoricoBloqueado(UUID campaignId, UUID clientId, String reason, String messageHash, String deepLink) {
        NotificationDelivery delivery = NotificationDelivery.builder()
                .id(UUID.randomUUID())
                .campaignId(campaignId)
                .clientId(clientId)
                .status("BLOQUEADA")
                .blockReason(reason)
                .sentAt(LocalDateTime.now())
                .messageHash(messageHash)
                .deepLink(deepLink)
                .build();
        deliveryRepository.save(delivery);
    }

    private double calcularDistanciaHaversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Raio da Terra em km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; // Retorna a distância em metros
    }

    private String gerarHashMensagem(UUID campaignId, UUID clientId, String message) {
        try {
            String input = campaignId.toString() + clientId.toString() + message;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar hash de deduplicação", e);
        }
    }
}
