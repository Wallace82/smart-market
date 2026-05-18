package com.smartmarket.billing.infrastructure.persistence.repository;

import com.smartmarket.billing.infrastructure.persistence.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, UUID> {

    @Query("SELECT SUM(p.amount) FROM PaymentEntity p WHERE p.status = 'paid'")
    BigDecimal sumTotalRevenue();

    @Query("SELECT SUM(p.amount) FROM PaymentEntity p WHERE p.status = 'paid' AND p.paymentDate >= :since")
    BigDecimal sumRevenueSince(@Param("since") OffsetDateTime since);

    long countByStatus(String status);
}
