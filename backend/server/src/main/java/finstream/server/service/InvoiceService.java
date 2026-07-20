package finstream.server.service;

import finstream.server.model.Invoice;
import finstream.server.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    @Autowired
    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public List<Invoice> getInvoicesByStatus(String status) {
        return invoiceRepository.findByStatus(status);
    }

    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> saveAllInvoices(List<Invoice> invoices) {
        return invoiceRepository.saveAll(invoices);
    }

    public Map<String, Map<String, BigDecimal>> getMrrByTierAndMonth() {
        Map<String, Map<String, BigDecimal>> result = new TreeMap<>(); // TreeMap keeps months sorted

        List<Invoice> paidInvoices = invoiceRepository.findByStatus("Paid");

        for (Invoice invoice : paidInvoices) {
            String month = invoice.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM"));
            String plan = invoice.getSubscriptionPlan();

            result.putIfAbsent(month, new HashMap<>());
            Map<String, BigDecimal> planTotals = result.get(month);
            planTotals.merge(plan, invoice.getAmountUsd(), BigDecimal::add);
        }

        return result;
    }
    public Map<String, BigDecimal> getRevenueTrendByMonth() {
        Map<String, BigDecimal> result = new TreeMap<>();

        List<Invoice> paidInvoices = invoiceRepository.findByStatus("Paid");

        for (Invoice invoice : paidInvoices) {
            String month = invoice.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM"));
            result.merge(month, invoice.getAmountUsd(), BigDecimal::add);
        }

        return result;
    }
}