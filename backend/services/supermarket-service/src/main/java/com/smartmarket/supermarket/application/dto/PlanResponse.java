package com.smartmarket.supermarket.application.dto;

import java.util.UUID;

public class PlanResponse {
    private UUID id;
    private String name;
    private Double monthlyPrice;
    private Integer productLimit;
    private Integer managerLimit;
    private Integer publicationLimit;

    public PlanResponse() {}

    public PlanResponse(UUID id, String name, Double monthlyPrice, Integer productLimit, Integer managerLimit, Integer publicationLimit) {
        this.id = id;
        this.name = name;
        this.monthlyPrice = monthlyPrice;
        this.productLimit = productLimit;
        this.managerLimit = managerLimit;
        this.publicationLimit = publicationLimit;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getMonthlyPrice() { return monthlyPrice; }
    public void setMonthlyPrice(Double monthlyPrice) { this.monthlyPrice = monthlyPrice; }
    public Integer getProductLimit() { return productLimit; }
    public void setProductLimit(Integer productLimit) { this.productLimit = productLimit; }
    public Integer getManagerLimit() { return managerLimit; }
    public void setManagerLimit(Integer managerLimit) { this.managerLimit = managerLimit; }
    public Integer getPublicationLimit() { return publicationLimit; }
    public void setPublicationLimit(Integer publicationLimit) { this.publicationLimit = publicationLimit; }
}

