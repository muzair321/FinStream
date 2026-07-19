package finstream.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "invoices")

public class Invoice {
    @Id
    @Column(name = "invoice_id")
    private String invoiceId;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "amount_usd", nullable = false)
    private BigDecimal amountUsd;

    @Column(nullable = false)
    private String status;

    @Column(name = "subscription_plan", nullable = false)
    private String subscriptionPlan;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

}
