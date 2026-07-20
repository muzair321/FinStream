package finstream.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_snapshot")
@Getter
@Setter
public class FinancialSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal mrr;

    @Column(name = "burn_rate")
    private BigDecimal burnRate;

    @Column(name = "runway_months")
    private BigDecimal runwayMonths;

    @Column(name = "budget_variance_pct")
    private BigDecimal budgetVariancePct;

    @Column(name = "computed_at", nullable = false)
    private LocalDateTime computedAt;
}