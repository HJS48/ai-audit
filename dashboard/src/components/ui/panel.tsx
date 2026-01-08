import { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
}

export function Panel({ children, className = '', title, action }: PanelProps) {
  return (
    <div className={`bg-surface border border-border rounded-lg ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          {title && (
            <h3 className="text-sm font-medium text-text-primary">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}
