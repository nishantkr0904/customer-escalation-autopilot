import React from 'react'

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  headerAction?: React.ReactNode
  children?: React.ReactNode
  glass?: boolean
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  headerAction,
  children,
  glass = true,
  className = '',
  ...props
}) => {
  const baseClasses = glass
    ? 'glass-panel rounded-xl shadow-glass'
    : 'bg-slate-900/90 border border-slate-800 rounded-xl'

  return (
    <div
      className={`transition-all duration-200 hover:border-slate-700/80 p-5 ${baseClasses} ${className}`}
      {...props}
    >
      {(title || description || headerAction) && (
        <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
            {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
