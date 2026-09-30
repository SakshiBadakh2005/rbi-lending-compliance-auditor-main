import { useNavigate } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

/**
 * Breadcrumb component
 * items: Array of { label: string, to?: string }
 * Last item is always the current page (no link, darker text)
 */
export default function Breadcrumb({ items }) {
  const navigate = useNavigate()

  return (
    <nav className="flex items-center gap-1.5 text-xs text-ink-muted" aria-label="Breadcrumb">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1 hover:text-ink-primary transition-colors"
      >
        <Home size={12} />
      </button>

      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-ink-faint" />
            {isLast ? (
              <span className="font-medium text-ink-primary">{item.label}</span>
            ) : (
              <button
                onClick={() => item.to && navigate(item.to)}
                className="hover:text-ink-primary transition-colors"
              >
                {item.label}
              </button>
            )}
          </span>
        )
      })}
    </nav>
  )
}
