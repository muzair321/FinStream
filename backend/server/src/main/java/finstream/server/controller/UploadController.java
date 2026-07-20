package finstream.server.controller;

import finstream.server.model.UploadedFile;
import finstream.server.repository.UploadedFileRepository;
import finstream.server.service.EtlService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = {"http://localhost:5173", "https://finstream-app.vercel.app/"})
public class UploadController {

    private final UploadedFileRepository uploadedFileRepository;
    private final EtlService etlService;

    public UploadController(UploadedFileRepository uploadedFileRepository, EtlService etlService) {
        this.uploadedFileRepository = uploadedFileRepository;
        this.etlService = etlService;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<UploadedFile>> findAll() {
        return ResponseEntity.ok(uploadedFileRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<UploadedFile> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("sourceType") String sourceType) {

        // 1. Initial Validation
        if (!"invoices".equals(sourceType) && !"payroll".equals(sourceType) && !"opex".equals(sourceType)) {
            return ResponseEntity.badRequest().build();
        }

        // 2. Persist the record state immediately to get an ID
        UploadedFile record = new UploadedFile();
        record.setFilename(file.getOriginalFilename());
        record.setSourceType(sourceType);
        record.setUploadedAt(LocalDateTime.now());
        record.setStatus("processing");
        UploadedFile savedRecord = uploadedFileRepository.save(record);

        try {
            // 3. Hand off raw bytes or store the file temporarily.
            // We read the bytes *now* before the request closes.
            byte[] fileBytes = file.getBytes();

            // 4. Delegate to the Async Service
            etlService.processEtlAsync(savedRecord.getFileId(), fileBytes, savedRecord.getFilename(), sourceType);

            // 5. Instantly respond to the user with 202 (Accepted) and the processing metadata
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(savedRecord);

        } catch (IOException e) {
            savedRecord.setStatus("failed");
            uploadedFileRepository.save(savedRecord);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}