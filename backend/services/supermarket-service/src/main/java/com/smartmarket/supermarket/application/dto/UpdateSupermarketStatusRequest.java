package com.smartmarket.supermarket.application.dto;

import com.smartmarket.supermarket.domain.model.SupermercadoStatus;

public class UpdateSupermarketStatusRequest {
    private SupermercadoStatus status;
    private String reason;

    public UpdateSupermarketStatusRequest() {}

    public SupermercadoStatus getStatus() { return status; }
    public void setStatus(SupermercadoStatus status) { this.status = status; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}

