import { useState } from 'react'
import { User, Bell, Shield, Database, Palette, Check, Lock, ShieldCheck } from 'lucide-react'
import AppShell from '../components/AppShell.jsx'

const SECTIONS = [
  { icon: User,     label: 'Profile Information', id: 'profile' },
  { icon: Bell,     label: 'Notification Preferences', id: 'notifications' },
  { icon: Shield,   label: 'Security & Access', id: 'security' },
  { icon: Database, label: 'Data & Privacy',  id: 'data' },
  { icon: Palette,  label: 'Appearance',      id: 'appearance' },
]

export default function SettingsPage() {
  const [active, setActive] = useState('profile')
  const [name, setName]     = useState('Demo Officer')
  const [email, setEmail]   = useState('compliance.officer@digilend.io')
  const [org, setOrg]       = useState('DigiLend Technologies Inc.')
  const [saved, setSaved]   = useState(false)

  const [notifications, setNotifications] = useState({
    rbiUpdates: true,
    auditComplete: true,
    weeklyReport: false,
    criticalAlerts: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppShell
      pageTitle="Organization & Account Settings"
      pageSubtitle="Manage workspace credentials, notification preferences, and regulatory audit defaults"
      breadcrumbs={[{ label: 'Settings' }]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
        
        {/* Left Navigation Card */}
        <div className="card" style={{ padding: '8px 0', overflow: 'hidden' }}>
          {SECTIONS.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '12px 18px',
                border: 'none',
                background: active === id ? '#EFF6FF' : 'transparent',
                color: active === id ? '#2563EB' : '#475569',
                fontWeight: active === id ? 700 : 500,
                fontSize: 13.5,
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: active === id ? '3px solid #2563EB' : '3px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Right Content Pane */}
        <div className="card card-p">
          {active === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0F172A' }}>Profile Information</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>Update your administrator and officer identity</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, boxShadow: '0 4px 10px rgba(37,99,235,0.25)' }}>
                  {name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0F172A' }}>{name}</h4>
                  <p style={{ fontSize: 12.5, color: '#64748B', margin: '2px 0 0' }}>{email}</p>
                </div>
                <span className="badge badge-info" style={{ marginLeft: 'auto' }}>Compliance Officer</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label className="label">Work Email Address</label>
                  <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className="label">Regulated Entity / Organization</label>
                  <input className="input" value={org} onChange={e => setOrg(e.target.value)} />
                </div>
                <div>
                  <label className="label">Assigned Role</label>
                  <select className="input" style={{ background: '#FFFFFF' }}>
                    <option>Chief Compliance Officer (CCO)</option>
                    <option>Regulatory Auditor</option>
                    <option>Legal & Policy Risk Officer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid #E2E8F0' }}>
                <button className="btn btn-primary" onClick={handleSave}>
                  {saved ? <><Check size={16} /> Saved!</> : 'Save Profile Changes'}
                </button>
              </div>
            </div>
          )}

          {active === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0F172A' }}>Notification Preferences</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>Configure automated alerts and circular update digests</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'rbiUpdates',     label: 'RBI Regulatory Circular Updates', desc: 'Get notified when superseding RBI digital lending circulars are issued' },
                  { key: 'auditComplete',  label: 'Compliance Scan Completion',      desc: 'Instant notifications when automated document/app checks finish' },
                  { key: 'weeklyReport',   label: 'Weekly Executive Digest',        desc: 'Receive a weekly email summarizing compliance score trends' },
                  { key: 'criticalAlerts', label: 'Critical Red-Flag Alerts',       desc: 'Immediate alerts when severe non-compliance (DL-02, DL-11) is detected' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 }}>{label}</h4>
                      <p style={{ fontSize: 12.5, color: '#64748B', margin: '3px 0 0' }}>{desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                      style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#2563EB' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid #E2E8F0' }}>
                <button className="btn btn-primary" onClick={handleSave}>
                  {saved ? <><Check size={16} /> Saved!</> : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {active === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0F172A' }}>Password & Security Control</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>Manage credentials and active session security</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" placeholder="••••••••" className="input" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid #E2E8F0' }}>
                <button className="btn btn-primary" onClick={handleSave}>
                  {saved ? <><Check size={16} /> Updated!</> : 'Update Security Password'}
                </button>
              </div>
            </div>
          )}

          {active === 'data' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0F172A' }}>Data & Privacy Controls</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>Audit log retention and local cache management</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#F8FAFC' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 }}>Export Audit Ledger</h4>
                    <p style={{ fontSize: 12.5, color: '#64748B', margin: '3px 0 0' }}>Download complete compliance audit history as JSON payload</p>
                  </div>
                  <button className="btn btn-secondary btn-sm">Export Ledger</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', border: '1px solid #FECACA', background: '#FEF2F2', borderRadius: 8 }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#991B1B', margin: 0 }}>Clear Session Cache</h4>
                    <p style={{ fontSize: 12.5, color: '#B91C1C', margin: '3px 0 0' }}>Reset active in-memory audit results</p>
                  </div>
                  <button className="btn btn-sm" style={{ background: '#DC2626', color: '#FFFFFF', border: 'none' }}>Clear Cache</button>
                </div>
              </div>
            </div>
          )}

          {active === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0F172A' }}>Appearance & Theme</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>Customize platform interface display options</p>
              </div>
              <div style={{ padding: '16px 20px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                <p style={{ fontSize: 13.5, color: '#334155', margin: 0 }}>
                  Currently operating in <strong>Enterprise Light Mode</strong>. Dark mode color tokens are configured in design system.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  )
}
