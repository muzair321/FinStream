package finstream.server.service;

import finstream.server.model.UploadedFile;
import finstream.server.repository.UploadedFileRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

@Service
public class EtlService {

    private final UploadedFileRepository uploadedFileRepository;

    public EtlService(UploadedFileRepository uploadedFileRepository) {
        this.uploadedFileRepository = uploadedFileRepository;
    }

    @Async
    public void processEtlAsync(Long fileId, byte[] fileBytes, String filename, String sourceType) {
        UploadedFile record = uploadedFileRepository.findById(fileId).orElseThrow();
        Path tempFile = null;

        try {
            // 1. Create a unique temporary file on the OS storage layer to pass to Python
            String extension = filename.endsWith(".xlsx") ? ".xlsx" : ".csv";
            tempFile = Files.createTempFile("finstream_", extension);
            Files.write(tempFile, fileBytes, StandardOpenOption.WRITE);

            System.out.println("[ETL] Saved temporary upload file to: " + tempFile.toAbsolutePath());

            // 2. Fix: Pass the absolute path string and source type to the execution engine
            runEtlPipeline(tempFile.toAbsolutePath().toString(), sourceType);

            // 3. Complete Lifecycle Update
            record.setStatus("processed");
            uploadedFileRepository.save(record);
            System.out.println("[ETL Success] Finished processing " + filename);

        } catch (Exception e) {
            record.setStatus("failed");
            uploadedFileRepository.save(record);
            System.err.println("[ETL Failure] Processing failed for " + filename + ": " + e.getMessage());
        } finally {
            // 4. Housekeeping: Delete the temporary file from the disk so you don't accumulate junk files
            if (tempFile != null) {
                try {
                    Files.deleteIfExists(tempFile);
                } catch (Exception ex) {
                    System.err.println("[WARN] Failed to delete temp file: " + ex.getMessage());
                }
            }
        }
    }

    private void runEtlPipeline(String savedFilePath, String sourceType) throws Exception {
        ProcessBuilder pb = new ProcessBuilder(
                "C:/Users/muzai/AppData/Local/Programs/Python/Python314/python.exe",
                "C:/Users/muzai/OneDrive/Documents/Study/FinStream/FinStream/etl-python/etl_pipeline.py",
                savedFilePath,  // sys.argv[1] in Python script
                sourceType      // sys.argv[2] in Python script
        );

        // Ensure python utilizes UTF-8 to prevent any emoji/unicode terminal crash warnings
        pb.environment().put("PYTHONIOENCODING", "UTF-8");
        pb.redirectErrorStream(true);
        Process process = pb.start();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), java.nio.charset.StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[ETL Script] " + line);
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Python process exited with failure code: " + exitCode);
        }
    }
}