import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Language() {
  const { setLang, category } = useApp()
  const navigate = useNavigate()

  const choose = (lang: 'english' | 'hindi') => {
    setLang(lang)
    navigate('/exercises')
  }

  return (
    <div className="p-5 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[var(--color-text-muted)] text-sm font-600 mb-6 hover:text-[var(--color-text)]">
        ← Back
      </button>

      <div className="mb-8">
        <div className="text-xs font-700 uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
          {category} practice
        </div>
        <h1 className="font-display font-800 text-2xl text-[var(--color-text)]">
          Choose Your Language
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm font-500 mt-1">
          Select the language for this session.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => choose('english')}
          className="text-left rounded-2xl p-6 transition-all active:scale-95 hover:-translate-y-0.5 group"
          style={{ background: 'white', border: '2px solid var(--color-border)', boxShadow: '0 4px 16px rgba(107,159,212,0.06)' }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-800 text-2xl shrink-0"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              Aa
            </div>
            <div className="flex-1">
              <div className="font-display font-800 text-2xl text-[var(--color-text)] mb-1">English</div>
              <div className="text-sm text-[var(--color-text-muted)] font-500">
                Practice English speech sounds and words
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['R', 'L', 'S', 'SH', 'TH', 'CH'].map(s => (
                  <span key={s} className="text-xs font-700 px-2 py-0.5 rounded-md"
                    style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-2xl opacity-30 group-hover:opacity-60 transition-opacity">→</div>
          </div>
        </button>

        <button
          onClick={() => choose('hindi')}
          className="text-left rounded-2xl p-6 transition-all active:scale-95 hover:-translate-y-0.5 group"
          style={{ background: 'white', border: '2px solid var(--color-border)', boxShadow: '0 4px 16px rgba(107,159,212,0.06)' }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-800 text-2xl shrink-0"
              style={{ background: 'var(--color-accent-peach-light)', color: 'var(--color-accent-peach)' }}
            >
              अ
            </div>
            <div className="flex-1">
              <div className="font-display font-800 text-2xl text-[var(--color-text)] mb-1">हिंदी</div>
              <div className="text-sm text-[var(--color-text-muted)] font-500">
                Hindi speech sounds and words practice
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['क', 'ग', 'श', 'र', 'ल', 'स'].map(s => (
                  <span key={s} className="text-xs font-700 px-2 py-0.5 rounded-md"
                    style={{ background: 'var(--color-accent-peach-light)', color: 'var(--color-accent-peach)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-2xl opacity-30 group-hover:opacity-60 transition-opacity">→</div>
          </div>
        </button>
      </div>
    </div>
  )
}