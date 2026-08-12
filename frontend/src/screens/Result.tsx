import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Result() {
  const { selectedExercise, lastPractice } = useApp()
  const navigate = useNavigate()

  if (!lastPractice) {
    return (
      <div className="p-6 pb-24 max-w-lg mx-auto text-center">
        <div className="text-5xl mb-4">🎙️</div>
        <h1 className="font-display font-800 text-2xl text-[var(--color-text)] mb-2">No practice result yet</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">Complete an exercise to see your real score here.</p>
        <button onClick={() => navigate('/exercises')} className="px-6 py-3 rounded-xl text-white font-700" style={{ background: 'var(--color-primary)' }}>Choose an Exercise</button>
      </div>
    )
  }

  const { comparison, attempts, durationSeconds, activity } = lastPractice
  const score = comparison.score
  const scoreColor = score >= 85 ? 'var(--color-accent-green)' : score >= 70 ? 'var(--color-primary)' : 'var(--color-accent-peach)'
  const scoreLabel = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Keep Practicing'
  const minutes = Math.floor(durationSeconds / 60)
  const seconds = durationSeconds % 60

  return (
    <div className="p-5 pb-24 max-w-lg mx-auto flex flex-col items-center text-center">
      <div className="mt-6 mb-8">
        <div className="text-5xl mb-3">✓</div>
        <h1 className="font-display font-800 text-2xl text-[var(--color-text)] mb-2">Practice Completed</h1>
        <p className="text-[var(--color-text-muted)] font-500">{comparison.message}</p>
      </div>

      <div className="relative mb-8">
        <svg width={140} height={140} className="-rotate-90">
          <circle cx={70} cy={70} r={58} fill="none" stroke="#E8E4DF" strokeWidth={10} />
          <circle
            cx={70} cy={70} r={58} fill="none" stroke={scoreColor} strokeWidth={10}
            strokeDasharray={364} strokeDashoffset={364 - (score / 100) * 364} strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display font-800 text-4xl" style={{ color: scoreColor }}>{score}%</div>
          <div className="text-xs font-700 text-[var(--color-text-muted)]">{scoreLabel}</div>
        </div>
      </div>

      <div className="w-full rounded-2xl p-5 mb-6 text-left" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <div className="text-xs font-700 text-[var(--color-text-muted)] mb-2">Target</div>
        <div className="font-700 text-sm text-[var(--color-text)] mb-4">{comparison.expectedText}</div>
        <div className="text-xs font-700 text-[var(--color-text-muted)] mb-2">Recognised speech</div>
        <div className="font-600 text-sm text-[var(--color-text)]">{comparison.userText || 'No speech recognised'}</div>
      </div>

      <div className="w-full grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Exercise', value: selectedExercise || activity.exerciseId, icon: '🔤' },
          { label: 'Attempts', value: String(attempts), icon: '🎙️' },
          { label: 'Time', value: `${minutes}:${String(seconds).padStart(2, '0')}`, icon: '⏱️' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="font-display font-700 text-sm text-[var(--color-text)] truncate">{s.value}</div>
            <div className="text-[10px] text-[var(--color-text-muted)] font-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="w-full grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/exercise')} className="py-3.5 rounded-xl font-700 text-sm" style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}>
          Practice Again
        </button>
        <button onClick={() => navigate('/exercises')} className="py-3.5 rounded-xl text-white font-700 text-sm" style={{ background: 'var(--color-primary)' }}>
          Next Exercise →
        </button>
      </div>

      <button onClick={() => navigate('/progress')} className="mt-4 text-sm font-600" style={{ color: 'var(--color-text-muted)' }}>
        View Progress →
      </button>
    </div>
  )
}
