package org.example.services;

import org.example.model.AudioRecordingResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;

@Service
public class AudioRecordingService {

    private static final Path RECORDINGS_DIR = Path.of("recordings");

    public AudioRecordingResponse saveRecording(
            MultipartFile file,
            String expectedText,
            String userText) throws IOException {

        Files.createDirectories(RECORDINGS_DIR);

        String originalName = file.getOriginalFilename() == null
                ? "practice.webm"
                : file.getOriginalFilename();
        String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String fileName = Instant.now().toEpochMilli() + "-" + safeName;
        Path target = RECORDINGS_DIR.resolve(fileName).normalize();

        file.transferTo(target);

        return new AudioRecordingResponse(
                fileName,
                target.toAbsolutePath().toString(),
                expectedText,
                userText
        );
    }
}
