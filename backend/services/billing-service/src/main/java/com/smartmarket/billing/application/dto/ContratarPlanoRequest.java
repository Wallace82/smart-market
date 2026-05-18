package com.smartmarket.billing.application.dto;

import com.smartmarket.billing.domain.model.CicloCobranca;
import lombok.Data;

import java.util.UUID;

@Data
public class ContratarPlanoRequest {
    private UUID supermercadoId;
    private UUID planoId;
    private CicloCobranca ciclo;
}
