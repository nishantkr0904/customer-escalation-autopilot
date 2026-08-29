import React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'circle'
  width?: string
  height?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  ...props
}) => {
  let roundedClass = 'rounded-md'
  if (variant === 'circle') roundedClass = 'rounded-full'
  if (variant === 'card') roundedClass = 'rounded-xl'

  let defaultSize = 'h-4 w-full'
  if (variant === 'circle') defaultSize = 'h-10 w-10'
  if (variant === 'card') defaultSize = 'h-32 w-full'

  const style: React.CSSProperties = {}
  if (width) style.width = width
  if (height) style.height = height

  return (
    <div
      className={`relative overflow-hidden bg-slate-800/80 ${roundedClass} ${defaultSize} ${className}`}
      style={style}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-700/40 to-transparent animate-shimmer" />
    </div>
  )
}
