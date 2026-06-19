package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.OfertaSupermercado;
import com.smartmarket.product.application.port.out.OfertaDomainRepository;
import com.smartmarket.product.infrastructure.adapter.out.storage.ImageStorageService;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ObterOfertaUseCase {

    private final OfertaDomainRepository ofertaRepository;
    private final ImageStorageService imageStorageService;

    public ObterOfertaUseCase(OfertaDomainRepository ofertaRepository, ImageStorageService imageStorageService) {
        this.ofertaRepository = ofertaRepository;
        this.imageStorageService = imageStorageService;
    }

    public Optional<OfertaSupermercado> execute(UUID id) {
        Optional<OfertaSupermercado> ofertaOpt = ofertaRepository.findById(id);
        ofertaOpt.ifPresent(this::enriquecerUrlImagem);
        return ofertaOpt;
    }

    private void enriquecerUrlImagem(OfertaSupermercado oferta) {
        if (oferta.getProdutoBase() != null) {
            String url = oferta.getProdutoBase().getUrlImagem();
            if (url != null && !url.startsWith("http")) {
                oferta.getProdutoBase().setUrlImagem(imageStorageService.getPublicUrl(url));
            }
        }
    }
}
