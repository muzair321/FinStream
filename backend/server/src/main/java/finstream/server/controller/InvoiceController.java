package finstream.server.controller;

import finstream.server.model.Invoice;
import finstream.server.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:5173") // your Vite dev server
public class InvoiceController {

    private final InvoiceService invoiceService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // GET http://localhost:8080/api/invoices
    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    // GET http://localhost:8080/api/invoices/status/Paid
    @GetMapping("/status/{status}")
    public List<Invoice> getByStatus(@PathVariable String status) {
        return invoiceService.getInvoicesByStatus(status);
    }

    // POST http://localhost:8080/api/invoices  (body: JSON invoice object)
    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceService.saveInvoice(invoice);
    }
}