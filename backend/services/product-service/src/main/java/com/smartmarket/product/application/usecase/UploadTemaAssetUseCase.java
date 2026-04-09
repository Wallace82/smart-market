package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.TemaEncarte;
import com.smartmarket.product.domain.repository.TemaEncarteDomainRepository;
import com.smartmarket.product.domain.service.ThemeAssetStorageService;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.UUID;

@Service
public class UploadTemaAssetUseCase {

    private final TemaEncarteDomainRepository repository;
    private final ThemeAssetStorageService storageService;

    public UploadTemaAssetUseCase(TemaEncarteDomainRepository repository, ThemeAssetStorageService storageService) {
        this.repository = repository;
        this.storageService = storageService;
    }

    public String execute(UUID temaId, String originalFileName, InputStream inputStream, String contentType) {
        TemaEncarte tema = repository.findById(temaId)
                .orElseThrow(() -> new IllegalArgumentException("Tema de encarte não encontrado com ID: " + temaId));

        // Deleta o asset antigo se existir
        if (tema.getUrlBackgroundDecorativo() != null && !tema.getUrlBackgroundDecorativo().isEmpty()) {
            storageService.delete(tema.getUrlBackgroundDecorativo());
        }

        String newUrl = storageService.upload(originalFileName, inputStream, contentType);
        tema.setUrlBackgroundDecorativo(newUrl);
        repository.save(tema);

        return newUrl;
    }
}
