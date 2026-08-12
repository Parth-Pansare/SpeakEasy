package org.example.model;

public class TextComparisonResponse {
    private String expectedText;
    private String userText;
    private boolean match;
    private String message;
    private int score;

    public TextComparisonResponse(String expectedText, String userText, boolean match, String message, int score) {
        this.expectedText = expectedText;
        this.userText = userText;
        this.match = match;
        this.message = message;
        this.score = score;
    }

    public String getExpectedText() { return expectedText; }
    public String getUserText() { return userText; }
    public boolean isMatch() { return match; }
    public String getMessage() { return message; }
    public int getScore() { return score; }
}
