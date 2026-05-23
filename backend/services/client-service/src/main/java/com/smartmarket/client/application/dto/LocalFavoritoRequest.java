package com.smartmarket.client.application.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LocalFavoritoRequest {

    @NotBlank(message = "O apelido é obrigatório")
    @Size(max = 100, message = "O apelido deve ter no máximo 100 caracteres")
    private String apelido;

    @NotBlank(message = "O endereço é obrigatório")
    @Size(max = 512, message = "O endereço deve ter no máximo 512 caracteres")
    private String endereco;

    private String cep;
    private String bairro;
    private String cidade;
    private String estado;
    private Double latitude;
    private Double longitude;

    @Min(value = 1, message = "O raio mínimo é 1 km")
    @Max(value = 100, message = "O raio máximo é 100 km")
    private Integer raioKm = 10;

    public String getApelido() { return apelido; }
    public void setApelido(String apelido) { this.apelido = apelido; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getRaioKm() { return raioKm; }
    public void setRaioKm(Integer raioKm) { this.raioKm = raioKm; }
}
