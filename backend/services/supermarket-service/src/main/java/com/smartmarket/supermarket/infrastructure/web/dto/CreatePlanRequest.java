package com.smartmarket.supermarket.infrastructure.web.dto;

public class CreatePlanRequest {
    private String name;
    private Double monthlyPrice;
    private Integer productLimit;
    private Integer managerLimit;
    private Integer publicationLimit;

    public CreatePlanRequest() {}

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
