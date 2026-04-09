package com.smartmarket.product.infrastructure.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface ImageStorageService {
    String uploadImage(MultipartFile file, String fileName);
    InputStream downloadImage(String fileName);
    void deleteImage(String fileName);
    String getPublicUrl(String fileName);
}
