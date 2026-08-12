import { useState } from 'react'

const adultVideos = [
  { id: 'a1', title: 'R Sound — Clear Speech', char: '🎙️', sound: 'R', lang: 'English', duration: '3 min', difficulty: 'Intermediate', phrase: 'Repeat after me', color: 'var(--color-primary-light)' },
  { id: 'a2', title: 'Hindi श Practice', char: '📝', sound: 'श', lang: 'Hindi', duration: '4 min', difficulty: 'Intermediate', phrase: 'शुद्ध उच्चारण', color: 'var(--color-accent-lavender-light)' },
  { id: 'a3', title: 'Cartoon Conversation — S Sound', char: '🗣️', sound: 'S', lang: 'English', duration: '2 min', difficulty: 'Beginner', phrase: 'Say it clearly', color: 'var(--color-accent-green-light)' },
  { id: 'a4', title: 'TH Sound Mastery', char: '💡', sound: 'TH', lang: 'English', duration: '3 min', difficulty: 'Advanced', phrase: 'This and that', color: 'var(--color-accent-peach-light)' },
]

type VideoItem = typeof adultVideos[0]

function VideoCard({ v, onWatch }: { v: VideoItem; onWatch: (v: VideoItem) => void }) {
  return (
    <button
      onClick={() => onWatch(v)}
      className="w-full text-left rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 active:scale-95"
      style={{ background: 'white', border: '1px solid var(--color-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
    >
      <div className="h-24 flex items-center justify-center text-5xl relative" style={{ background: v.color }}>
        {v.char}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
            style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)' }}>
            ▶
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="font-display font-700 text-sm text-[var(--color-text)] mb-1">{v.title}</div>
        <div className="flex flex-wrap gap-2 text-[10px] font-700">
          <span className="px-2 py-0.5 rounded-md" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            Sound: {v.sound}
          </span>
          <span className="px-2 py-0.5 rounded-md" style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
            {v.lang}
          </span>
          <span className="px-2 py-0.5 rounded-md" style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
            {v.duration}
          </span>
        </div>
      </div>
    </button>
  )
}

function VideoPlayer({ v, onClose }: { v: VideoItem; onClose: () => void }) {
  const [phase, setPhase] = useState<'watch' | 'repeat' | 'done'>('watch')
  const [recording, setRecording] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <button onClick={onClose} className="font-600 text-sm text-[var(--color-text-muted)]">← Close</button>
        <div className="font-display font-700 text-sm">{v.title}</div>
        <div />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {phase === 'watch' && (
          <>
            <div className="rounded-2xl p-8 mb-6 w-full max-w-sm" style={{ background: v.color }}>
              <div className="text-7xl mb-4">{v.char}</div>
              <div className="font-display font-800 text-2xl text-[var(--color-text)] mb-2">
                {v.title}
              </div>
              <div className="font-display font-800 text-4xl mt-4" style={{ color: 'var(--color-primary)' }}>
                "{v.phrase}"
              </div>
            </div>
            <p className="text-[var(--color-text-muted)] font-500 text-sm mb-6">
              Watch and listen carefully to the pronunciation.
            </p>
            <button
              onClick={() => setPhase('repeat')}
              className="px-8 py-4 rounded-2xl text-white font-display font-700 text-lg"
              style={{ background: 'var(--color-primary)' }}
            >
              Now I'll Say It! →
            </button>
          </>
        )}

        {phase === 'repeat' && (
          <>
            <div className="text-5xl mb-4">🎙️</div>
            <h2 className="font-display font-800 text-2xl text-[var(--color-text)] mb-2">
              Repeat the phrase
            </h2>
            <div className="font-display font-800 text-3xl mb-6" style={{ color: 'var(--color-primary)' }}>
              "{v.phrase}"
            </div>

            {recording && (
              <div className="flex gap-0.5 items-end h-10 mb-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-1.5 rounded-full animate-pulse"
                    style={{ height: Math.random() * 28 + 8, background: 'var(--color-accent-peach)', animationDelay: `${i * 0.07}s` }} />
                ))}
              </div>
            )}

            <button
              onPointerDown={() => setRecording(true)}
              onPointerUp={() => { setRecording(false); setPhase('done') }}
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all"
              style={{
                background: recording ? '#FDECEA' : 'var(--color-primary-light)',
                border: `4px solid ${recording ? '#E55353' : 'var(--color-primary)'}`,
                boxShadow: recording ? '0 0 0 8px rgba(229,83,83,0.15)' : '0 4px 16px rgba(107,159,212,0.2)',
              }}
            >
              {recording ? '🔴' : '🎙️'}
            </button>
            <p className="text-xs text-[var(--color-text-muted)] mt-3 font-500">
              {recording ? 'Release when done' : 'Hold to say it'}
            </p>
          </>
        )}

        {phase === 'done' && (
          <>
            <div className="text-6xl mb-4">✓</div>
            <h2 className="font-display font-800 text-2xl text-[var(--color-text)] mb-2">
              Well done!
            </h2>
            <p className="text-[var(--color-text-muted)] font-500 text-sm mb-8">
              You practiced the {v.sound} sound.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setPhase('watch')} className="px-5 py-3 rounded-xl font-700 text-sm"
                style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}>
                Watch Again
              </button>
              <button onClick={onClose} className="px-5 py-3 rounded-xl text-white font-700 text-sm"
                style={{ background: 'var(--color-primary)' }}>
                Back to Videos
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Videos() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

  if (activeVideo) {
    return <VideoPlayer v={activeVideo} onClose={() => setActiveVideo(null)} />
  }

  return (
    <div className="p-5 pb-24 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-800 text-2xl text-[var(--color-text)] mb-1">
          Practice Videos
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm font-500">
          Watch and repeat to improve your pronunciation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {adultVideos.map(v => (
          <VideoCard key={v.id} v={v} onWatch={setActiveVideo} />
        ))}
      </div>
    </div>
  )
}
