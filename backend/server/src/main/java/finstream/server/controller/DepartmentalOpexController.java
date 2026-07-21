package finstream.server.controller;

import finstream.server.model.DepartmentalOpex;
import finstream.server.service.DepartmentalOpexService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/opex")
@CrossOrigin(origins = {"http://localhost:5173", "https://finstream-app.vercel.app/"})
public class DepartmentalOpexController {

    private final DepartmentalOpexService opexService;

    public DepartmentalOpexController(DepartmentalOpexService opexService) {
        this.opexService = opexService;
    }

    @GetMapping
    public List<DepartmentalOpex> getAll() {
        return opexService.getAll();
    }

    @GetMapping("/summary")
    public List<Map<String, Object>> getSummary() {
        return opexService.getSummaryByCategory();
    }
}