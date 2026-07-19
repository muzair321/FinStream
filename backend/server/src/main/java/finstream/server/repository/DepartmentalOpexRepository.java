package finstream.server.repository;

import finstream.server.model.DepartmentalOpex;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartmentalOpexRepository extends JpaRepository<DepartmentalOpex, Long> {
    List<DepartmentalOpex> findByExpenseCategory(String category);
}