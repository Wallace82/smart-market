package com.smartmarket.concierge.application.usecase;

import com.smartmarket.concierge.domain.model.ConciergeStatus;
import com.smartmarket.concierge.domain.model.SolicitacaoConcierge;
import com.smartmarket.concierge.domain.service.ConciergeStorageService;
import com.smartmarket.concierge.domain.service.PriorityCalculatorService;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.*;
import com.smartmarket.concierge.infrastructure.adapter.out.persistence.mapper.ConciergeMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReplicarSolicitacaoUseCaseTest {

    @Mock
    private SolicitacaoConciergeRepository solicitacaoRepository;

    @Mock
    private AnexoConciergeRepository anexoRepository;

    @Mock
    private AuditoriaConciergeRepository auditoriaRepository;

    @Mock
    private ConciergeStorageService storageService;

    @Mock
    private PriorityCalculatorService priorityCalculatorService;

    @Spy
    private ConciergeMapper mapper = new ConciergeMapper();

    @InjectMocks
    private ReplicarSolicitacaoUseCase useCase;

    private UUID solicitacaoId;
    private UUID gestorId;
    private SolicitacaoConciergeEntity solicitacaoEntity;

    @BeforeEach
    void setUp() {
        solicitacaoId = UUID.randomUUID();
        gestorId = UUID.randomUUID();

        solicitacaoEntity = SolicitacaoConciergeEntity.builder()
                .id(solicitacaoId)
                .supermercadoId(UUID.randomUUID())
                .atendenteId(UUID.randomUUID())
                .titulo("Campanha Teste")
                .status(ConciergeStatus.REJEITADO)
                .slaDefinidoHoras(24)
                .prioridadeScore(BigDecimal.ZERO)
                .complexidade(1)
                .planoCliente("PREMIUM")
                .dataCriacao(LocalDateTime.now().minusDays(1))
                .lockAt(LocalDateTime.now())
                .observacoes("Rejeitado por erro de digitação.")
                .encarteId(UUID.randomUUID())
                .build();
    }

    @Test
    void execute_WhenStatusIsRejeitadoWithoutNewFile_ShouldTransitionToPendenteAndRecalculatePriority() {
        // Arrange
        when(solicitacaoRepository.findById(solicitacaoId)).thenReturn(Optional.of(solicitacaoEntity));
        when(priorityCalculatorService.calcularScore(any(SolicitacaoConcierge.class))).thenReturn(BigDecimal.valueOf(85.50));
        when(solicitacaoRepository.save(any(SolicitacaoConciergeEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        SolicitacaoConcierge result = useCase.execute(
                solicitacaoId,
                gestorId,
                "Ajustei os itens conforme solicitado.",
                null, null, null, null
        );

        // Assert
        assertNotNull(result);
        assertEquals(ConciergeStatus.PENDENTE, result.getStatus());
        assertNull(result.getAtendenteId());
        assertNull(result.getLockAt());
        assertTrue(result.getObservacoes().contains("Rejeitado por erro de digitação."));
        assertTrue(result.getObservacoes().contains("[Gestor - Réplica]: Ajustei os itens conforme solicitado."));
        assertEquals(BigDecimal.valueOf(85.50), result.getPrioridadeScore());

        // Verify repository interaction
        verify(solicitacaoRepository).save(solicitacaoEntity);
        verify(anexoRepository, never()).save(any());

        // Verify audit log
        ArgumentCaptor<AuditoriaConciergeEntity> auditCaptor = ArgumentCaptor.forClass(AuditoriaConciergeEntity.class);
        verify(auditoriaRepository).save(auditCaptor.capture());
        AuditoriaConciergeEntity audit = auditCaptor.getValue();
        assertNotNull(audit.getId());
        assertEquals(solicitacaoId, audit.getSolicitacaoId());
        assertEquals(gestorId, audit.getUsuarioId());
        assertEquals("REPLICA_GESTOR", audit.getAcao());
        assertEquals("REJEITADO", audit.getStatusDe());
        assertEquals("PENDENTE", audit.getStatusPara());
        assertTrue(audit.getDetalhes().contains("Ajustei os itens conforme solicitado."));
    }

    @Test
    void execute_WhenStatusIsRejeitadoWithNewFile_ShouldUploadFileSaveAnexoAndTransition() {
        // Arrange
        String fileName = "corrected_tabloid.pdf";
        InputStream inputStream = new ByteArrayInputStream("dummy data".getBytes());
        String contentType = "application/pdf";
        Long size = 10L;
        String uploadedUrl = "http://storage/corrected_tabloid.pdf";

        when(solicitacaoRepository.findById(solicitacaoId)).thenReturn(Optional.of(solicitacaoEntity));
        when(storageService.upload(fileName, inputStream, contentType, size)).thenReturn(uploadedUrl);
        when(priorityCalculatorService.calcularScore(any(SolicitacaoConcierge.class))).thenReturn(BigDecimal.valueOf(90.00));
        when(solicitacaoRepository.save(any(SolicitacaoConciergeEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        SolicitacaoConcierge result = useCase.execute(
                solicitacaoId,
                gestorId,
                "Enviei o PDF corrigido.",
                fileName, inputStream, contentType, size
        );

        // Assert
        assertNotNull(result);
        assertEquals(ConciergeStatus.PENDENTE, result.getStatus());
        assertEquals(uploadedUrl, result.getUrlArquivoOriginal());

        // Verify file upload and anexo saving
        verify(storageService).upload(fileName, inputStream, contentType, size);
        
        ArgumentCaptor<AnexoConciergeEntity> anexoCaptor = ArgumentCaptor.forClass(AnexoConciergeEntity.class);
        verify(anexoRepository).save(anexoCaptor.capture());
        AnexoConciergeEntity anexo = anexoCaptor.getValue();
        assertNotNull(anexo.getId());
        assertEquals(solicitacaoEntity, anexo.getSolicitacao());
        assertEquals(fileName, anexo.getNomeArquivo());
        assertEquals(uploadedUrl, anexo.getUrlMinio());
        assertEquals(contentType, anexo.getTipoMime());
        assertEquals(size, anexo.getTamanhoBytes());

        verify(solicitacaoRepository).save(solicitacaoEntity);
        verify(auditoriaRepository).save(any(AuditoriaConciergeEntity.class));
    }

    @Test
    void execute_WhenStatusIsNotRejeitado_ShouldThrowIllegalStateException() {
        // Arrange
        solicitacaoEntity.setStatus(ConciergeStatus.PENDENTE);
        when(solicitacaoRepository.findById(solicitacaoId)).thenReturn(Optional.of(solicitacaoEntity));

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            useCase.execute(
                    solicitacaoId,
                    gestorId,
                    "Tentando replicar chamado pendente",
                    null, null, null, null
            );
        });
        assertEquals("Apenas solicitações rejeitadas podem receber réplicas.", exception.getMessage());
        verify(solicitacaoRepository, never()).save(any());
        verify(auditoriaRepository, never()).save(any());
    }

    @Test
    void execute_WhenSolicitacaoNotFound_ShouldThrowIllegalArgumentException() {
        // Arrange
        when(solicitacaoRepository.findById(solicitacaoId)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            useCase.execute(
                    solicitacaoId,
                    gestorId,
                    "Tentando replicar chamado inexistente",
                    null, null, null, null
            );
        });
        assertTrue(exception.getMessage().contains("Solicitação não encontrada"));
        verify(solicitacaoRepository, never()).save(any());
        verify(auditoriaRepository, never()).save(any());
    }
}
