package org.example.progress;

import org.example.model.ProgressActivity;
import org.example.model.ProgressRequest;
import org.example.model.ProgressSummary;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {
    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/summary")
    public ProgressSummary summary() {
        return progressService.summary();
    }

    @PostMapping
    public ProgressActivity save(@RequestBody ProgressRequest request) {
        return progressService.add(request);
    }
}
