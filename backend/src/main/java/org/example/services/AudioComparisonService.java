package org.example.services;

import org.example.model.TextComparisonRequest;
import org.example.model.TextComparisonResponse;
import org.springframework.stereotype.Service;

@Service
public class AudioComparisonService {

    public TextComparisonResponse compareText(TextComparisonRequest request) {
        String expectedText = request.getExpectedText() == null ? "" : request.getExpectedText().trim();
        String userText = request.getUserText() == null ? "" : request.getUserText().trim();

        String expected = normalize(expectedText);
        String actual = normalize(userText);
        boolean match = !expected.isEmpty() && expected.equals(actual);
        int score = similarityScore(expected, actual);

        String message = match
                ? "Correct! The pronunciation transcript matches the target."
                : score >= 80
                    ? "Very close! Keep practicing the small differences."
                    : score >= 60
                        ? "Good attempt. Practice the target sound again."
                        : "Keep practicing and try to match the target more closely.";

        return new TextComparisonResponse(expectedText, userText, match, message, score);
    }

    private String normalize(String value) {
        return value
                .toLowerCase()
                .replaceAll("[^\\p{L}\\p{N}\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private int similarityScore(String expected, String actual) {
        if (expected.isEmpty() || actual.isEmpty()) return 0;
        if (expected.equals(actual)) return 100;

        int distance = levenshtein(expected, actual);
        int max = Math.max(expected.length(), actual.length());
        return Math.max(0, Math.min(100, (int) Math.round((1.0 - ((double) distance / max)) * 100)));
    }

    private int levenshtein(String a, String b) {
        int[] previous = new int[b.length() + 1];
        int[] current = new int[b.length() + 1];

        for (int j = 0; j <= b.length(); j++) previous[j] = j;

        for (int i = 1; i <= a.length(); i++) {
            current[0] = i;
            for (int j = 1; j <= b.length(); j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                current[j] = Math.min(
                        Math.min(current[j - 1] + 1, previous[j] + 1),
                        previous[j - 1] + cost
                );
            }
            int[] temp = previous;
            previous = current;
            current = temp;
        }
        return previous[b.length()];
    }
}
