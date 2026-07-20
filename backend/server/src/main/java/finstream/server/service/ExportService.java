package finstream.server.service;

import finstream.server.model.*;
import finstream.server.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExportService {

    private final InvoiceRepository invoiceRepository;
    private final PayrollRepository payrollRepository;
    private final DepartmentalOpexRepository opexRepository;
    private final FinancialSnapshotRepository snapshotRepository;

    public ExportService(InvoiceRepository invoiceRepository,
                         PayrollRepository payrollRepository,
                         DepartmentalOpexRepository opexRepository,
                         FinancialSnapshotRepository snapshotRepository) {
        this.invoiceRepository = invoiceRepository;
        this.payrollRepository = payrollRepository;
        this.opexRepository = opexRepository;
        this.snapshotRepository = snapshotRepository;
    }

    public byte[] exportAllDataToExcel() throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {

            writeInvoicesSheet(workbook, invoiceRepository.findAll());
            writePayrollSheet(workbook, payrollRepository.findAll());
            writeOpexSheet(workbook, opexRepository.findAll());
            writeSnapshotSheet(workbook, snapshotRepository.findAll());

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private CellStyle headerStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        return style;
    }

    private void writeHeaderRow(Sheet sheet, CellStyle style, String... headers) {
        Row row = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(style);
        }
    }

    private void writeInvoicesSheet(Workbook workbook, List<Invoice> invoices) {
        Sheet sheet = workbook.createSheet("Invoices");
        writeHeaderRow(sheet, headerStyle(workbook), "Invoice ID", "Customer ID", "Amount (USD)", "Status", "Plan", "Created At");

        int rowNum = 1;
        for (Invoice inv : invoices) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(inv.getInvoiceId());
            row.createCell(1).setCellValue(inv.getCustomerId());
            row.createCell(2).setCellValue(inv.getAmountUsd().doubleValue());
            row.createCell(3).setCellValue(inv.getStatus());
            row.createCell(4).setCellValue(inv.getSubscriptionPlan());
            row.createCell(5).setCellValue(inv.getCreatedAt().toString());
        }
        for (int i = 0; i < 6; i++) sheet.autoSizeColumn(i);
    }

    private void writePayrollSheet(Workbook workbook, List<Payroll> payrollList) {
        Sheet sheet = workbook.createSheet("Payroll");
        writeHeaderRow(sheet, headerStyle(workbook), "Employee ID", "Department", "Salary (PKR)", "Salary (USD)");

        int rowNum = 1;
        for (Payroll p : payrollList) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(p.getEmployeeId());
            row.createCell(1).setCellValue(p.getDepartment());
            row.createCell(2).setCellValue(p.getMonthlySalaryPkr().doubleValue());
            row.createCell(3).setCellValue(p.getMonthlySalaryUsd() != null ? p.getMonthlySalaryUsd().doubleValue() : 0);
        }
        for (int i = 0; i < 4; i++) sheet.autoSizeColumn(i);
    }

    private void writeOpexSheet(Workbook workbook, List<DepartmentalOpex> opexList) {
        Sheet sheet = workbook.createSheet("Expenses");
        writeHeaderRow(sheet, headerStyle(workbook), "Date", "Category", "Allocated (USD)", "Actual (USD)");

        int rowNum = 1;
        for (DepartmentalOpex o : opexList) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(o.getExpenseDate().toString());
            row.createCell(1).setCellValue(o.getExpenseCategory());
            row.createCell(2).setCellValue(o.getAllocatedBudgetUsd().doubleValue());
            row.createCell(3).setCellValue(o.getActualSpentUsd().doubleValue());
        }
        for (int i = 0; i < 4; i++) sheet.autoSizeColumn(i);
    }

    private void writeSnapshotSheet(Workbook workbook, List<FinancialSnapshot> snapshots) {
        Sheet sheet = workbook.createSheet("Metrics Snapshots");
        writeHeaderRow(sheet, headerStyle(workbook), "MRR", "Burn Rate", "Runway (mo)", "Budget Variance %", "Computed At");

        int rowNum = 1;
        for (FinancialSnapshot s : snapshots) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(s.getMrr() != null ? s.getMrr().doubleValue() : 0);
            row.createCell(1).setCellValue(s.getBurnRate() != null ? s.getBurnRate().doubleValue() : 0);
            row.createCell(2).setCellValue(s.getRunwayMonths() != null ? s.getRunwayMonths().doubleValue() : 0);
            row.createCell(3).setCellValue(s.getBudgetVariancePct() != null ? s.getBudgetVariancePct().doubleValue() : 0);
            row.createCell(4).setCellValue(s.getComputedAt().toString());
        }
        for (int i = 0; i < 5; i++) sheet.autoSizeColumn(i);
    }
}