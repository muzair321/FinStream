package finstream.server.controller;

import finstream.server.model.FinancialSnapshot;
import finstream.server.service.FinancialSnapshotService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = {"http://localhost:5173", "https://finstream-app.vercel.app/"})
public class FinancialSnapshotController {

    private final FinancialSnapshotService snapshotService;

    public FinancialSnapshotController(FinancialSnapshotService snapshotService) {
        this.snapshotService = snapshotService;
    }

    @GetMapping("/latest")
    public FinancialSnapshot getLatest() {
        return snapshotService.getLatestSnapshot();
    }
    @GetMapping("/latest-with-change")
    public Map<String, Object> getLatestWithChange() {
        return snapshotService.getLatestWithQuarterlyChange();
    }
}