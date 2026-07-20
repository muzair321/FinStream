package finstream.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "departmental_opex")
@Getter
@Setter
public class DepartmentalOpex {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @Column(name = "expense_category", nullable = false)
    private String expenseCategory;

    @Column(name = "allocated_budget_usd", nullable = false)
    private BigDecimal allocatedBudgetUsd;

    @Column(name = "actual_spent_usd", nullable = false)
    private BigDecimal actualSpentUsd;
}