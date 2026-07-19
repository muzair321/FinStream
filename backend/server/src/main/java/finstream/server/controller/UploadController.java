package finstream.server.controller;

import finstream.server.model.UploadedFile;
import finstream.server.repository.UploadedFileRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = {"http://localhost:5173", "https://finstream-app.vercel.app/"})
public class UploadController {

    private final UploadedFileRepository uploadedFileRepository;

    public UploadController(UploadedFileRepository uploadedFileRepository) {
        this.uploadedFileRepository = uploadedFileRepository;
    }


    @GetMapping
    public ResponseEntity<List<UploadedFile>> findAll() {
        return ResponseEntity.ok(uploadedFileRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("sourceType") String sourceType) {

        UploadedFile record = new UploadedFile();
        record.setFilename(file.getOriginalFilename());
        record.setSourceType(sourceType);
        record.setUploadedAt(LocalDateTime.now());
        record.setStatus("processing");
        uploadedFileRepository.save(record); // insert as "processing" first

        try {
            String result = switch (sourceType) {
                case "invoices" -> "Invoices processed: " + file.getOriginalFilename();
                case "payroll" -> "Payroll processed: " + file.getOriginalFilename();
                case "opex" -> "Opex processed: " + file.getOriginalFilename();
                default -> throw new IllegalArgumentException("Unknown source type: " + sourceType);
            };

            record.setStatus("processed");
            uploadedFileRepository.save(record); // same object, now has an ID → this becomes an UPDATE

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            record.setStatus("failed");
            uploadedFileRepository.save(record); // UPDATE again, marks it failed
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }
}