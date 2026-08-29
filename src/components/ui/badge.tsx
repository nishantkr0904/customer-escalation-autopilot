import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'severity' | 'status' | 'default'
  level?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'received' | 'enriching' | 'analyzing' | 'triaged' | 'escalated' | 'resolved'
  size?: 'sm' | 'md'
  children?: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  level,
  status,
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700'
  let animationClass = ''

  if (variant === 'severity' || level) {
    switch (level) {
      case 'low':
        colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        break
      case 'medium':
        colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        break
      case 'high':
        colorClasses = 'bg-orange-500/10 text-orange-400 border-orange-500/30'
        break
      case 'critical':
        colorClasses = 'bg-red-500/20 text-red-400 border-red-500/50 font-bold'
        animationClass = 'animate-pulse-critical'
        break
    }
  } else if (variant === 'status' || status) {
    switch (status) {
      case 'received':
        colorClasses = 'bg-slate-500/10 text-slate-400 border-slate-500/30'
        break
      case 'enriching':
        colorClasses = 'bg-sky-500/10 text-sky-400 border-sky-500/30'
        break
      case 'analyzing':
        colorClasses = 'bg-purple-500/10 text-purple-400 border-purple-500/30'
        break
      case 'triaged':
        colorClasses = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
        break
      case 'escalated':
        colorClasses = 'bg-orange-500/10 text-orange-400 border-orange-500/30'
        break
      case 'resolved':
        colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        break
    }
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center tracking-wide font-medium rounded-full border ${sizeClasses} ${colorClasses} ${animationClass} ${className}`}
      {...props}
    >
      {children || (level ? level.toUpperCase() : status ? status.toUpperCase() : '')}
    </span>
  )
}
