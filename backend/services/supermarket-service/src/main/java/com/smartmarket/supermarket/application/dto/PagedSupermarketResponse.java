package com.smartmarket.supermarket.application.dto;

import java.util.List;

public class PagedSupermarketResponse {
    private List<SupermercadoResponse> content;
    private PageMetadata page;

    public PagedSupermarketResponse() {}

    public PagedSupermarketResponse(List<SupermercadoResponse> content, PageMetadata page) {
        this.content = content;
        this.page = page;
    }

    public List<SupermercadoResponse> getContent() { return content; }
    public void setContent(List<SupermercadoResponse> content) { this.content = content; }
    public PageMetadata getPage() { return page; }
    public void setPage(PageMetadata page) { this.page = page; }
}

