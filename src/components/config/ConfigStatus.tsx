import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Database, Key } from '@phosphor-icons/react'
import { isSupabaseConfigured } from '@/lib/supabase'
import { motion } from 'framer-motion'

export function ConfigStatus() {
  const isConfigured = isSupabaseConfigured()
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  const hasUrl = Boolean(url)
  const hasKey = Boolean(key)

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Database size={24} className="text-primary" />
            Configuration Status
          </h3>
          <p className="text-sm text-muted-foreground">
            Current state of your Supabase configuration
          </p>
        </div>

        <div className="space-y-3">
          <StatusItem
            icon={<Database size={20} />}
            label="Project URL"
            value={hasUrl ? url : 'Not configured'}
            isConfigured={hasUrl}
            masked={false}
          />
          <StatusItem
            icon={<Key size={20} />}
            label="API Key"
            value={hasKey ? `${key.substring(0, 20)}...` : 'Not configured'}
            isConfigured={hasKey}
            masked={true}
          />
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Status</span>
            <Badge variant={isConfigured ? 'default' : 'secondary'} className={isConfigured ? 'bg-success text-success-foreground' : ''}>
              {isConfigured ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <CheckCircle size={16} weight="fill" />
                  <span>Configured</span>
                </motion.div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <XCircle size={16} weight="fill" />
                  <span>Not Configured</span>
                </div>
              )}
            </Badge>
          </div>
          {!isConfigured && (
            <p className="text-sm text-muted-foreground mt-2">
              Follow the steps below to configure Supabase
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

interface StatusItemProps {
  icon: React.ReactNode
  label: string
  value: string
  isConfigured: boolean
  masked?: boolean
}

function StatusItem({ icon, label, value, isConfigured }: StatusItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
      <div className={`mt-0.5 ${isConfigured ? 'text-success' : 'text-muted-foreground'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-medium">{label}</span>
          {isConfigured ? (
            <CheckCircle size={16} className="text-success flex-shrink-0" weight="fill" />
          ) : (
            <XCircle size={16} className="text-muted-foreground flex-shrink-0" weight="fill" />
          )}
        </div>
        <p className="text-xs font-mono text-muted-foreground truncate">
          {value}
        </p>
      </div>
    </div>
  )
}
