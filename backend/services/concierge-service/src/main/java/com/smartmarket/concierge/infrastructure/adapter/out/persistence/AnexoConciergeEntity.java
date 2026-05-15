package com.smartmarket.concierge.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "anexos_concierge")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnexoConciergeEntity {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private SolicitacaoConciergeEntity solicitacao;

    @Column(name = "nome_arquivo", nullable = false)
    private String nomeArquivo;

    @Column(name = "url_minio", nullable = false, length = 1024)
    private String urlMinio;

    @Column(name = "tipo_mime")
    private String tipoMime;

    @Column(name = "tamanho_bytes")
    private Long tamanhoBytes;

    @CreationTimestamp
    @Column(name = "data_upload", nullable = false, updatable = false)
    private LocalDateTime dataUpload;
}
