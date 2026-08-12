import { useEffect, useState } from 'react'
import { getProgressSummary, type ProgressSummary } from '../api'

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  return `${minutes}m`
}

function formatWhen(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

function ProgressRing({ pct }: { pct: number }) {
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  return (
    <div className="relative shrink-0">
      <svg width={140} height={140} className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#E8E4DF" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none" stroke="var(--color-primary)" strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-800 text-3xl" style={{ color: 'var(--color-primary)' }}>{pct}%</span>
        <span className="text-[10px] font-700 text-[var(--color-text-muted)]">overall</span>
      </div>
    </div>
  )
}

export default function Progress() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      setSummary(await getProgressSummary())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load progress.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  if (loading) return <div className="p-6 pb-24 max-w-2xl mx-auto text-sm text-[var(--color-text-muted)]">Loading progress from the backend…</div>
  if (error) return (
    <div className="p-6 pb-24 max-w-2xl mx-auto">
      <div className="rounded-2xl p-5" style={{ background: '#FDECEA', color: '#B54444' }}>
        <div className="font-700 mb-2">Could not load progress</div>
        <div className="text-sm mb-4">{error}</div>
        <button onClick={() => void load()} className="px-4 py-2 rounded-xl text-white text-sm font-700" style={{ background: 'var(--color-primary)' }}>Retry</button>
      </div>
    </div>
  )

  const data = summary!
  const hasData = data.exercisesCompleted > 0

  return (
    <div className="p-5 pb-24 max-w-2xl mx-auto">
      <div className="mb-7">
        <h1 className="font-display font-800 text-2xl text-[var(--color-text)] mb-1">Progress</h1>
        <p className="text-sm text-[var(--color-text-muted)] font-500">Live progress loaded from your SpeakEasy backend.</p>
      </div>

      <div className="rounded-2xl p-6 mb-5 flex items-center gap-6" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <ProgressRing pct={data.overallScore} />
        <div className="flex-1">
          <div className="font-display font-700 text-lg text-[var(--color-text)]">Overall Progress</div>
          <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-4">
            {hasData ? 'Your scores are calculated from completed exercises.' : 'Complete your first exercise to start building progress.'}
          </p>
          <div className="flex gap-5 text-xs">
            <span><strong>English</strong> <span className="text-[var(--color-text-muted)]">{data.englishScore}%</span></span>
            <span><strong>Hindi</strong> <span className="text-[var(--color-text-muted)]">{data.hindiScore}%</span></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          ['Sessions', data.sessions, 'backend sessions'],
          ['Exercises', data.exercisesCompleted, 'completed'],
          ['Practice', formatDuration(data.practiceTimeSeconds), 'recorded time'],
        ].map(([label, value, sub]) => (
          <div key={String(label)} className="rounded-xl p-4 text-center" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
            <div className="font-display font-800 text-xl text-[var(--color-text)]">{value}</div>
            <div className="font-700 text-xs text-[var(--color-text)]">{label}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">{sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5 mb-5" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Exercise Scores</h2>
        {Object.keys(data.exerciseScores).length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No completed exercises yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {Object.entries(data.exerciseScores).map(([exercise, score]) => (
              <div key={exercise}>
                <div className="flex justify-between text-sm font-700 mb-1">
                  <span>{exercise}</span><span style={{ color: 'var(--color-primary)' }}>{score}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'var(--color-border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${score}%`, background: 'var(--color-primary)' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Recent Activity</h2>
        {data.recentActivities.length === 0 ? (
          <div className="rounded-xl p-5 text-sm text-[var(--color-text-muted)]" style={{ background: 'white', border: '1px solid var(--color-border)' }}>No practice activity yet.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {data.recentActivities.map(activity => (
              <div key={activity.id} className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-800" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{activity.score}%</div>
                <div className="flex-1 min-w-0">
                  <div className="font-700 text-sm text-[var(--color-text)] truncate">{activity.exerciseId}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{activity.language} · {formatWhen(activity.completedAt)}</div>
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">{activity.attempts} attempt{activity.attempts === 1 ? '' : 's'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
