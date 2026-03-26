import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CloudCheck, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface SyncNotificationProps {
  show: boolean
  message: string
  onClose?: () => void
  duration?: number
}

export function SyncNotification({ 
  show, 
  message, 
  onClose,
  duration = 3000 
}: SyncNotificationProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
        >
          <Alert className="bg-accent/10 border-accent shadow-lg">
            <CloudCheck size={20} weight="fill" className="text-accent" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm font-medium">{message}</span>
              {onClose && (
                <button
                  onClick={() => {
                    setIsVisible(false)
                    onClose()
                  }}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} weight="bold" />
                </button>
              )}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
