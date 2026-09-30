import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BarChart3, FileText, Settings,
  ShieldCheck, Plus, Bell, Search, LogOut, ChevronRight
} from 'lucide-react'

const NAV_GROUPS = [
  {
    group: 'MAIN',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Plus, label: 'New Audit', path: '/audit/new' },
    ]
  },
  {
    group: 'INSIGHTS',
    items: [
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      { icon: FileText, label: 'Reports', path: '/reports' },
    ]
  },
  {
    group: 'SYSTEM',
    items: [
      { icon: Settings, label: 'Settings', path: '/settings' },
    ]
  }
]

export default function AppShell({ children, pageTitle, pageSubtitle, breadcrumbs = [] }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="app-layout">
      {/* ── Enterprise Sidebar ───────────────────────────────────── */}
      <aside className="sidebar">
        {/* Brand Header */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <ShieldCheck size={18} color="white" />
          </div>
          <div>
            <span className="sidebar-logo-text">DigiLend Audit</span>
            <span style={{ display: 'block', fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.05em', marginTop: 1 }}>
              RBI COMPLIANCE
            </span>
          </div>
        </div>

        {/* Grouped Nav */}
        <nav className="sidebar-nav">
          {NAV_GROUPS.map(({ group, items }) => (
            <div key={group} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', padding: '0 12px 6px', margin: 0 }}>
                {group}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map(({ icon: Icon, label, path }) => {
                  const active = location.pathname === path
                  return (
                    <button
                      key={path}
                      className={`nav-item${active ? ' active' : ''}`}
                      onClick={() => navigate(path)}
                    >
                      <Icon size={16} />
                      <span style={{ flex: 1 }}>{label}</span>
                      {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} />}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer User Block */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">D</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Demo Officer
              </p>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Compliance Team</p>
            </div>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 6, borderRadius: 6, display: 'flex' }}
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────── */}
      <div className="main-content">
        {/* Top Header */}
        <header className="app-header">
          {/* Left: Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span
              onClick={() => navigate('/dashboard')}
              style={{ color: '#64748B', fontWeight: 500, cursor: 'pointer' }}
            >
              Home
            </span>
            {breadcrumbs.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ChevronRight size={14} color="#94A3B8" />
                <span
                  onClick={() => b.path && navigate(b.path)}
                  style={{
                    color: i === breadcrumbs.length - 1 ? '#0F172A' : '#64748B',
                    fontWeight: i === breadcrumbs.length - 1 ? 600 : 500,
                    cursor: b.path ? 'pointer' : 'default',
                  }}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Quick Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Global Search Bar */}
            <div className="search-wrap" style={{ width: 220 }}>
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search compliance rules..."
                className="input search-input"
                style={{ height: 36, fontSize: 12.5 }}
              />
            </div>

            {/* Notification Bell */}
            <button
              style={{
                width: 36, height: 36, borderRadius: 8, border: '1px solid #E2E8F0',
                background: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748B', position: 'relative'
              }}
              title="Notifications"
            >
              <Bell size={16} />
              <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: '#EF4444' }} />
            </button>

            {/* Primary Action Button */}
            {location.pathname !== '/audit/new' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/audit/new')}
              >
                <Plus size={14} /> New Audit
              </button>
            )}
          </div>
        </header>

        {/* Page Context Header if titles passed */}
        {pageTitle && (
          <div className="page-header">
            <div>
              <h1 className="page-title">{pageTitle}</h1>
              {pageSubtitle && <p className="page-subtitle">{pageSubtitle}</p>}
            </div>
          </div>
        )}

        {/* Page Body */}
        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  )
}
