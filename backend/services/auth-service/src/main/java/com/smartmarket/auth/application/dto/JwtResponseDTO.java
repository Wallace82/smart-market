package com.smartmarket.auth.application.dto;

import java.util.List;
import java.util.UUID;

public class JwtResponseDTO {
    private String token;
    private String type = "Bearer";
    private UUID id;
    private String email;
    private List<String> roles;

    public JwtResponseDTO(String token, UUID id, String email, List<String> roles) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
