package com.smartmarket.product.application.usecase;

import com.smartmarket.product.domain.model.OfertaSupermercado;
import com.smartmarket.product.application.port.out.OfertaDomainRepository;
import com.smartmarket.product.infrastructure.adapter.out.storage.ImageStorageService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ListarOfertasUseCase {

    private final OfertaDomainRepository ofertaRepository;
    private final ImageStorageService imageStorageService;

    public ListarOfertasUseCase(OfertaDomainRepository ofertaRepository, ImageStorageService imageStorageService) {
        this.ofertaRepository = ofertaRepository;
        this.imageStorageService = imageStorageService;
    }

    public List<OfertaSupermercado> execute(UUID supermercadoId) {
        List<OfertaSupermercado> ofertas = ofertaRepository.findBySupermercadoId(supermercadoId);
        ofertas.forEach(this::enriquecerUrlImagem);
        return ofertas;
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
