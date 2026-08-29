import React from 'react'

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'healthy' | 'degraded' | 'down' | 'unknown'
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = 'healthy',
  label,
  showLabel = true,
  size = 'md',
  className = '',
  ...props
}) => {
  let colorClasses = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
  let defaultLabel = 'Healthy'

  switch (status) {
    case 'degraded':
      colorClasses = 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
      defaultLabel = 'Degraded'
      break
    case 'down':
      colorClasses = 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]'
      defaultLabel = 'Down'
      break
    case 'unknown':
      colorClasses = 'bg-slate-500'
      defaultLabel = 'Unknown'
      break
  }

  let dotSize = 'h-2.5 w-2.5'
  if (size === 'sm') dotSize = 'h-2 w-2'
  if (size === 'lg') dotSize = 'h-3.5 w-3.5'

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} {...props}>
      <span className={`rounded-full ${dotSize} ${colorClasses} shrink-0`} />
      {showLabel && (
        <span className="text-xs font-medium text-slate-300">
          {label || defaultLabel}
        </span>
      )}
    </div>
  )
}
