import { useState } from 'react'
import {
  CheckCircle2, XCircle, AlertTriangle,
  ChevronDown, ChevronUp, Quote,
  MinusCircle, Ban, Cpu, Brain, GitMerge
} from 'lucide-react'

const STATUS_CONFIG = {
  pass: {
    badge: 'badge badge-pass',
    icon: CheckCircle2,
    iconColor: '#16A34A',
    label: 'PASS',
    leftBar: '#16A34A',
  },
  fail: {
    badge: 'badge badge-fail',
    icon: XCircle,
    iconColor: '#DC2626',
    label: 'FAIL',
    leftBar: '#DC2626',
  },
  unclear: {
    badge: 'badge badge-unclear',
    icon: AlertTriangle,
    iconColor: '#D97706',
    label: 'UNCLEAR',
    leftBar: '#D97706',
  },
  not_verifiable: {
    badge: 'badge badge-muted',
    icon: Ban,
    iconColor: '#64748B',
    label: 'NOT VERIFIABLE',
    leftBar: '#94A3B8',
  },
  skipped: {
    badge: 'badge badge-muted',
    icon: MinusCircle,
    iconColor: '#94A3B8',
    label: 'SKIPPED',
    leftBar: '#E2E8F0',
  },
}

function MethodBadge({ automationLevel, checkType }) {
  if (!automationLevel) return null

  let Icon  = Cpu
  let label = 'Deterministic Code'
  let color = '#2563EB'
  let bg    = '#EFF6FF'

  if (automationLevel === 'not_automatable') {
    Icon  = Ban
    label = 'Not Automatable'
    color = '#64748B'
    bg    = '#F8FAFC'
  } else if (automationLevel === 'partially_automatable') {
    Icon  = GitMerge
    label = 'Partial Verification'
    color = '#92400E'
    bg    = '#FFFBEB'
  } else if (checkType === 'permission_list') {
    Icon  = Cpu
    label = 'Manifest Code Check'
    color = '#2563EB'
    bg    = '#EFF6FF'
  } else {
    Icon  = Brain
    label = 'AI Semantic Check'
    color = '#7C3AED'
    bg    = '#F5F3FF'
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: bg, color, border: '1px solid rgba(0,0,0,0.05)' }}>
      <Icon size={12} />
      {label}
    </span>
  )
}

export default function RuleCard({ rule }) {
  const [expanded, setExpanded] = useState(true)
  const cfg  = STATUS_CONFIG[rule.status] || STATUS_CONFIG.unclear
  const Icon = cfg.icon

  const dimmed = rule.status === 'skipped' || rule.status === 'not_verifiable'

  return (
    <div
      className="card card-hover"
      style={{
        position: 'relative',
        overflow: 'hidden',
        opacity: dimmed ? 0.8 : 1,
        borderLeft: `4px solid ${cfg.leftBar}`,
        marginBottom: 12
      }}
    >
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 0 }}>
            <div style={{ marginTop: 2, flexShrink: 0 }}>
              <Icon size={18} color={cfg.iconColor} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Badges row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, fontFamily: 'monospace', color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: 4, border: '1px solid #BFDBFE' }}>
                  {rule.id}
                </span>
                {rule.family && (
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: '#334155', background: '#F1F5F9', padding: '2px 8px', borderRadius: 4, border: '1px solid #E2E8F0' }}>
                    {rule.family}
                  </span>
                )}
                <MethodBadge
                  automationLevel={rule.automationLevel}
                  checkType={rule.checkType}
                />
              </div>

              {/* Requirement text */}
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: '0 0 6px', lineHeight: 1.45 }}>
                {rule.rule}
              </h4>

              {/* Citation */}
              <p style={{ fontSize: 12, color: '#64748B', margin: 0, fontFamily: 'monospace' }}>
                Ref: {rule.reference}
              </p>

              {/* Partial notice */}
              {rule.partialFlag && rule.partialReason && (
                <div style={{ fontSize: 12, color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '6px 10px', margin: '8px 0 0', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <GitMerge size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>Partial verification: </strong>{rule.partialReason}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span className={cfg.badge}>{cfg.label}</span>
            {rule.evidence && rule.status !== 'skipped' && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="btn btn-ghost btn-sm"
                style={{ padding: 4, color: '#64748B' }}
                title={expanded ? 'Collapse evidence' : 'Expand evidence'}
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Evidence & Reasoning panel */}
        {expanded && rule.evidence && (
          <div className="evidence-block" style={{ marginTop: 14, marginLeft: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Quote size={12} color="#2563EB" />
              {rule.status === 'not_verifiable' ? 'Limitation / Regulatory Reason' : 'Extracted Evidence & Regulatory Assessment'}
            </div>
            <p style={{ fontSize: 13, color: '#1E293B', margin: 0, lineHeight: 1.55 }}>
              {rule.evidence}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
