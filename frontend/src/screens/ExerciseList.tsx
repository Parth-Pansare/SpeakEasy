import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProgressSummary } from '../api'
import { useApp } from '../context/AppContext'

const englishLetters = [
  { id: 'R', sound: 'R', label: 'R', status: 'completed', score: 85, desc: 'as in Rabbit, Rain' },
  { id: 'L', sound: 'L', label: 'L', status: 'completed', score: 91, desc: 'as in Lion, Lamp' },
  { id: 'S', sound: 'S', label: 'S', status: 'in-progress', score: 68, desc: 'as in Sun, Snake' },
  { id: 'SH', sound: 'SH', label: 'SH', status: 'in-progress', score: 55, desc: 'as in Ship, Shell' },
  { id: 'CH', sound: 'CH', label: 'CH', status: 'not-started', score: 0, desc: 'as in Chair, Cheese' },
  { id: 'TH', sound: 'TH', label: 'TH', status: 'not-started', score: 0, desc: 'as in This, That' },
]

const hindiLetters = [
  { id: 'क', sound: 'क', label: 'क', status: 'completed', score: 88, desc: 'कमल, कबूतर' },
  { id: 'ग', sound: 'ग', label: 'ग', status: 'completed', score: 75, desc: 'गाय, गुलाब' },
  { id: 'श', sound: 'श', label: 'श', status: 'in-progress', score: 62, desc: 'शेर, शहद' },
  { id: 'र', sound: 'र', label: 'र', status: 'in-progress', score: 70, desc: 'राज, रात' },
  { id: 'ल', sound: 'ल', label: 'ल', status: 'not-started', score: 0, desc: 'लड़की, लहर' },
  { id: 'स', sound: 'स', label: 'स', status: 'not-started', score: 0, desc: 'सपना, सूरज' },
]

const englishWords = [
  { id: 'rabbit', emoji: '🐰', word: 'Rabbit', sound: 'R', status: 'completed', score: 85 },
  { id: 'rain', emoji: '🌧️', word: 'Rain', sound: 'R', status: 'completed', score: 72 },
  { id: 'red', emoji: '🍎', word: 'Red', sound: 'R', status: 'in-progress', score: 60 },
  { id: 'road', emoji: '🛣️', word: 'Road', sound: 'R', status: 'in-progress', score: 55 },
  { id: 'lion', emoji: '🦁', word: 'Lion', sound: 'L', status: 'not-started', score: 0 },
  { id: 'lamp', emoji: '🕯️', word: 'Lamp', sound: 'L', status: 'not-started', score: 0 },
]

const hindiWords = [
  { id: 'kamal', emoji: '🌸', word: 'कमल', sound: 'क', status: 'completed', score: 88 },
  { id: 'sher', emoji: '🦁', word: 'शेर', sound: 'श', status: 'completed', score: 80 },
  { id: 'rang', emoji: '🎨', word: 'रंग', sound: 'र', status: 'in-progress', score: 65 },
  { id: 'surya', emoji: '☀️', word: 'सूरज', sound: 'स', status: 'not-started', score: 0 },
]

const englishSentences = [
  { id: 's1', sentence: 'The rabbit is running rapidly.', sound: 'R', difficulty: 'Medium', status: 'completed', score: 78 },
  { id: 's2', sentence: 'She likes red roses.', sound: 'R', difficulty: 'Easy', status: 'completed', score: 85 },
  { id: 's3', sentence: 'The sun shines in the sky.', sound: 'S', difficulty: 'Easy', status: 'in-progress', score: 60 },
  { id: 's4', sentence: 'The child chased the chicken.', sound: 'CH', difficulty: 'Hard', status: 'not-started', score: 0 },
]

const hindiSentences = [
  { id: 'hs1', sentence: 'राम रोज़ रात को खाना खाता है।', sound: 'र', difficulty: 'Medium', status: 'completed', score: 82 },
  { id: 'hs2', sentence: 'शेर जंगल का राजा है।', sound: 'श', difficulty: 'Easy', status: 'in-progress', score: 65 },
  { id: 'hs3', sentence: 'सूरज सुबह उगता है।', sound: 'स', difficulty: 'Easy', status: 'not-started', score: 0 },
]

const statusStyle = (s: string) => {
  if (s === 'completed') return { bg: 'var(--color-accent-green-light)', text: 'var(--color-accent-green)', label: '✓ Done' }
  if (s === 'in-progress') return { bg: 'var(--color-primary-light)', text: 'var(--color-primary)', label: '→ In Progress' }
  return { bg: 'var(--color-border)', text: 'var(--color-text-muted)', label: '○ New' }
}

export default function ExerciseList() {
  const { category, lang, setSelectedExercise } = useApp()
  const navigate = useNavigate()
  const [backendScores, setBackendScores] = useState<Record<string, number>>({})

  useEffect(() => {
    getProgressSummary().then(data => setBackendScores(data.exerciseScores)).catch(() => setBackendScores({}))
  }, [])

  let items: any[] = []
  const langKey = lang || 'english'

  if (category === 'letters') items = langKey === 'english' ? englishLetters : hindiLetters
  else if (category === 'words') items = langKey === 'english' ? englishWords : hindiWords
  else items = langKey === 'english' ? englishSentences : hindiSentences

  const displayItems = items.map((item: any) => {
    const backendScore = backendScores[item.id]
    if (typeof backendScore !== 'number') return item
    return { ...item, score: backendScore, status: backendScore >= 80 ? 'completed' : 'in-progress' }
  })

  const pick = (id: string) => {
    setSelectedExercise(id)
    navigate('/exercise')
  }

  return (
    <div className="p-5 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[var(--color-text-muted)] text-sm font-600 mb-6 hover:text-[var(--color-text)]">
        ← Back
      </button>

      <div className="mb-6">
        <div className="text-xs font-700 uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
          {lang === 'hindi' ? 'हिंदी' : 'English'} · {category}
        </div>
        <h1 className="font-display font-800 text-2xl text-[var(--color-text)]">
          {lang === 'hindi' ? 'हिंदी' : 'English'} {category === 'letters' ? 'Sounds' : category === 'words' ? 'Words' : 'Sentences'}
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm font-500 mt-1">
          Select an exercise to begin.
        </p>
      </div>

      <div className="flex gap-3 mb-5 text-xs font-600">
        {['completed', 'in-progress', 'not-started'].map(s => {
          const st = statusStyle(s)
          return (
            <div key={s} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: st.text }} />
              <span style={{ color: 'var(--color-text-muted)' }}>{st.label}</span>
            </div>
          )
        })}
      </div>

      {category === 'letters' && (
        <div className="grid grid-cols-3 gap-3">
          {displayItems.map((item: any) => {
            const st = statusStyle(item.status)
            return (
              <button
                key={item.id}
                onClick={() => pick(item.id)}
                className="rounded-2xl p-4 text-center transition-all active:scale-95 hover:-translate-y-0.5"
                style={{ background: st.bg, border: `2px solid transparent` }}
              >
                <div className="font-display font-800 text-3xl mb-1" style={{ color: 'var(--color-text)' }}>{item.label}</div>
                {item.score > 0 && (
                  <div className="text-xs font-700" style={{ color: st.text }}>{item.score}%</div>
                )}
                <div className="text-[10px] text-[var(--color-text-muted)] mt-1 font-500 leading-tight">{item.desc}</div>
              </button>
            )
          })}
        </div>
      )}

      {category === 'words' && (
        <div className="flex flex-col gap-3">
          {displayItems.map((item: any) => {
            const st = statusStyle(item.status)
            return (
              <button
                key={item.id}
                onClick={() => pick(item.id)}
                className="flex items-center gap-4 rounded-2xl p-4 transition-all active:scale-95 hover:-translate-y-0.5 w-full text-left"
                style={{ background: 'white', border: '1px solid var(--color-border)' }}
              >
                <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl shrink-0" style={{ background: st.bg }}>
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-display font-700 text-lg text-[var(--color-text)]">{item.word}</div>
                  <div className="text-xs text-[var(--color-text-muted)] font-500">Sound: {item.sound}</div>
                </div>
                <div className="text-right shrink-0">
                  {item.score > 0 ? (
                    <div className="font-700 text-sm px-2 py-1 rounded-lg" style={{ background: st.bg, color: st.text }}>{item.score}%</div>
                  ) : (
                    <div className="text-xs font-600 px-2 py-1 rounded-lg" style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>Start</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {category === 'sentences' && (
        <div className="flex flex-col gap-3">
          {displayItems.map((item: any) => {
            const st = statusStyle(item.status)
            return (
              <button
                key={item.id}
                onClick={() => pick(item.id)}
                className="rounded-2xl p-4 transition-all active:scale-95 hover:-translate-y-0.5 w-full text-left"
                style={{ background: 'white', border: '1px solid var(--color-border)' }}
              >
                <div className="font-700 text-sm text-[var(--color-text)] mb-2 leading-relaxed">"{item.sentence}"</div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs font-700 px-2 py-0.5 rounded-md"
                      style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                      Sound: {item.sound}
                    </span>
                    <span className="text-xs font-700 px-2 py-0.5 rounded-md"
                      style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                      {item.difficulty}
                    </span>
                  </div>
                  {item.score > 0 && (
                    <div className="font-700 text-sm" style={{ color: st.text }}>{item.score}%</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
