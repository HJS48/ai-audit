interface CostCardProps {
  label: string
  value: string
  subValue?: string
  variant?: 'danger' | 'warning' | 'success' | 'info' | 'default'
  size?: 'sm' | 'lg'
}

const variantStyles = {
  danger: 'border-danger/30 bg-gradient-to-br from-danger/10 to-transparent',
  warning: 'border-warning/30 bg-gradient-to-br from-warning/10 to-transparent',
  success: 'border-success/30 bg-gradient-to-br from-success/10 to-transparent',
  info: 'border-info/30 bg-gradient-to-br from-info/10 to-transparent',
  default: 'border-border bg-surface',
}

const textVariantStyles = {
  danger: 'text-danger',
  warning: 'text-warning',
  success: 'text-success',
  info: 'text-info',
  default: 'text-text-primary',
}

export function CostCard({
  label,
  value,
  subValue,
  variant = 'default',
  size = 'sm',
}: CostCardProps) {
  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]}`}>
      <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className={`font-mono font-semibold ${textVariantStyles[variant]} ${
          size === 'lg' ? 'text-3xl' : 'text-xl'
        }`}
      >
        {value}
      </p>
      {subValue && (
        <p className="text-sm text-text-muted mt-1">{subValue}</p>
      )}
    </div>
  )
}
