import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { Category } from '../context/AppContext'

const categories = [
  {
    id: 'letters' as Category,
    emoji: '🔤',
    title: 'Letters',
    desc: 'Practice individual speech sounds and phonemes',
    color: 'var(--color-primary-light)',
    accent: 'var(--color-primary)',
    count: 26,
  },
  {
    id: 'words' as Category,
    emoji: '💬',
    title: 'Words',
    desc: 'Pronounce words clearly with targeted sound practice',
    color: 'var(--color-accent-green-light)',
    accent: 'var(--color-accent-green)',
    count: 48,
  },
  {
    id: 'sentences' as Category,
    emoji: '📝',
    title: 'Sentences',
    desc: 'Complete sentences to strengthen fluency and rhythm',
    color: 'var(--color-accent-lavender-light)',
    accent: 'var(--color-accent-lavender)',
    count: 32,
  },
]

export default function Therapy() {
  const { setCategory, startSession } = useApp()
  const navigate = useNavigate()

  const handlePick = (cat: Category) => {
    setCategory(cat)
    startSession()
    navigate('/language')
  }

  return (
    <div className="p-5 pb-24 max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-800 text-2xl text-[var(--color-text)] mb-1">
          Speech Exercise Therapy
        </h1>
        <p className="text-[var(--color-text-muted)] font-500 text-sm">
          Select a category to begin your session.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handlePick(cat.id)}
            className="w-full text-left rounded-2xl p-5 transition-all active:scale-95 hover:-translate-y-0.5 group"
            style={{ background: 'white', border: '1px solid var(--color-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: cat.color }}>
                {cat.emoji}
              </div>
              <div className="flex-1">
                <div className="font-display font-700 text-lg text-[var(--color-text)]">{cat.title}</div>
                <div className="text-sm text-[var(--color-text-muted)] font-500">{cat.desc}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display font-800 text-xl" style={{ color: cat.accent }}>{cat.count}</div>
                <div className="text-[10px] text-[var(--color-text-muted)] font-600">exercises</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-600 mb-1">
                <span>Progress</span>
                <span>{Math.floor(Math.random() * 30 + 50)}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.floor(Math.random() * 30 + 50)}%`, background: cat.accent }} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
