import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-800 text-sm" style={{ background: 'var(--color-primary)' }}>
            SP
          </div>
          <span className="font-display font-700 text-lg text-[var(--color-text)]">SpeakEasy</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span className="px-3 py-1 rounded-full font-600" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            हिंदी / English
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="relative mb-8">
          <div
            className="w-28 h-28 rounded-full mx-auto flex items-center justify-center text-5xl"
            style={{ background: 'linear-gradient(135deg, #EBF3FB 0%, #F0EDFB 100%)' }}
          >
            🗣️
          </div>
        </div>

        <h1 className="font-display font-800 text-4xl md:text-5xl text-[var(--color-text)] leading-tight mb-4 max-w-xl">
          Speech Exercise Therapy.<br />
          <span style={{ color: 'var(--color-primary)' }}>Guided. Measured. Yours.</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg max-w-md mb-10 leading-relaxed font-500">
          A bilingual speech therapy platform for Hindi and English, built for focused practice and clear progress tracking.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-display font-700 text-lg transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--color-primary)', boxShadow: '0 6px 20px rgba(107,159,212,0.3)' }}
        >
          Begin Therapy →
        </button>

        <div className="flex flex-wrap gap-6 mt-14 text-xs text-[var(--color-text-muted)] font-600 justify-center">
          <span className="flex items-center gap-1.5">
            <span className="text-[var(--color-accent-green)]">✓</span> Bilingual Hindi & English
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[var(--color-accent-green)]">✓</span> Speech Sound Disorders
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[var(--color-accent-green)]">✓</span> SIH1334 Certified
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[var(--color-accent-green)]">✓</span> Progress Tracking
          </span>
        </div>
      </main>
    </div>
  )
}
