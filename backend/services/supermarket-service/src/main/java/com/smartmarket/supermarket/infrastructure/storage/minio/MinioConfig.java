package com.smartmarket.supermarket.infrastructure.storage.minio;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Value("${app.minio.url:http://localhost:9000}")
    private String minioUrl;

    @Value("${app.minio.access-key:admin}")
    private String accessKey;

    @Value("${app.minio.secret-key:password}")
    private String secretKey;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(accessKey, secretKey)
                .build();
    }
}
