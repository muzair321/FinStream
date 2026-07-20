package finstream.server.controller;

import finstream.server.model.FinancialSnapshot;
import finstream.server.service.FinancialSnapshotService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = "http://localhost:5173")
public class FinancialSnapshotController {

    private final FinancialSnapshotService snapshotService;

    public FinancialSnapshotController(FinancialSnapshotService snapshotService) {
        this.snapshotService = snapshotService;
    }

    @GetMapping("/latest")
    public FinancialSnapshot getLatest() {
        return snapshotService.getLatestSnapshot();
    }
}