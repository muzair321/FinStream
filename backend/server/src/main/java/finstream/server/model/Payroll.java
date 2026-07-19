package finstream.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "payroll")
@Getter
@Setter
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long employeeId;

    @Column(nullable = false)
    private String department;

    @Column(name = "monthly_salary_pkr", nullable = false)
    private BigDecimal monthlySalaryPkr;

    @Column(name = "monthly_salary_usd")
    private BigDecimal monthlySalaryUsd;
}