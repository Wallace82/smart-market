package com.smartmarket.notification.application.usecase;

import com.smartmarket.notification.application.dto.PushSubscriptionRequest;
import com.smartmarket.notification.application.port.out.PushSubscriptionRepositoryPort;
import com.smartmarket.notification.domain.model.PushSubscription;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalvarInscricaoUseCase {

    private final PushSubscriptionRepositoryPort repository;

    @Transactional
    public PushSubscription execute(PushSubscriptionRequest request) {
        log.info("Processando inscrição de push para o cliente: {}", request.getClientId());

        Optional<PushSubscription> existente = repository.findByEndpoint(request.getEndpoint());

        PushSubscription subscription;
        if (existente.isPresent()) {
            log.info("Endpoint já cadastrado. Atualizando chaves de criptografia.");
            subscription = existente.get();
            subscription.setClientId(request.getClientId());
            subscription.setAuthKey(request.getAuthKey());
            subscription.setP256dhKey(request.getP256dhKey());
        } else {
            log.info("Criando novo registro de inscrição de push.");
            subscription = PushSubscription.builder()
                    .id(UUID.randomUUID())
                    .clientId(request.getClientId())
                    .endpoint(request.getEndpoint())
                    .authKey(request.getAuthKey())
                    .p256dhKey(request.getP256dhKey())
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        return repository.save(subscription);
    }
}
