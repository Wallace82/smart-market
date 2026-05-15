package com.smartmarket.auth.infrastructure.adapter.in.web;

import com.smartmarket.auth.application.dto.UsuarioResponseDTO;
import com.smartmarket.auth.application.usecase.ListarUsuariosUseCase;
import com.smartmarket.auth.application.usecase.AlterarStatusUsuarioUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final ListarUsuariosUseCase listarUsuariosUseCase;
    private final AlterarStatusUsuarioUseCase alterarStatusUsuarioUseCase;

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        return ResponseEntity.ok(listarUsuariosUseCase.execute());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alterarStatus(@PathVariable UUID id, @RequestBody StatusRequest statusRequest) {
        alterarStatusUsuarioUseCase.execute(id, statusRequest.getStatus());
        return ResponseEntity.noContent().build();
    }

    public static class StatusRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
