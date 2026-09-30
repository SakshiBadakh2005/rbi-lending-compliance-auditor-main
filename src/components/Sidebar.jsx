import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BarChart3, FileText,
  Settings, ShieldCheck, LogOut,
} from 'lucide-react'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/dashboard'  },
  { icon: BarChart3,       label: 'Analytics',  path: '/analytics'  },
  { icon: FileText,        label: 'Reports',    path: '/reports'    },
  { icon: Settings,        label: 'Settings',   path: '/settings'   },
]

export default function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <ShieldCheck size={17} color="white" />
        </div>
        <span className="sidebar-logo-text">DigiLend Audit</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              className={`nav-item${active ? ' active' : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">D</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Demo User</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Admin</p>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 4, borderRadius: 6, display: 'flex' }}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
