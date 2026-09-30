import { CheckCircle2, XCircle, AlertTriangle, FileText, Smartphone, ShieldCheck } from 'lucide-react'

export default function ScoreCard({ total, pass, fail, unclear, docName, appName, scannedAt, scanId }) {
  const pct = Math.round((pass / total) * 100) || 0

  const r    = 46
  const circ = 2 * Math.PI * r
  const strokeColor =
    pct >= 80 ? '#16A34A'
  : pct >= 60 ? '#2563EB'
  : pct >= 40 ? '#D97706'
  :             '#DC2626'

  const grade =
    pct >= 85 ? { label: 'Compliant Portfolio',  cls: 'badge-pass' }
  : pct >= 60 ? { label: 'Satisfactory Audit',    cls: 'badge-info' }
  : pct >= 40 ? { label: 'Attention Required',   cls: 'badge-unclear' }
  :             { label: 'Non-Compliant Audit',  cls: 'badge-fail' }

  return (
    <div className="card card-p">
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center' }}>
        
        {/* Ring & Score Overview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
            <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="55" cy="55" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
              <circle
                cx="55" cy="55" r={r} fill="none"
                stroke={strokeColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ - (pct / 100) * circ}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{pct}%</span>
              <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 3 }}>
                Score
              </span>
            </div>
          </div>

          <div>
            <span className={`badge ${grade.cls}`}>{grade.label}</span>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '8px 0 2px', letterSpacing: '-0.02em' }}>
              {pass} <span style={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>/ {total} rules verified</span>
            </p>
            <p style={{ fontSize: 12.5, color: '#64748B', margin: 0 }}>
              Based on active RBI Digital Lending regulatory frameworks
            </p>
          </div>
        </div>

        {/* Scan Target Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, borderLeft: '1px solid #E2E8F0', paddingLeft: 28 }}>
          {scanId && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: '#64748B', width: 75, fontSize: 12 }}>Audit ID:</span>
              <span style={{ fontWeight: 700, color: '#2563EB', fontFamily: 'monospace', background: '#EFF6FF', padding: '2px 8px', borderRadius: 4, border: '1px solid #BFDBFE' }}>
                {scanId}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ color: '#64748B', width: 75, fontSize: 12 }}>Document:</span>
            <span style={{ color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
              <FileText size={14} color="#2563EB" /> {docName}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ color: '#64748B', width: 75, fontSize: 12 }}>Application:</span>
            <span style={{ color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
              <Smartphone size={14} color="#16A34A" /> {appName}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ color: '#64748B', width: 75, fontSize: 12 }}>Timestamp:</span>
            <span style={{ color: '#64748B', fontSize: 12 }}>{scannedAt}</span>
          </div>
        </div>

        {/* Quick Stat Pill Counters */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ padding: '12px 18px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, textAlign: 'center', minWidth: 72 }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#15803D', margin: 0 }}>{pass}</p>
            <p style={{ fontSize: 10.5, fontWeight: 700, color: '#15803D', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>PASS</p>
          </div>
          <div style={{ padding: '12px 18px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, textAlign: 'center', minWidth: 72 }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#991B1B', margin: 0 }}>{fail}</p>
            <p style={{ fontSize: 10.5, fontWeight: 700, color: '#991B1B', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>FAIL</p>
          </div>
          <div style={{ padding: '12px 18px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, textAlign: 'center', minWidth: 72 }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#92400E', margin: 0 }}>{unclear}</p>
            <p style={{ fontSize: 10.5, fontWeight: 700, color: '#92400E', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>UNCLEAR</p>
          </div>
        </div>

      </div>
    </div>
  )
}
