// CashflowForecastRepository.java
package finstream.server.repository;

import finstream.server.model.CashflowForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CashflowForecastRepository extends JpaRepository<CashflowForecast, Long> {
    List<CashflowForecast> findAllByOrderByForecastDateAsc();
}