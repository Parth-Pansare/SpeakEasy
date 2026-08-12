package org.example.progress;

import org.example.model.ProgressActivity;
import org.example.model.ProgressRequest;
import org.example.model.ProgressSummary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProgressService {
    private final List<ProgressActivity> activities = new ArrayList<>();

    public synchronized ProgressActivity add(ProgressRequest request) {
        ProgressActivity activity = new ProgressActivity(request);
        activities.add(activity);
        return activity;
    }

    public synchronized ProgressSummary summary() {
        if (activities.isEmpty()) {
            return new ProgressSummary(0, 0, 0, 0, 0, 0, List.of(), Map.of());
        }

        double overall = activities.stream().mapToInt(ProgressActivity::getScore).average().orElse(0);
        double english = activities.stream()
                .filter(a -> "english".equalsIgnoreCase(a.getLanguage()))
                .mapToInt(ProgressActivity::getScore).average().orElse(0);
        double hindi = activities.stream()
                .filter(a -> "hindi".equalsIgnoreCase(a.getLanguage()))
                .mapToInt(ProgressActivity::getScore).average().orElse(0);

        int practiceSeconds = activities.stream().mapToInt(ProgressActivity::getDurationSeconds).sum();

        Map<String, Integer> exerciseScores = new LinkedHashMap<>();
        activities.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        ProgressActivity::getExerciseId,
                        LinkedHashMap::new,
                        java.util.stream.Collectors.averagingInt(ProgressActivity::getScore)))
                .forEach((id, score) -> exerciseScores.put(id, (int) Math.round(score)));

        List<ProgressActivity> recent = activities.stream()
                .sorted(Comparator.comparing(ProgressActivity::getCompletedAt).reversed())
                .limit(10)
                .toList();

        long sessions = activities.stream()
                .map(ProgressActivity::getSessionId)
                .filter(java.util.Objects::nonNull)
                .filter(id -> !id.isBlank())
                .distinct()
                .count();

        return new ProgressSummary(
                round(overall), round(english), round(hindi),
                (int) sessions, activities.size(), practiceSeconds,
                recent, exerciseScores
        );
    }

    private int round(double value) {
        return (int) Math.round(value);
    }
}
