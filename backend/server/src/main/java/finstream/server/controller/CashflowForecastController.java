// CashflowForecastController.java
package finstream.server.controller;

import finstream.server.model.CashflowForecast;
import finstream.server.repository.CashflowForecastRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/forecast")
@CrossOrigin(origins ={"http://localhost:5173", "https://finstream-app.vercel.app/"})
public class CashflowForecastController {

    private final CashflowForecastRepository forecastRepository;

    public CashflowForecastController(CashflowForecastRepository forecastRepository) {
        this.forecastRepository = forecastRepository;
    }

    @GetMapping
    public List<CashflowForecast> getForecast() {
        return forecastRepository.findAllByOrderByForecastDateAsc();
    }
}