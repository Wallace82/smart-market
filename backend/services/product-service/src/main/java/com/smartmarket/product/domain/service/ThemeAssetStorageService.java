package com.smartmarket.product.domain.service;

import java.io.InputStream;

public interface ThemeAssetStorageService {
    String upload(String fileName, InputStream inputStream, String contentType);
    void delete(String fileName);
}
