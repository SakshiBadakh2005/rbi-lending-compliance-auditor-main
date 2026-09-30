import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, TrendingUp, CheckCircle2, AlertTriangle, Clock, ArrowUpRight, ShieldCheck, ChevronRight, FileText } from 'lucide-react'
import AppShell from '../components/AppShell.jsx'
import { mockAuditHistory, mockDashboardStats } from '../mockData.js'

function scoreColor(s) {
  if (s >= 80) return '#16A34A'
  if (s >= 60) return '#D97706'
  return '#DC2626'
}

function statusBadge(raw = '') {
  const s = raw.toLowerCase()
  if (s === 'compliant')     return { label: 'Compliant',     cls: 'badge-pass' }
  if (s === 'non-compliant') return { label: 'Non-Compliant', cls: 'badge-fail' }
  return                            { label: 'Issues Found',  cls: 'badge-unclear' }
}

/* ── Count-Up Hook ──────────────────────────────── */
function useCountUp(target, duration = 800) {
  const [disp, setDisp] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    const numStr = String(target).replace(/[^0-9.]/g, '')
    const end = parseFloat(numStr)
    if (isNaN(end)) { setDisp(target); return }
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisp(Math.round(eased * end))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])
  const suffix = String(target).replace(/^[0-9.]+/, '')
  return suffix ? disp + suffix : disp
}

/* ── Animated Score Bar ──────────────────────────── */
function AnimatedScoreBar({ score, color }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = `${score}%` }))
  }, [score])
  return <div ref={ref} className="animated-bar" style={{ background: color }} />
}

/* ── Stat Card ──────────────────────────────────── */
function StatCard({ label, value, trend, isPos, icon: Icon, color, delay }) {
  const animated = useCountUp(value)
  return (
    <motion.div
      className="stat-card card-hover"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="stat-label">{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div className="stat-value">{animated}</div>
      <div className="stat-trend" style={{ color: isPos ? '#16A34A' : '#DC2626' }}>
        <ArrowUpRight size={14} style={{ transform: isPos ? 'none' : 'rotate(90deg)' }} />
        <span>{trend}</span>
      </div>
    </motion.div>
  )
}

/* ── Circular Progress Gauge ────────────────────────── */
function ComplianceGauge({ pct }) {
  const r = 44, sw = 7
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = scoreColor(pct)

  return (
    <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={110} height={110} viewBox="0 0 110 110">
        <circle cx={55} cy={55} r={r} fill="none" stroke="#F1F5F9" strokeWidth={sw} />
        <circle
          cx={55} cy={55} r={r} fill="none"
          stroke={color} strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', display: 'block', lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 3 }}>
          Rate
        </span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const s = mockDashboardStats
  const pct = Math.round((s.compliantCount / s.totalAudits) * 100)

  const STATS = [
    { label: 'Total Audits Evaluated', value: s.totalAudits, trend: '+12.5% vs last month', isPos: true, icon: Clock, color: '#2563EB' },
    { label: 'Compliant Lenders', value: s.compliantCount, trend: `${pct}% compliance rate`, isPos: true, icon: CheckCircle2, color: '#16A34A' },
    { label: 'Issues Flagged', value: s.totalAudits - s.compliantCount, trend: '3 critical non-compliances', isPos: false, icon: AlertTriangle, color: '#DC2626' },
    { label: 'Average Compliance Score', value: s.avgScore + '%', trend: '+5.2 pts improvement', isPos: true, icon: TrendingUp, color: '#7C3AED' },
  ]

  const filtered = mockAuditHistory.filter(a =>
    !search ||
    a.documentName.toLowerCase().includes(search.toLowerCase()) ||
    a.appName.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppShell
      pageTitle="Compliance Command Center"
      pageSubtitle="Overview of RBI digital lending audits, risk alerts, and recent application reviews"
      breadcrumbs={[{ label: 'Dashboard' }]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Top 4 KPI Metric Cards — staggered fade-in-up */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {STATS.map(({ label, value, trend, isPos, icon, color }, i) => (
            <StatCard key={label} label={label} value={value} trend={trend} isPos={isPos} icon={icon} color={color} delay={i * 0.08} />
          ))}
        </div>

        {/* Main Grid: Compliance Gauge + SaaS Data Table */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>
          
          {/* Left: Compliance Health Summary Card */}
          <div className="card card-p" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px', width: '100%', textAlign: 'left' }}>
              Overall Portfolio Health
            </h3>

            <ComplianceGauge pct={pct} />

            <div style={{ width: '100%', marginTop: 24, paddingTop: 20, borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} /> Compliant
                </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{s.compliantCount} ({pct}%)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} /> Non-Compliant
                </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{s.totalAudits - s.compliantCount} ({100 - pct}%)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} /> Total Evaluated
                </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{s.totalAudits}</span>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: 20 }}
              onClick={() => navigate('/audit/new')}
            >
              <Plus size={14} /> Start New Compliance Audit
            </button>
          </div>

          {/* Right: SaaS Audit History Data Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Recent Compliance Audits</h3>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Latest lending application and document evaluations</p>
              </div>

              <div className="search-wrap" style={{ width: 220 }}>
                <Search size={14} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Filter audits..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input search-input"
                  style={{ height: 34, fontSize: 12.5 }}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Audit ID</th>
                    <th>Document Name</th>
                    <th>Application</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 6).map(a => {
                    const st = statusBadge(a.status)
                    return (
                      <tr key={a.id}>
                        <td>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '3px 8px', borderRadius: 5, fontFamily: 'monospace', border: '1px solid #BFDBFE' }}>
                            {a.id}
                          </span>
                        </td>
                        <td style={{ maxWidth: 200 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, fontSize: 13, color: '#0F172A' }} title={a.documentName}>
                            {a.documentName}
                          </div>
                        </td>
                        <td style={{ maxWidth: 150 }}>
                          <div style={{ fontSize: 12.5, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={a.appName}>
                            {a.appName}
                          </div>
                        </td>
                        <td style={{ color: '#64748B', fontSize: 12.5, whiteSpace: 'nowrap' }}>{a.date}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 110 }}>
                            <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
                              <AnimatedScoreBar score={a.score} color={scoreColor(a.score)} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', minWidth: 34 }}>{a.score}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${st.cls}`}>{st.label}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => navigate('/audit/results')}
                            style={{ padding: '4px 10px', fontSize: 12 }}
                          >
                            View Audit <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Risk Insights Cards — staggered entrance */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <motion.div
            className="card card-p card-hover"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={16} color="#DC2626" />
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>Highest Risk Area</h4>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#DC2626', margin: '0 0 4px' }}>Penal Charges Wording (DL-02)</p>
            <p style={{ fontSize: 12.5, color: '#64748B', margin: 0 }}>54% pass rate across audited loans. Prohibited "penal interest" phrasing detected.</p>
          </motion.div>

          <motion.div
            className="card card-p card-hover"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.40, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={16} color="#D97706" />
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>Most Common Issue</h4>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#D97706', margin: '0 0 4px' }}>App Permission Access (DL-11)</p>
            <p style={{ fontSize: 12.5, color: '#64748B', margin: 0 }}>65% compliance. Banned permissions (SMS, Contacts) frequently declared in manifests.</p>
          </motion.div>

          <motion.div
            className="card card-p card-hover"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={16} color="#16A34A" />
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>Top Performing Category</h4>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#16A34A', margin: '0 0 4px' }}>KFS Core Disclosure (DL-01)</p>
            <p style={{ fontSize: 12.5, color: '#64748B', margin: 0 }}>92% compliance rate. Loan amount, APR, and EPI schedules reliably present.</p>
          </motion.div>
        </div>

      </div>
    </AppShell>
  )
}
