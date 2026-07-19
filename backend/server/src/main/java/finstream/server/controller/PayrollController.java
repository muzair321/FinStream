package finstream.server.controller;

import finstream.server.model.Payroll;
import finstream.server.service.PayrollService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "http://localhost:5173")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @GetMapping
    public List<Payroll> getAll() {
        return payrollService.getAllPayroll();
    }

    @GetMapping("/by-department")
    public Map<String, java.math.BigDecimal> getByDepartment() {
        return payrollService.getTotalCostByDepartment();
    }
}