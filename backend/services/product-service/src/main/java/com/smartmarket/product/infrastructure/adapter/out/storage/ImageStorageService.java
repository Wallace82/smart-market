package com.smartmarket.product.infrastructure.adapter.out.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface ImageStorageService {
    String uploadImage(MultipartFile file, String fileExtension);
    InputStream downloadImage(String fileName);
    void deleteImage(String fileName);
    String getPublicUrl(String fileName);
}

