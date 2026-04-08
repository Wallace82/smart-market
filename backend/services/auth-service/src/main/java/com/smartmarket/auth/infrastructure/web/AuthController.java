package com.smartmarket.auth.infrastructure.web;

import com.smartmarket.auth.application.dto.JwtResponseDTO;
import com.smartmarket.auth.application.dto.LoginRequestDTO;
import com.smartmarket.auth.application.dto.RegistroUsuarioRequestDTO;
import com.smartmarket.auth.application.usecase.LoginUseCase;
import com.smartmarket.auth.application.usecase.RegistrarUsuarioUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegistrarUsuarioUseCase registrarUsuarioUseCase;

    public AuthController(LoginUseCase loginUseCase, RegistrarUsuarioUseCase registrarUsuarioUseCase) {
        this.loginUseCase = loginUseCase;
        this.registrarUsuarioUseCase = registrarUsuarioUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> authenticateUser(@RequestBody LoginRequestDTO loginRequest) {
        JwtResponseDTO jwtResponse = loginUseCase.execute(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistroUsuarioRequestDTO signUpRequest) {
        try {
            registrarUsuarioUseCase.execute(signUpRequest);
            return ResponseEntity.ok().body("Usuário registrado com sucesso!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
