import { ShieldCheck, LayoutDashboard, BarChart3, FileText, Settings, Plus, Bell } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { path: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics',  icon: BarChart3 },
  { path: '/reports',   label: 'Reports',    icon: FileText },
  { path: '/settings',  label: 'Settings',   icon: Settings },
]

export default function Navbar({ user = 'Demo User' }) {
  const navigate  = useNavigate()
  const location  = useLocation()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #EEF2FF',
      boxShadow: '0 1px 20px rgba(30,58,138,0.05)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '0 28px', height: 64,
        display: 'flex', alignItems: 'center', gap: 0,
      }}>

        {/* ── Logo ─────────────────────────────────────── */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 0', marginRight: 40, flexShrink: 0,
            textDecoration: 'none',
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2E6BFF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(46,107,255,0.3)',
            flexShrink: 0,
          }}>
            <ShieldCheck size={19} color="white" />
          </div>
          <div style={{ textAlign: 'left', lineHeight: 1 }}>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800, fontSize: 17,
              color: '#0F172A', letterSpacing: '-0.4px',
              margin: 0,
            }}>DigiLend Audit</p>
            <p style={{
              fontSize: 10, color: '#94A3B8', fontWeight: 600,
              letterSpacing: '1.8px', textTransform: 'uppercase',
              marginTop: 3,
            }}>RBI Compliance</p>
          </div>
        </button>

        {/* ── Nav Links ─────────────────────────────────── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {NAV_LINKS.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 16px', borderRadius: 10,
                  border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: active ? 700 : 500,
                  fontFamily: "'Inter', sans-serif",
                  color: active ? '#1E3A8A' : '#64748B',
                  background: active ? '#EEF3FF' : 'transparent',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#F8FAFF'; e.currentTarget.style.color = '#1E3A8A' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B' } }}
              >
                <Icon size={15} />
                {label}
                {active && (
                  <span style={{
                    position: 'absolute', bottom: -1, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 20, height: 2.5, borderRadius: 2,
                    background: '#2E6BFF',
                  }} />
                )}
              </button>
            )
          })}
        </nav>

        {/* ── Right controls ────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>

          {/* New Audit button */}
          <button
            onClick={() => navigate('/audit/new')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'linear-gradient(135deg, #1E3A8A, #2E6BFF)',
              color: 'white', border: 'none', borderRadius: 10,
              padding: '9px 20px', fontSize: 13, fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(46,107,255,0.3)',
              transition: 'all 0.2s',
            }}
          >
            <Plus size={15} /> New Audit
          </button>

          {/* Notification bell */}
          <button style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'transparent', border: '1px solid #EEF2FF',
            cursor: 'pointer', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#64748B',
          }}>
            <Bell size={17} />
            <span style={{
              position: 'absolute', top: 7, right: 7,
              width: 8, height: 8, borderRadius: '50%',
              background: '#F43F5E', border: '2px solid white',
            }} />
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: '#E8EEFF' }} />

          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 15,
              color: 'white',
              boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
            }}>
              {user.charAt(0).toUpperCase()}
            </div>
            <div style={{ lineHeight: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', margin: 0 }}>{user}</p>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: 0, marginTop: 3 }}>Admin</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            style={{
              fontSize: 12, color: '#94A3B8', background: 'none', border: 'none',
              cursor: 'pointer', fontWeight: 600, fontFamily: "'Inter',sans-serif",
              padding: '4px 8px', borderRadius: 6, transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#F43F5E'}
            onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
