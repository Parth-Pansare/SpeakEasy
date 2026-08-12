package org.example.model;

public class AudioRecordingResponse {

    private String audioFileName;

    private String audioFilePath;

    private String expectedText;

    private String userText;

    public AudioRecordingResponse(
            String audioFileName,
            String audioFilePath,
            String expectedText,
            String userText) {

        this.audioFileName = audioFileName;
        this.audioFilePath = audioFilePath;
        this.expectedText = expectedText;
        this.userText = userText;
    }

    public String getAudioFileName() {
        return audioFileName;
    }

    public String getAudioFilePath() {
        return audioFilePath;
    }

    public String getExpectedText() {
        return expectedText;
    }

    public String getUserText() {
        return userText;
    }
}
