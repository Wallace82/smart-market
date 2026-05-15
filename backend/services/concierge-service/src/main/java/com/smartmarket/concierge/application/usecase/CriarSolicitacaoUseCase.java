package com.smartmarket.concierge.application.usecase;

import com.smartmarket.concierge.domain.model.ConciergeStatus;
import com.smartmarket.concierge.domain.model.SolicitacaoConcierge;
import com.smartmarket.concierge.domain.service.ConciergeStorageService;
import com.smartmarket.concierge.domain.service.PriorityCalculatorService;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.AnexoConciergeEntity;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.AnexoConciergeRepository;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeEntity;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.SolicitacaoConciergeRepository;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.mapper.ConciergeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CriarSolicitacaoUseCase {

    private final SolicitacaoConciergeRepository solicitacaoRepository;
    private final AnexoConciergeRepository anexoRepository;
    private final ConciergeStorageService storageService;
    private final PriorityCalculatorService priorityCalculatorService;
    private final ConciergeMapper mapper;

    public CriarSolicitacaoUseCase(SolicitacaoConciergeRepository solicitacaoRepository,
                                  AnexoConciergeRepository anexoRepository,
                                  ConciergeStorageService storageService,
                                  PriorityCalculatorService priorityCalculatorService,
                                  ConciergeMapper mapper) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.anexoRepository = anexoRepository;
        this.storageService = storageService;
        this.priorityCalculatorService = priorityCalculatorService;
        this.mapper = mapper;
    }

    @Transactional
    public SolicitacaoConcierge execute(UUID supermercadoId, String titulo, String observacoes, 
                                       Integer complexidade, String plano,
                                       String fileName, InputStream inputStream, 
                                       String contentType, long size) {

        // 1. Upload do arquivo para o MinIO
        String fileUrl = storageService.upload(fileName, inputStream, contentType, size);

        // 2. Criar objeto de domínio para cálculo inicial
        SolicitacaoConcierge solicitacao = SolicitacaoConcierge.builder()
                .id(UUID.randomUUID())
                .supermercadoId(supermercadoId)
                .titulo(titulo)
                .status(ConciergeStatus.PENDENTE)
                .slaDefinidoHoras(3) // Default 3h conforme requisitos
                .complexidade(complexidade)
                .planoCliente(plano)
                .dataCriacao(LocalDateTime.now())
                .urlArquivoOriginal(fileUrl)
                .observacoes(observacoes)
                .build();

        // 3. Calcular Score de Prioridade inicial
        BigDecimal score = priorityCalculatorService.calcularScore(solicitacao);
        solicitacao.setPrioridadeScore(score);

        // 4. Salvar solicitação
        SolicitacaoConciergeEntity entity = mapper.toEntity(solicitacao);
        SolicitacaoConciergeEntity savedEntity = solicitacaoRepository.save(entity);

        // 5. Salvar metadados do anexo
        AnexoConciergeEntity anexo = AnexoConciergeEntity.builder()
                .id(UUID.randomUUID())
                .solicitacao(savedEntity)
                .nomeArquivo(fileName)
                .urlMinio(fileUrl)
                .tipoMime(contentType)
                .tamanhoBytes(size)
                .build();
        anexoRepository.save(anexo);

        return mapper.toDomain(savedEntity);
    }
}
