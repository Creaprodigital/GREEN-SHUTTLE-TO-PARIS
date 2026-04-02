import { motion } from 'framer-motion'
import { CheckCircle, Circle } from '@phosphor-icons/react'

interface Step {
  number: number
  title: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-border" />
      <div className="space-y-6">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          
          return (
            <motion.button
              key={step.number}
              onClick={() => onStepClick(step.number)}
              className="relative flex items-start gap-4 w-full text-left group"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative z-10 flex items-center justify-center">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-success text-success-foreground"
                  >
                    <CheckCircle size={24} weight="fill" />
                  </motion.div>
                ) : (
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    isCurrent 
                      ? 'border-accent bg-accent text-accent-foreground' 
                      : 'border-border bg-card text-muted-foreground group-hover:border-accent'
                  }`}>
                    {isCurrent ? (
                      <Circle size={24} weight="fill" />
                    ) : (
                      <span className="font-mono font-semibold text-sm">{step.number}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 pt-1.5">
                <h3 className={`font-semibold transition-colors ${
                  isCurrent ? 'text-accent' : isCompleted ? 'text-success' : 'text-foreground'
                }`}>
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
