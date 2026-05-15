package com.smartmarket.concierge.domain.service;

import java.io.InputStream;

public interface ConciergeStorageService {
    String upload(String originalFileName, InputStream inputStream, String contentType, long size);
    void delete(String fileUrl);
}
