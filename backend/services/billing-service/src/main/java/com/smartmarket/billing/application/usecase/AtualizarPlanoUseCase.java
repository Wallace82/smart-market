package com.smartmarket.billing.application.usecase;

import com.smartmarket.billing.application.dto.AtualizarPlanoRequest;
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
public class AtualizarPlanoUseCase {

    private final PlanoRepository planoRepository;
    private final BillingMapper mapper;

    @Transactional
    public Plano execute(UUID id, AtualizarPlanoRequest request) {
        PlanoEntity entity = planoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plano não encontrado"));

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
