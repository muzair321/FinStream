package finstream.server.repository;

import finstream.server.model.FinancialSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FinancialSnapshotRepository extends JpaRepository<FinancialSnapshot, Long> {
    Optional<FinancialSnapshot> findTopByOrderByComputedAtDesc();
}