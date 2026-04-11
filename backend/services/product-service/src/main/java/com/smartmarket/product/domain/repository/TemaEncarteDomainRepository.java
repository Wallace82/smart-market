package com.smartmarket.product.domain.repository;

import com.smartmarket.product.domain.model.TemaEncarte;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TemaEncarteDomainRepository {
    TemaEncarte save(TemaEncarte temaEncarte);
    Optional<TemaEncarte> findById(UUID id);
    List<TemaEncarte> findAll();
    void deleteById(UUID id);
}
