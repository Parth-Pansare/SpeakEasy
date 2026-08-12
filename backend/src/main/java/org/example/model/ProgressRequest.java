package org.example.model;

public class ProgressRequest {
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

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getExerciseId() { return exerciseId; }
    public void setExerciseId(String exerciseId) { this.exerciseId = exerciseId; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getExpectedText() { return expectedText; }
    public void setExpectedText(String expectedText) { this.expectedText = expectedText; }
    public String getUserText() { return userText; }
    public void setUserText(String userText) { this.userText = userText; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public boolean isMatch() { return match; }
    public void setMatch(boolean match) { this.match = match; }
    public int getAttempts() { return attempts; }
    public void setAttempts(int attempts) { this.attempts = attempts; }
    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getAudioFileName() { return audioFileName; }
    public void setAudioFileName(String audioFileName) { this.audioFileName = audioFileName; }
}
