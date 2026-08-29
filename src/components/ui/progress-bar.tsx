import React from 'react'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep?: number
  totalSteps?: number
  percentage?: number
  label?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  percentage,
  label,
  className = '',
  ...props
}) => {
  const calculatedPercentage =
    percentage !== undefined
      ? percentage
      : currentStep !== undefined && totalSteps !== undefined && totalSteps > 0
      ? Math.round((currentStep / totalSteps) * 100)
      : 0

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="flex justify-between items-center mb-1.5 text-xs text-slate-400 font-medium">
        <span>{label || 'Progress'}</span>
        <span>
          {currentStep !== undefined && totalSteps !== undefined
            ? `${currentStep}/${totalSteps} (${calculatedPercentage}%)`
            : `${calculatedPercentage}%`}
        </span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-300 ease-out shadow-glow-indigo"
          style={{ width: `${Math.min(Math.max(calculatedPercentage, 0), 100)}%` }}
        />
      </div>
    </div>
  )
}
