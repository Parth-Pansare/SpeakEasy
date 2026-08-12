package org.example.model;

import java.time.Instant;
import java.util.UUID;

public class ProgressActivity {
    private String id;
    private String sessionId;
    private String exerciseId;
    private String language;
    private String category;
    private String expectedText;
    private String userText;
    private int score;
    private boolean match;
    private int attempts;
    private int durationSeconds;
    private String audioFileName;
    private Instant completedAt;

    public ProgressActivity() {}

    public ProgressActivity(ProgressRequest request) {
        this.id = UUID.randomUUID().toString();
        this.sessionId = request.getSessionId();
        this.exerciseId = request.getExerciseId();
        this.language = request.getLanguage();
        this.category = request.getCategory();
        this.expectedText = request.getExpectedText();
        this.userText = request.getUserText();
        this.score = Math.max(0, Math.min(100, request.getScore()));
        this.match = request.isMatch();
        this.attempts = request.getAttempts();
        this.durationSeconds = request.getDurationSeconds();
        this.audioFileName = request.getAudioFileName();
        this.completedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getSessionId() { return sessionId; }
    public String getExerciseId() { return exerciseId; }
    public String getLanguage() { return language; }
    public String getCategory() { return category; }
    public String getExpectedText() { return expectedText; }
    public String getUserText() { return userText; }
    public int getScore() { return score; }
    public boolean isMatch() { return match; }
    public int getAttempts() { return attempts; }
    public int getDurationSeconds() { return durationSeconds; }
    public String getAudioFileName() { return audioFileName; }
    public Instant getCompletedAt() { return completedAt; }
}
