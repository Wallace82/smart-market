package com.smartmarket.notification.application.port.out;

import com.smartmarket.notification.domain.model.PushSubscription;

public interface PushNotificationSenderPort {
    void sendPush(PushSubscription subscription, String title, String message, String deepLink) throws Exception;
}
