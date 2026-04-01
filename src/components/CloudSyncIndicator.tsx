import { Database, CheckCircle } from '@phosphor-icons/react'

interface CloudSyncIndicatorProps {
  status?: 'idle' | 'syncing' | 'synced' | 'error'
  isLatestVersion?: boolean
  lastModifiedBy?: string
  lastSyncTimestamp?: number
  compact?: boolean
}

export function CloudSyncIndicator({
  status = 'synced',
  compact = false
}: CloudSyncIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <Database size={compact ? 16 : 20} weight="fill" className="text-accent" />
      {!compact && (
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <CheckCircle size={12} weight="fill" className="text-accent" />
            Base de données
          </span>
        </div>
      )}
    </div>
  )
}
