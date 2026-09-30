import { useNavigate } from 'react-router-dom'
import { ExternalLink, ChevronRight } from 'lucide-react'

const STATUS_CFG = {
  compliant:      { label: 'Compliant',      cls: 'badge-pass'    },
  issues:         { label: 'Issues Found',   cls: 'badge-unclear' },
  'non-compliant':{ label: 'Non-Compliant',  cls: 'badge-fail'    },
}

function ScoreBar({ score }) {
  const color = score >= 80 ? 'bg-pass-dot' : score >= 60 ? 'bg-unclear-dot' : 'bg-fail-dot'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-ink-secondary w-8 text-right">{score}%</span>
    </div>
  )
}

export default function AuditHistoryTable({ audits }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border bg-surface-muted/60">
            {['Audit ID', 'Document', 'App', 'Date', 'Score', 'Status', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-muted whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border bg-white">
          {audits.map((audit, i) => {
            const cfg = STATUS_CFG[audit.status] || STATUS_CFG.issues
            return (
              <tr
                key={audit.id}
                className="group hover:bg-primary-50/40 transition-colors duration-150 animate-fade-in"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Audit ID */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-mono text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded">
                    {audit.id}
                  </span>
                </td>

                {/* Document */}
                <td className="px-4 py-3.5 max-w-[200px]">
                  <p className="text-xs font-medium text-ink-primary truncate" title={audit.documentName}>
                    {audit.documentName}
                  </p>
                </td>

                {/* App */}
                <td className="px-4 py-3.5 max-w-[160px]">
                  <p className="text-xs text-ink-secondary truncate" title={audit.appName}>
                    {audit.appName}
                  </p>
                  <p className="text-[10px] font-mono text-ink-faint mt-0.5 truncate">{audit.appId}</p>
                </td>

                {/* Date */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <p className="text-xs text-ink-secondary">{audit.date}</p>
                  <p className="text-[10px] text-ink-faint">{audit.time}</p>
                </td>

                {/* Score bar */}
                <td className="px-4 py-3.5 w-36">
                  <ScoreBar score={audit.score} />
                  <p className="text-[10px] text-ink-faint mt-1">
                    {audit.rulesPassed}/{audit.totalRules} rules
                  </p>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className={cfg.cls}>{cfg.label}</span>
                </td>

                {/* Action */}
                <td className="px-4 py-3.5 whitespace-nowrap text-right">
                  <button
                    onClick={() => navigate('/audit/results')}
                    className="inline-flex items-center gap-1 text-xs text-primary-700 font-medium 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-150
                               hover:text-primary-800"
                  >
                    View <ChevronRight size={12} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
