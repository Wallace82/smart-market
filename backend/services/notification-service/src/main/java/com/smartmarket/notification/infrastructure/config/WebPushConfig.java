package com.smartmarket.notification.infrastructure.config;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Utils;
import org.bouncycastle.jce.interfaces.ECPrivateKey;
import org.bouncycastle.jce.interfaces.ECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Security;
import java.util.Base64;

@Configuration
@Slf4j
public class WebPushConfig {

    @Value("${app.vapid.public-key:}")
    private String configuredPublicKey;

    @Value("${app.vapid.private-key:}")
    private String configuredPrivateKey;

    @Value("${app.vapid.subject:mailto:admin@smartmarket.com}")
    @Getter
    private String subject;

    @Getter
    private String publicKey;

    private String privateKey;

    @PostConstruct
    public void init() {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }

        if (configuredPublicKey == null || configuredPublicKey.isBlank() ||
            configuredPrivateKey == null || configuredPrivateKey.isBlank()) {
            try {
                log.info("Chaves VAPID não configuradas. Gerando chaves temporárias para desenvolvimento...");
                
                org.bouncycastle.jce.spec.ECNamedCurveParameterSpec parameterSpec = 
                        org.bouncycastle.jce.ECNamedCurveTable.getParameterSpec("prime256v1");
                KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("ECDH", "BC");
                keyPairGenerator.initialize(parameterSpec);
                KeyPair keyPair = keyPairGenerator.generateKeyPair();
                
                byte[] pubBytes = Utils.encode((ECPublicKey) keyPair.getPublic());
                byte[] privBytes = Utils.encode((ECPrivateKey) keyPair.getPrivate());
                
                publicKey = Base64.getUrlEncoder().withoutPadding().encodeToString(pubBytes);
                privateKey = Base64.getUrlEncoder().withoutPadding().encodeToString(privBytes);
                
                log.info("Chaves VAPID geradas com sucesso!");
                log.info("PUBLIC KEY (VAPID): {}", publicKey);
            } catch (Exception e) {
                log.error("Erro ao gerar chaves VAPID", e);
                throw new IllegalStateException("Falha ao inicializar chaves VAPID", e);
            }
        } else {
            publicKey = configuredPublicKey;
            privateKey = configuredPrivateKey;
            log.info("Chaves VAPID configuradas carregadas com sucesso!");
        }
    }

    @Bean
    public PushService pushService() throws Exception {
        PushService pushService = new PushService();
        pushService.setPublicKey(Utils.loadPublicKey(publicKey));
        pushService.setPrivateKey(Utils.loadPrivateKey(privateKey));
        pushService.setSubject(subject);
        return pushService;
    }
}
