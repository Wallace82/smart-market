package com.smartmarket.product.application.usecase;
 
import com.smartmarket.product.application.port.out.OfertaDomainRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.util.UUID;
 
@Service
public class ExcluirOfertaUseCase {
 
    private final OfertaDomainRepository ofertaRepository;
 
    public ExcluirOfertaUseCase(OfertaDomainRepository ofertaRepository) {
        this.ofertaRepository = ofertaRepository;
    }
 
    @Transactional
    public void execute(UUID id) {
        ofertaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Oferta não encontrada para o ID: " + id));
        ofertaRepository.deleteById(id);
    }
}
