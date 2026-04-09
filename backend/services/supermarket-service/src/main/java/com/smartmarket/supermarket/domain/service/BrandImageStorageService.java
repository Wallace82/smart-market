package com.smartmarket.supermarket.domain.service;

import java.io.InputStream;

public interface BrandImageStorageService {
    String upload(String fileName, InputStream inputStream, String contentType);
    void delete(String fileName);
}
