import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, suffix = '', trend, color = 'primary', index = 0 }) {
  const colorMap = {
    primary:  { icon: 'bg-primary-100 text-primary-700', border: 'border-primary-200/60' },
    pass:     { icon: 'bg-pass-bg text-pass-dot',         border: 'border-pass-border'     },
    fail:     { icon: 'bg-fail-bg text-fail-dot',         border: 'border-fail-border'     },
    unclear:  { icon: 'bg-unclear-bg text-unclear-dot',   border: 'border-unclear-border'  },
    teal:     { icon: 'bg-teal-500/10 text-teal-600',     border: 'border-teal-500/20'     },
  }
  const c = colorMap[color] || colorMap.primary

  const TrendIcon  = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus
  const trendColor = trend?.direction === 'up'   ? 'text-pass-dot'
                   : trend?.direction === 'down' ? 'text-fail-dot'
                   : 'text-ink-faint'

  return (
    <div
      className={`card p-5 flex flex-col gap-3 animate-slide-up border ${c.border}`}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon} flex-shrink-0`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={13} />
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      <div>
        <div className="text-3xl font-bold text-ink-primary tracking-tight">
          {value}<span className="text-lg font-semibold text-ink-muted">{suffix}</span>
        </div>
        <div className="text-sm text-ink-muted mt-0.5 font-medium">{label}</div>
      </div>
    </div>
  )
}
