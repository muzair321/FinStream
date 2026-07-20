package finstream.server.service;

import finstream.server.model.FinancialSnapshot;
import finstream.server.repository.FinancialSnapshotRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class FinancialSnapshotService {

    private final FinancialSnapshotRepository snapshotRepository;

    public FinancialSnapshotService(FinancialSnapshotRepository snapshotRepository) {
        this.snapshotRepository = snapshotRepository;
    }

    public FinancialSnapshot getLatestSnapshot() {
        return snapshotRepository.findTopByOrderByComputedAtDesc().orElse(null);
    }

    /**
     * Returns the latest snapshot plus % change vs. the snapshot from ~3 months ago,
     * for each of the 4 KPIs. If no snapshot exists from that far back, change is null.
     */
    public Map<String, Object> getLatestWithQuarterlyChange() {
        FinancialSnapshot latest = snapshotRepository.findTopByOrderByComputedAtDesc().orElse(null);

        Map<String, Object> result = new HashMap<>();
        result.put("snapshot", latest);

        if (latest == null) {
            result.put("changes", null);
            return result;
        }

        LocalDateTime cutoff = latest.getComputedAt().minusMonths(3);
        FinancialSnapshot previous = snapshotRepository
                .findTopByComputedAtLessThanEqualOrderByComputedAtDesc(cutoff)
                .orElse(null);

        if (previous == null) {
            result.put("changes", null); // not enough history yet
            return result;
        }

        Map<String, BigDecimal> changes = new HashMap<>();
        changes.put("mrr", percentChange(previous.getMrr(), latest.getMrr()));
        changes.put("burnRate", percentChange(previous.getBurnRate(), latest.getBurnRate()));
        changes.put("runwayMonths", percentChange(previous.getRunwayMonths(), latest.getRunwayMonths()));
        changes.put("budgetVariancePct", percentChange(previous.getBudgetVariancePct(), latest.getBudgetVariancePct()));

        result.put("changes", changes);
        return result;
    }

    private BigDecimal percentChange(BigDecimal oldVal, BigDecimal newVal) {
        if (oldVal == null || newVal == null || oldVal.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }
        return newVal.subtract(oldVal)
                .divide(oldVal, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }
}