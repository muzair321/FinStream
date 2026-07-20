package finstream.server.service;

import finstream.server.model.FinancialSnapshot;
import finstream.server.repository.FinancialSnapshotRepository;
import org.springframework.stereotype.Service;

@Service
public class FinancialSnapshotService {

    private final FinancialSnapshotRepository snapshotRepository;

    public FinancialSnapshotService(FinancialSnapshotRepository snapshotRepository) {
        this.snapshotRepository = snapshotRepository;
    }

    public FinancialSnapshot getLatestSnapshot() {
        return snapshotRepository.findTopByOrderByComputedAtDesc()
                .orElse(null); // frontend handles a null snapshot gracefully
    }
}