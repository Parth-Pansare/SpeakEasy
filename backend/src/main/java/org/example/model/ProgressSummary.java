package org.example.model;

import java.util.List;
import java.util.Map;

public class ProgressSummary {
    private final int overallScore;
    private final int englishScore;
    private final int hindiScore;
    private final int sessions;
    private final int exercisesCompleted;
    private final int practiceTimeSeconds;
    private final List<ProgressActivity> recentActivities;
    private final Map<String, Integer> exerciseScores;

    public ProgressSummary(int overallScore, int englishScore, int hindiScore,
                           int sessions, int exercisesCompleted, int practiceTimeSeconds,
                           List<ProgressActivity> recentActivities,
                           Map<String, Integer> exerciseScores) {
        this.overallScore = overallScore;
        this.englishScore = englishScore;
        this.hindiScore = hindiScore;
        this.sessions = sessions;
        this.exercisesCompleted = exercisesCompleted;
        this.practiceTimeSeconds = practiceTimeSeconds;
        this.recentActivities = recentActivities;
        this.exerciseScores = exerciseScores;
    }

    public int getOverallScore() { return overallScore; }
    public int getEnglishScore() { return englishScore; }
    public int getHindiScore() { return hindiScore; }
    public int getSessions() { return sessions; }
    public int getExercisesCompleted() { return exercisesCompleted; }
    public int getPracticeTimeSeconds() { return practiceTimeSeconds; }
    public List<ProgressActivity> getRecentActivities() { return recentActivities; }
    public Map<String, Integer> getExerciseScores() { return exerciseScores; }
}
