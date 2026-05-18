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
    private final com.smartmarket.concierge.infrastructure.adapter.out.client.BillingClient billingClient;
    private final ConciergeMapper mapper;

    public CriarSolicitacaoUseCase(SolicitacaoConciergeRepository solicitacaoRepository,
                                  AnexoConciergeRepository anexoRepository,
                                  ConciergeStorageService storageService,
                                  PriorityCalculatorService priorityCalculatorService,
                                  com.smartmarket.concierge.infrastructure.adapter.out.client.BillingClient billingClient,
                                  ConciergeMapper mapper) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.anexoRepository = anexoRepository;
        this.storageService = storageService;
        this.priorityCalculatorService = priorityCalculatorService;
        this.billingClient = billingClient;
        this.mapper = mapper;
    }

    @Transactional
    public SolicitacaoConcierge execute(UUID supermercadoId, String titulo, String observacoes, 
                                       Integer complexidade,
                                       String fileName, InputStream inputStream, 
                                       String contentType, long size) {

        // 1. Validar limites do plano via billing-service
        var assinatura = billingClient.getAssinaturaBySupermercadoId(supermercadoId);
        if (assinatura == null || !"ATIVA".equals(assinatura.getStatus())) {
            throw new RuntimeException("Supermercado não possui assinatura ativa.");
        }

        var plano = assinatura.getPlano();
        if (!plano.isPossuiConcierge()) {
            throw new RuntimeException("Seu plano (" + plano.getNome() + ") não inclui acesso ao Concierge. Faça um upgrade para utilizar este recurso.");
        }

        // Se o plano tiver limite de uploads (ex: plano PRO tem 2/mês)
        if (plano.getConciergeUploadsMensais() != null && plano.getConciergeUploadsMensais() > 0) {
            LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            long jaUtilizado = solicitacaoRepository.countBySupermercadoIdAndDataCriacaoAfter(supermercadoId, inicioMes);
            
            if (jaUtilizado >= plano.getConciergeUploadsMensais()) {
                throw new RuntimeException("Limite mensal de solicitações de Concierge atingido para o plano " + plano.getNome() + " (" + plano.getConciergeUploadsMensais() + ").");
            }
        }

        // 2. Upload do arquivo para o MinIO
        String fileUrl = storageService.upload(fileName, inputStream, contentType, size);

        // 3. Criar objeto de domínio para cálculo inicial
        SolicitacaoConcierge solicitacao = SolicitacaoConcierge.builder()
                .id(UUID.randomUUID())
                .supermercadoId(supermercadoId)
                .titulo(titulo)
                .status(ConciergeStatus.PENDENTE)
                .slaDefinidoHoras(plano.getSlaAtendimentoHoras() != null ? plano.getSlaAtendimentoHoras() : 3)
                .complexidade(complexidade)
                .planoCliente(plano.getNome())
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
