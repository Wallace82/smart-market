package com.smartmarket.concierge.infrastructure.adapter.out.storage.minio;

import com.smartmarket.concierge.domain.service.ConciergeStorageService;
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
public class MinioConciergeStorageServiceImpl implements ConciergeStorageService {

    private static final Logger logger = LoggerFactory.getLogger(MinioConciergeStorageServiceImpl.class);

    private final MinioClient minioClient;

    @Value("${minio.bucket:smartmarket-concierge}")
    private String bucketName;

    public MinioConciergeStorageServiceImpl(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public String upload(String originalFileName, InputStream inputStream, String contentType, long size) {
        try {
            String fileExtension = "";
            int dotIndex = originalFileName.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFileName.substring(dotIndex);
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(inputStream, size, -1)
                            .contentType(contentType)
                            .build()
            );

            logger.info("Arquivo concierge {} enviado com sucesso para o bucket {}", fileName, bucketName);
            
            // Retorna o caminho relativo ou URL completa dependendo da necessidade. 
            // Para consistência com o projeto, retornamos a URL pública simulada.
            return "/smartmarket-concierge/" + fileName;
        } catch (Exception e) {
            logger.error("Erro ao fazer upload do arquivo para o MinIO", e);
            throw new RuntimeException("Falha ao salvar arquivo no storage", e);
        }
    }

    @Override
    public void delete(String fileUrl) {
        try {
            String objectName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            logger.info("Arquivo {} deletado com sucesso do bucket {}", objectName, bucketName);
        } catch (Exception e) {
            logger.error("Erro ao deletar arquivo do MinIO: {}", fileUrl, e);
        }
    }
}
