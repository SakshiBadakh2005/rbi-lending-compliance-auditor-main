import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Download, Eye, Calendar, Search, Filter, CheckCircle2, XCircle, AlertTriangle, ChevronRight } from 'lucide-react'
import AppShell from '../components/AppShell.jsx'
import { mockAuditHistory } from '../mockData.js'

function AnimatedScoreBar({ score, color }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = `${score}%` }))
  }, [score])
  return <div ref={ref} className="animated-bar" style={{ background: color }} />
}

function normalizeStatus(raw) {
  if (!raw) return 'Issues Found'
  const s = raw.toLowerCase()
  if (s === 'compliant') return 'Compliant'
  if (s === 'non-compliant' || s === 'noncompliant') return 'Non-Compliant'
  return 'Issues Found'
}

const STATUS_MAP = {
  'Compliant':     { badge: 'badge-pass',    icon: CheckCircle2 },
  'Issues Found':  { badge: 'badge-unclear', icon: AlertTriangle },
  'Non-Compliant': { badge: 'badge-fail',    icon: XCircle },
}

function scoreColor(s) {
  if (s >= 80) return '#16A34A'
  if (s >= 60) return '#D97706'
  return '#DC2626'
}

export default function ReportsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = mockAuditHistory.filter(a => {
    const matchSearch = a.documentName?.toLowerCase().includes(search.toLowerCase()) ||
                        a.appName?.toLowerCase().includes(search.toLowerCase()) ||
                        a.id?.toLowerCase().includes(search.toLowerCase())
    const displayStatus = normalizeStatus(a.status)
    const matchFilter = filter === 'All' || displayStatus === filter
    return matchSearch && matchFilter
  })

  return (
    <AppShell
      pageTitle="Compliance Audit Reports"
      pageSubtitle="Generate, review, and export regulatory audit certificates and report packages"
      breadcrumbs={[{ label: 'Reports' }]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Filter & Search Bar */}
        <div className="card card-p" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 260, maxWidth: 400 }}>
            <Search size={14} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search reports by ID, document, or app..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input search-input"
              style={{ height: 36, fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: '#64748B', fontWeight: 600 }}>Filter:</span>
            {['All', 'Compliant', 'Issues Found', 'Non-Compliant'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                style={{ height: 32, fontSize: 12 }}
              >
                {f}
              </button>
            ))}
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
            <Download size={14} /> Export All ({filtered.length})
          </button>
        </div>

        {/* Reports Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map((audit) => {
            const displayStatus = normalizeStatus(audit.status)
            const statusInfo = STATUS_MAP[displayStatus] || STATUS_MAP['Issues Found']
            const StatusIcon = statusInfo.icon
            return (
              <div key={audit.id} className="card card-p card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '3px 8px', borderRadius: 4, fontFamily: 'monospace', border: '1px solid #BFDBFE' }}>
                      {audit.id}
                    </span>
                    <span className={`badge ${statusInfo.badge}`}>
                      <StatusIcon size={12} />
                      {displayStatus}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', lineHeight: 1.35 }} title={audit.documentName}>
                    {audit.documentName || 'Key Fact Statement'}
                  </h3>
                  <p style={{ fontSize: 12.5, color: '#64748B', margin: 0 }}>App: <strong>{audit.appName || 'Lending App'}</strong></p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Compliance Score</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{audit.score}%</span>
                  </div>
                  <div style={{ height: 6, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
                    <AnimatedScoreBar score={audit.score} color={scoreColor(audit.score)} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
                  <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={13} /> {audit.date}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/audit/results')}>
                      <Eye size={13} /> View Audit
                    </button>
                    <button className="btn btn-ghost btn-sm" title="Export PDF">
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="card card-p text-center" style={{ padding: 60 }}>
            <FileText size={40} color="#94A3B8" style={{ margin: '0 auto 14px' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>No compliance reports found</h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>Try adjusting your search query or status filter</p>
          </div>
        )}

      </div>
    </AppShell>
  )
}
