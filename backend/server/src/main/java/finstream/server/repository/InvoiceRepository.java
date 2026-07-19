package finstream.server.repository;

import finstream.server.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    // JpaRepository already gives you: save(), findAll(), findById(), deleteById(), count()

    // Spring auto-generates the SQL just from the method name — no implementation needed
    List<Invoice> findByStatus(String status);
    List<Invoice> findBySubscriptionPlan(String plan);
}