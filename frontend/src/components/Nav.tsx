import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: '⊞', label: 'Home' },
  { to: '/therapy', icon: '◎', label: 'Exercises' },
  { to: '/videos', icon: '▶', label: 'Videos' },
  { to: '/progress', icon: '◐', label: 'Progress' },
  { to: '/profile', icon: '○', label: 'Profile' },
]

export default function Nav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 py-2 lg:hidden"
      style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #E8E4DF' }}
    >
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`
          }
        >
          <span className="text-base">{item.icon}</span>
          <span className="text-xs font-600">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function Sidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col gap-1 w-56 shrink-0 pt-8 px-3"
      style={{ borderRight: '1px solid #E8E4DF', minHeight: '100vh' }}
    >
      <div className="px-3 mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-800" style={{ background: 'var(--color-primary)' }}>
          SP
        </div>
        <span className="font-display font-700 text-[var(--color-text)]">SpeakEasy</span>
      </div>
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl font-600 transition-all text-sm ${
              isActive
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]'
            }`
          }
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </aside>
  )
}
