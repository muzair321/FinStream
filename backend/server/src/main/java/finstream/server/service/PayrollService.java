package finstream.server.service;

import finstream.server.model.Payroll;
import finstream.server.repository.PayrollRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;

    public PayrollService(PayrollRepository payrollRepository) {
        this.payrollRepository = payrollRepository;
    }

    public List<Payroll> getAllPayroll() {
        return payrollRepository.findAll();
    }

    public List<Payroll> saveAll(List<Payroll> payrollList) {
        return payrollRepository.saveAll(payrollList);
    }

    // Aggregation for your Payroll tab's bar chart — department totals, not individual salaries
    public Map<String, java.math.BigDecimal> getTotalCostByDepartment() {
        return payrollRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        Payroll::getDepartment,
                        Collectors.reducing(java.math.BigDecimal.ZERO, Payroll::getMonthlySalaryUsd, java.math.BigDecimal::add)
                ));
    }
}