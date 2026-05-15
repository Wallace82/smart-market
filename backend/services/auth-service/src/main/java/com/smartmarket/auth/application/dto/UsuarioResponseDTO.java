package com.smartmarket.auth.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponseDTO {
    private UUID id;
    private String nome;
    private String email;
    private String role;
    private String status;
    private String ultimoAcesso;
}
