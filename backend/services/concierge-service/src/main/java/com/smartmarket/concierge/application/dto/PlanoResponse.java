package com.smartmarket.concierge.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanoResponse {
    private String nome;
    private boolean possuiConcierge;
    private Integer conciergeUploadsMensais;
    private Integer slaAtendimentoHoras;
}
