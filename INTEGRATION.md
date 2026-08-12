# SpeakEasy Frontend + Backend Integration

## Local run

### Backend

Open `backend` in IntelliJ as a Maven project and run `org.example.Main`.

- Backend: `http://localhost:8080`
- Test: `http://localhost:8080/api/audio/test`

### Frontend

Open a terminal in `frontend`:

```bash
npm install
npm run dev
```

Open:

`http://localhost:5173/SPEAKEASY/`

## Connected API flow

- `GET /api/audio/test` — backend health check
- `POST /api/audio/compare` — compares target text and browser transcript and returns a 0–100 score
- `POST /api/audio/recordings` — stores the browser WebM recording
- `POST /api/progress` — saves completed exercise progress
- `GET /api/progress/summary` — dashboard/progress data
- `GET /api/profile` — profile data
- `PUT /api/profile` — updates profile data

## Important

Progress and profile are currently stored in backend memory. They reset when the Spring Boot application restarts. Audio recordings are stored in `backend/recordings/`.

The browser needs microphone permission for real audio recording. Speech recognition is used for the transcript; Chrome/Edge are recommended.
