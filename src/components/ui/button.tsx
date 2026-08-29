import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  let variantClasses = 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-glow-indigo'

  switch (variant) {
    case 'secondary':
      variantClasses = 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
      break
    case 'ghost':
      variantClasses = 'bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white'
      break
    case 'danger':
      variantClasses = 'bg-red-600 text-white hover:bg-red-500 shadow-glow-red'
      break
  }

  let sizeClasses = 'px-4 py-2 text-sm'
  if (size === 'sm') sizeClasses = 'px-3 py-1.5 text-xs'
  if (size === 'lg') sizeClasses = 'px-5 py-2.5 text-base font-semibold'

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
