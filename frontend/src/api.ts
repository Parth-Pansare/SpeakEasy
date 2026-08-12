export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export interface TextComparisonResponse {
  expectedText: string
  userText: string
  match: boolean
  message: string
  score: number
}

export interface AudioRecordingResponse {
  audioFileName: string
  audioFilePath: string
  expectedText: string
  userText: string
}

export interface ProgressActivity {
  id: string
  exerciseId: string
  language: string
  category: string
  expectedText: string
  userText: string
  score: number
  match: boolean
  attempts: number
  durationSeconds: number
  audioFileName: string | null
  completedAt: string
}

export interface ProgressSummary {
  overallScore: number
  englishScore: number
  hindiScore: number
  sessions: number
  exercisesCompleted: number
  practiceTimeSeconds: number
  recentActivities: ProgressActivity[]
  exerciseScores: Record<string, number>
}

export interface Profile {
  name: string
  age: number
  languagePreference: string
  memberSince: string
  practiceGoalMinutes: number
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || `Request failed with status ${response.status}`)
  }
  return response.json() as Promise<T>
}

export async function compareText(expectedText: string, userText: string) {
  const response = await fetch(`${API_BASE_URL}/audio/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expectedText, userText }),
  })
  return parseResponse<TextComparisonResponse>(response)
}

export async function uploadRecording(file: Blob, expectedText: string, userText: string) {
  const formData = new FormData()
  formData.append('file', file, `speakeasy-${Date.now()}.webm`)
  formData.append('expectedText', expectedText)
  formData.append('userText', userText)

  const response = await fetch(`${API_BASE_URL}/audio/recordings`, {
    method: 'POST',
    body: formData,
  })
  return parseResponse<AudioRecordingResponse>(response)
}

export async function getProgressSummary() {
  const response = await fetch(`${API_BASE_URL}/progress/summary`)
  return parseResponse<ProgressSummary>(response)
}

export async function saveProgress(payload: {
  sessionId: string
  exerciseId: string
  language: string
  category: string
  expectedText: string
  userText: string
  score: number
  match: boolean
  attempts: number
  durationSeconds: number
  audioFileName?: string | null
}) {
  const response = await fetch(`${API_BASE_URL}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse<ProgressActivity>(response)
}

export async function getProfile() {
  const response = await fetch(`${API_BASE_URL}/profile`)
  return parseResponse<Profile>(response)
}

export async function updateProfile(profile: Profile) {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  return parseResponse<Profile>(response)
}
