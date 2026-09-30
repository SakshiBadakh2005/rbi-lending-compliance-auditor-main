import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

/**
 * ProgressStep — vertical step list for the analyzing page
 * steps: Array of { label: string, sublabel?: string }
 * activeIndex: 0-based index of the step currently running (-1 = not started, >= steps.length = all done)
 */
export default function ProgressStep({ steps, activeIndex }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isDone    = i < activeIndex
        const isActive  = i === activeIndex
        const isPending = i > activeIndex
        const isLast    = i === steps.length - 1

        return (
          <div key={step.label} className="flex items-start gap-4">
            {/* Icon + connector line */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500
                  ${isDone   ? 'bg-pass-dot border-pass-dot text-white'
                  : isActive  ? 'bg-primary-50 border-primary-700 text-primary-700'
                              : 'bg-white border-surface-border text-ink-faint'}`}
              >
                {isDone
                  ? <CheckCircle2 size={16} />
                  : isActive
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Circle size={14} />
                }
              </div>
              {!isLast && (
                <div className={`w-0.5 h-8 mt-0.5 rounded-full transition-all duration-700 ${isDone ? 'bg-pass-dot' : 'bg-surface-border'}`} />
              )}
            </div>

            {/* Text */}
            <div className="pb-8 pt-1">
              <p className={`text-sm font-semibold transition-colors duration-300
                ${isDone ? 'text-ink-muted line-through' : isActive ? 'text-ink-primary' : 'text-ink-faint'}`}>
                {step.label}
              </p>
              {step.sublabel && (
                <p className={`text-xs mt-0.5 transition-colors ${isActive ? 'text-ink-muted' : 'text-ink-faint'}`}>
                  {step.sublabel}
                </p>
              )}
              {isDone && (
                <p className="text-xs text-pass-dot font-medium mt-0.5 animate-fade-in">Completed ✓</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
