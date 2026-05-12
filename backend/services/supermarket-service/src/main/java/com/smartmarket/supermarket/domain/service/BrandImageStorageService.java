package com.smartmarket.supermarket.domain.service;

import java.io.InputStream;

public interface BrandImageStorageService {
    String upload(String fileName, InputStream inputStream, String contentType, long size);
    void delete(String fileName);
}

