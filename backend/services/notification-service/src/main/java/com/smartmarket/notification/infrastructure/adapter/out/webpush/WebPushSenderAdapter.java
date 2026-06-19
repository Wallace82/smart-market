package com.smartmarket.notification.infrastructure.adapter.out.webpush;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartmarket.notification.application.port.out.PushNotificationSenderPort;
import com.smartmarket.notification.domain.model.PushSubscription;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.apache.http.HttpResponse;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebPushSenderAdapter implements PushNotificationSenderPort {

    private final PushService pushService;
    private final ObjectMapper objectMapper;

    @Override
    public void sendPush(PushSubscription subscription, String title, String message, String deepLink) throws Exception {
        log.info("Preparando envio de push para o endpoint: {}", subscription.getEndpoint());

        Subscription.Keys keys = new Subscription.Keys(subscription.getP256dhKey(), subscription.getAuthKey());
        Subscription libSubscription = new Subscription(subscription.getEndpoint(), keys);

        Map<String, Object> payload = new HashMap<>();
        Map<String, Object> notificationData = new HashMap<>();
        notificationData.put("title", title);
        notificationData.put("body", message);
        
        Map<String, Object> customData = new HashMap<>();
        if (deepLink != null) {
            customData.put("url", deepLink);
        }
        notificationData.put("data", customData);
        payload.put("notification", notificationData);

        String payloadJson = objectMapper.writeValueAsString(payload);
        log.debug("Payload JSON do push: {}", payloadJson);

        Notification notification = new Notification(libSubscription, payloadJson);

        HttpResponse response = pushService.send(notification);
        int statusCode = response.getStatusLine().getStatusCode();
        log.info("Resposta do servidor de push: {}", statusCode);
        
        if (statusCode >= 300) {
            throw new RuntimeException("Falha no envio do push, código de status HTTP: " + statusCode);
        }
    }
}
