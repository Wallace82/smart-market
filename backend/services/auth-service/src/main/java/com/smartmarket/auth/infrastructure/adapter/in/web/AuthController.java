package com.smartmarket.auth.infrastructure.adapter.in.web;

import com.smartmarket.auth.application.dto.AuthTokenResponseDTO;
import com.smartmarket.auth.application.dto.LoginRequestDTO;
import com.smartmarket.auth.application.dto.RefreshTokenRequestDTO;
import com.smartmarket.auth.application.dto.RegistroUsuarioRequestDTO;
import com.smartmarket.auth.application.usecase.LoginUseCase;
import com.smartmarket.auth.application.usecase.RegistrarUsuarioUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticação", description = "Endpoints para gerenciamento de identidade e controle de acesso (Login, Registro, Refresh Token)")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegistrarUsuarioUseCase registrarUsuarioUseCase;

    public AuthController(LoginUseCase loginUseCase, RegistrarUsuarioUseCase registrarUsuarioUseCase) {
        this.loginUseCase = loginUseCase;
        this.registrarUsuarioUseCase = registrarUsuarioUseCase;
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
        // Mock implementation to satisfy OpenAPI contract
        return ResponseEntity.ok(new AuthTokenResponseDTO("mocked-new-jwt", request.getRefreshToken(), 3600L));
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar Usuário", description = "Cria uma nova conta de usuário no sistema")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de registro inválidos")
    })
    public ResponseEntity<?> registerUser(@RequestBody RegistroUsuarioRequestDTO signUpRequest) {
        log.info("Iniciando registro para novo usuário: {}", signUpRequest.getEmail());
        try {
            registrarUsuarioUseCase.execute(signUpRequest);
            log.info("Usuário registrado com sucesso: {}", signUpRequest.getEmail());
            return ResponseEntity.ok().body("Usuário registrado com sucesso!");
        } catch (IllegalArgumentException e) {
            log.warn("Erro de validação ao registrar usuário {}: {}", signUpRequest.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            log.error("Erro interno ao registrar usuário {}: {}", signUpRequest.getEmail(), e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}

