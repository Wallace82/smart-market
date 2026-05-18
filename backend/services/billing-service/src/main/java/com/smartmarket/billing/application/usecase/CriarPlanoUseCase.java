package com.smartmarket.billing.application.usecase;

import com.smartmarket.billing.application.dto.CriarPlanoRequest;
import com.smartmarket.billing.domain.model.Plano;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.PlanoEntity;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.PlanoRepository;
import com.smartmarket.billing.infrastructure.adapter.out.persistence.mapper.BillingMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CriarPlanoUseCase {

    private final PlanoRepository planoRepository;
    private final BillingMapper mapper;

    @Transactional
    public Plano execute(CriarPlanoRequest request) {
        if (planoRepository.findByNome(request.getNome()).isPresent()) {
            throw new IllegalArgumentException("Já existe um plano com este nome.");
        }

        PlanoEntity entity = new PlanoEntity();
        entity.setId(UUID.randomUUID());
        entity.setNome(request.getNome());
        entity.setLimiteOfertasMensais(request.getLimiteOfertasMensais());
        entity.setLimiteEncartesAtivos(request.getLimiteEncartesAtivos());
        entity.setRaioAtuacaoKm(request.getRaioAtuacaoKm());
        entity.setLimiteNotificacoesMensais(request.getLimiteNotificacoesMensais());
        entity.setPossuiConcierge(request.isPossuiConcierge());
        entity.setConciergeUploadsMensais(request.getConciergeUploadsMensais());
        entity.setSlaAtendimentoHoras(request.getSlaAtendimentoHoras());
        entity.setPrioridadeFila(request.getPrioridadeFila());
        entity.setPrecoMensal(request.getPrecoMensal());
        entity.setPrecoSemestral(request.getPrecoSemestral());
        entity.setPrecoAnual(request.getPrecoAnual());
        entity.setAtivo(request.isAtivo());

        return mapper.toDomain(planoRepository.save(entity));
    }
}
