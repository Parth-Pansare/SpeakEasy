package org.example.controller;

import org.example.model.TextComparisonRequest;
import org.example.model.TextComparisonResponse;
import org.example.model.AudioRecordingResponse;
import org.example.services.AudioComparisonService;
import org.example.services.AudioRecordingService;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/audio")
@CrossOrigin(origins = "*")
public class AudioController {

    private final AudioComparisonService audioComparisonService;

    private final AudioRecordingService audioRecordingService;

    public AudioController(
            AudioComparisonService audioComparisonService,
            AudioRecordingService audioRecordingService) {

        this.audioComparisonService =
                audioComparisonService;
        this.audioRecordingService =
                audioRecordingService;
    }

    @GetMapping("/test")
    public String testApi() {

        return "SpeakEasy Audio API is working!";
    }

    @PostMapping("/compare")
    public TextComparisonResponse compareText(
            @RequestBody TextComparisonRequest request) {

        return audioComparisonService.compareText(request);
    }

    @PostMapping("/recordings")
    public AudioRecordingResponse saveRecording(
            @RequestParam("file") MultipartFile file,
            @RequestParam("expectedText") String expectedText,
            @RequestParam("userText") String userText) throws IOException {

        return audioRecordingService.saveRecording(
                file,
                expectedText,
                userText
        );
    }
}
