package finstream.server.service;

import finstream.server.model.DepartmentalOpex;
import finstream.server.repository.DepartmentalOpexRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DepartmentalOpexService {

    private final DepartmentalOpexRepository opexRepository;

    public DepartmentalOpexService(DepartmentalOpexRepository opexRepository) {
        this.opexRepository = opexRepository;
    }

    public List<DepartmentalOpex> getAll() {
        return opexRepository.findAll();
    }

    // Aggregated allocated vs actual, grouped by category — feeds the bar chart
    public List<Map<String, Object>> getSummaryByCategory() {
        Map<String, BigDecimal> allocatedByCategory = opexRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        DepartmentalOpex::getExpenseCategory,
                        Collectors.reducing(BigDecimal.ZERO, DepartmentalOpex::getAllocatedBudgetUsd, BigDecimal::add)
                ));

        Map<String, BigDecimal> actualByCategory = opexRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        DepartmentalOpex::getExpenseCategory,
                        Collectors.reducing(BigDecimal.ZERO, DepartmentalOpex::getActualSpentUsd, BigDecimal::add)
                ));

        return allocatedByCategory.keySet().stream()
                .map(category -> Map.<String, Object>of(
                        "category", category,
                        "allocated", allocatedByCategory.getOrDefault(category, BigDecimal.ZERO),
                        "actual", actualByCategory.getOrDefault(category, BigDecimal.ZERO)
                ))
                .collect(Collectors.toList());
    }
}