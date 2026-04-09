package com.smartmarket.product.infrastructure.storage.minio;

import com.smartmarket.product.domain.service.ThemeAssetStorageService;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.UUID;

@Service
public class MinioThemeAssetStorageServiceImpl implements ThemeAssetStorageService {

    private static final Logger logger = LoggerFactory.getLogger(MinioThemeAssetStorageServiceImpl.class);

    private final MinioClient minioClient;

    @Value("${app.minio.bucket-name-themes:smartmarket-themes}") // Usar um nome de propriedade diferente para o bucket de temas
    private String bucketName;

    @Value("${app.minio.public-url-prefix-themes:http://localhost:9000/smartmarket-themes/}") // Prefixo de URL pública para temas
    private String publicUrlPrefix;

    public MinioThemeAssetStorageServiceImpl(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public String upload(String originalFileName, InputStream inputStream, String contentType) {
        try {
            String fileExtension = "";
            int dotIndex = originalFileName.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFileName.length() - 1) {
                fileExtension = originalFileName.substring(dotIndex);
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(inputStream, inputStream.available(), -1)
                            .contentType(contentType)
                            .build()
            );

            logger.info("Asset de tema {} enviado com sucesso para o MinIO no bucket {}", fileName, bucketName);
            return publicUrlPrefix + fileName; // Retorna a URL pública completa
        } catch (Exception e) {
            logger.error("Erro ao fazer upload do asset de tema para o MinIO", e);
            throw new RuntimeException("Falha ao salvar o asset de tema", e);
        }
    }

    @Override
    public void delete(String fileName) {
        try {
            // Extrai apenas o nome do arquivo da URL pública, se for o caso
            String objectName = fileName;
            if (fileName.startsWith(publicUrlPrefix)) {
                objectName = fileName.substring(publicUrlPrefix.length());
            }

            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            logger.info("Asset de tema {} deletado do MinIO no bucket {}", objectName, bucketName);
        } catch (Exception e) {
            logger.error("Erro ao deletar asset de tema {} do MinIO", fileName, e);
        }
    }
}
