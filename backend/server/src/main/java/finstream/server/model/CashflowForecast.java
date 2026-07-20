// CashflowForecast.java
package finstream.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cashflow_forecast")
@Getter
@Setter
public class CashflowForecast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "forecast_date", nullable = false)
    private LocalDate forecastDate;

    @Column(name = "projected_revenue")
    private BigDecimal projectedRevenue;

    @Column(name = "projected_burn")
    private BigDecimal projectedBurn;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;
}