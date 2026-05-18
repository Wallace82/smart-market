package com.smartmarket.auth.infrastructure.adapter.in.web;

import com.smartmarket.auth.application.dto.AuthTokenResponseDTO;
import com.smartmarket.auth.application.dto.LoginRequestDTO;
import com.smartmarket.auth.application.dto.RefreshTokenRequestDTO;
import com.smartmarket.auth.application.dto.RegistroUsuarioRequestDTO;
import com.smartmarket.auth.application.usecase.LoginUseCase;
import com.smartmarket.auth.application.usecase.RefreshTokenUseCase;
import com.smartmarket.auth.application.usecase.RegistrarUsuarioUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticação", description = "Endpoints para gerenciamento de identidade e controle de acesso (Login, Registro, Refresh Token)")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegistrarUsuarioUseCase registrarUsuarioUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;

    public AuthController(LoginUseCase loginUseCase, 
                          RegistrarUsuarioUseCase registrarUsuarioUseCase,
                          RefreshTokenUseCase refreshTokenUseCase) {
        this.loginUseCase = loginUseCase;
        this.registrarUsuarioUseCase = registrarUsuarioUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
    }

    @PostMapping("/login")
    @Operation(summary = "Autenticar Usuário", description = "Autentica um usuário usando email e senha, retornando os tokens JWT e Refresh Token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    })
    public ResponseEntity<AuthTokenResponseDTO> authenticateUser(@RequestBody LoginRequestDTO loginRequest) {
        log.info("Tentativa de login para o usuário: {}", loginRequest.getEmail());
        AuthTokenResponseDTO jwtResponse = loginUseCase.execute(loginRequest);
        log.info("Login bem-sucedido para o usuário: {}", loginRequest.getEmail());
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Atualizar Token", description = "Atualiza o Access Token utilizando um Refresh Token válido")
    public ResponseEntity<AuthTokenResponseDTO> refreshToken(@RequestBody RefreshTokenRequestDTO request) {
        log.info("Recebida requisição para refresh token");
        AuthTokenResponseDTO response = refreshTokenUseCase.execute(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Cria um usuário (ADMIN ou GESTOR). Somente ADMIN pode executar esta operação (RF-01.1, MVP).
     * Auto-cadastro público não está no escopo do MVP — ver REQUIREMENTS.md seção 12 (ROLE_CLIENTE pós-MVP).
     */
    @PostMapping("/users")
    @Operation(summary = "Criar Usuário (Admin)", description = "Cria uma conta com papel ADMIN ou GESTOR. Requer autenticação ADMIN.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso"),
            @ApiResponse(responseCode = "409", description = "E-mail já cadastrado"),
            @ApiResponse(responseCode = "400", description = "Papel inválido ou dados incorretos")
    })
    public ResponseEntity<?> criarUsuario(@RequestBody RegistroUsuarioRequestDTO request) {
        log.info("Admin criando novo usuário: {} com papel: {}", request.getEmail(), request.getPapel());
        try {
            registrarUsuarioUseCase.execute(request);
            log.info("Usuário criado com sucesso: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuário criado com sucesso.");
        } catch (IllegalArgumentException e) {
            log.warn("Erro de validação ao criar usuário {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            log.error("Erro interno ao criar usuário {}: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}


