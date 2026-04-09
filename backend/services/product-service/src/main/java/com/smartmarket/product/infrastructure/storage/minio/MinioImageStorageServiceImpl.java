package com.smartmarket.product.infrastructure.storage.minio;

import com.smartmarket.product.infrastructure.storage.ImageStorageService;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
public class MinioImageStorageServiceImpl implements ImageStorageService {

    private static final Logger logger = LoggerFactory.getLogger(MinioImageStorageServiceImpl.class);

    private final MinioClient minioClient;

    @Value("${app.minio.bucket-name:smartmarket-products}")
    private String bucketName;

    @Value("${app.minio.public-url-prefix:http://localhost:9000/smartmarket-products/}")
    private String publicUrlPrefix;

    public MinioImageStorageServiceImpl(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public String uploadImage(MultipartFile file, String extension) {
        try {
            String fileName = UUID.randomUUID().toString() + (extension.startsWith(".") ? extension : "." + extension);
            
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
            
            logger.info("Imagem {} enviada com sucesso para o MinIO", fileName);
            return fileName;
            
        } catch (Exception e) {
            logger.error("Erro ao fazer upload da imagem para o MinIO", e);
            throw new RuntimeException("Falha ao salvar a imagem", e);
        }
    }

    @Override
    public InputStream downloadImage(String fileName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build()
            );
        } catch (Exception e) {
            logger.error("Erro ao baixar imagem {} do MinIO", fileName, e);
            throw new RuntimeException("Falha ao recuperar a imagem", e);
        }
    }

    @Override
    public void deleteImage(String fileName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build()
            );
            logger.info("Imagem {} deletada do MinIO", fileName);
        } catch (Exception e) {
            logger.error("Erro ao deletar imagem {} do MinIO", fileName, e);
        }
    }

    @Override
    public String getPublicUrl(String fileName) {
        if (fileName == null || fileName.trim().isEmpty()) {
            return null;
        }
        return publicUrlPrefix + fileName;
    }
}
