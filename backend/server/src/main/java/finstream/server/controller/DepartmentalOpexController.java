package finstream.server.controller;

import finstream.server.model.DepartmentalOpex;
import finstream.server.service.DepartmentalOpexService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/opex")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentalOpexController {

    private final DepartmentalOpexService opexService;

    public DepartmentalOpexController(DepartmentalOpexService opexService) {
        this.opexService = opexService;
    }

    @GetMapping
    public List<DepartmentalOpex> getAll() {
        return opexService.getAll();
    }
}