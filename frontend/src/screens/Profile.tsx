import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile, type Profile as ProfileData } from '../api'

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProfile().then(setProfile).catch(err => setError(err instanceof Error ? err.message : 'Could not load profile.'))
  }, [])

  const save = async () => {
    if (!profile) return
    try {
      setSaving(true)
      setError(null)
      setProfile(await updateProfile(profile))
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return <div className="p-6 pb-24 text-sm text-[var(--color-text-muted)]">{error || 'Loading profile from the backend…'}</div>

  return (
    <div className="p-5 pb-24 max-w-lg mx-auto">
      <h1 className="font-display font-800 text-2xl text-[var(--color-text)] mb-6">Profile</h1>

      <div className="rounded-2xl p-6 mb-5 text-center" style={{ background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent-lavender-light))', border: '1px solid var(--color-border)' }}>
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-3" style={{ background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>👤</div>
        {editing ? (
          <div className="flex flex-col gap-2">
            <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="rounded-xl px-3 py-2 text-center" />
            <input type="number" min={1} value={profile.age} onChange={e => setProfile({ ...profile, age: Number(e.target.value) })} className="rounded-xl px-3 py-2 text-center" />
          </div>
        ) : (
          <>
            <div className="font-display font-800 text-xl text-[var(--color-text)]">{profile.name}</div>
            <div className="text-sm text-[var(--color-text-muted)] font-500 mt-0.5">Age {profile.age}</div>
          </>
        )}
      </div>

      <div className="rounded-2xl p-5 mb-5" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Details</h2>
        {[
          { label: 'Language Preference', value: profile.languagePreference },
          { label: 'Member Since', value: profile.memberSince },
          { label: 'Practice Goal', value: `${profile.practiceGoalMinutes} min / day` },
        ].map(item => (
          <div key={item.label} className="flex justify-between py-2.5 text-sm" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <span className="text-[var(--color-text-muted)] font-500">{item.label}</span>
            <span className="font-700 text-[var(--color-text)]">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5 mb-5" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Account</h2>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">Profile data is now loaded and saved through the Spring Boot API.</p>
        {error && <p className="text-xs font-600 mb-3" style={{ color: '#B54444' }}>{error}</p>}
        <div className="flex gap-2">
          {editing ? (
            <>
              <button disabled={saving} onClick={() => void save()} className="flex-1 py-3 rounded-xl text-white font-700 text-sm" style={{ background: 'var(--color-primary)' }}>{saving ? 'Saving…' : 'Save Changes'}</button>
              <button onClick={() => setEditing(false)} className="px-4 py-3 rounded-xl font-700 text-sm" style={{ background: 'var(--color-border)' }}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="w-full py-3 rounded-xl font-700 text-sm" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>Edit Profile</button>
          )}
        </div>
      </div>

      <button onClick={() => navigate('/')} className="w-full py-3.5 rounded-2xl font-700 text-sm" style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
        Back to Welcome Screen
      </button>
    </div>
  )
}
