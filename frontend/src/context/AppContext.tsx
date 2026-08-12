import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ProgressActivity, TextComparisonResponse } from '../api'

export type Lang = 'english' | 'hindi'
export type Category = 'letters' | 'words' | 'sentences'

export interface LastPractice {
  comparison: TextComparisonResponse
  activity: ProgressActivity
  attempts: number
  durationSeconds: number
  expectedText: string
  userText: string
  exerciseId: string
}

interface AppState {
  lang: Lang | null
  category: Category | null
  selectedExercise: string | null
  sessionId: string
  lastPractice: LastPractice | null
  setLang: (l: Lang) => void
  setCategory: (c: Category) => void
  setSelectedExercise: (e: string | null) => void
  startSession: () => void
  setLastPractice: (practice: LastPractice | null) => void
}

const Ctx = createContext<AppState | null>(null)

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang | null>('english')
  const [category, setCategory] = useState<Category | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState(createSessionId)
  const [lastPractice, setLastPractice] = useState<LastPractice | null>(null)

  const value = useMemo(() => ({
    lang,
    category,
    selectedExercise,
    sessionId,
    lastPractice,
    setLang,
    setCategory,
    setSelectedExercise,
    startSession: () => setSessionId(createSessionId()),
    setLastPractice,
  }), [lang, category, selectedExercise, sessionId, lastPractice])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
