import { CloudArrowUp, CloudCheck, CloudWarning, CloudSlash } from '@phosphor-icons/react'

interface CloudSyncIndicatorProps {
  status: 'idle' | 'syncing' | 'synced' | 'error'
  isLatestVersion?: boolean
  lastModifiedBy?: string
  lastSyncTimestamp?: number
  compact?: boolean
}

export function CloudSyncIndicator({
  status,
  isLatestVersion = true,
  lastModifiedBy,
  lastSyncTimestamp,
  compact = false
}: CloudSyncIndicatorProps) {
  const getIcon = () => {
    if (status === 'syncing') {
      return <CloudArrowUp size={compact ? 16 : 20} weight="fill" className="text-accent animate-bounce" />
    }
    if (status === 'synced') {
      return <CloudCheck size={compact ? 16 : 20} weight="fill" className="text-accent" />
    }
    if (status === 'error') {
      return <CloudSlash size={compact ? 16 : 20} weight="fill" className="text-destructive" />
    }
    if (!isLatestVersion) {
      return <CloudWarning size={compact ? 16 : 20} weight="fill" className="text-destructive" />
    }
    return <CloudCheck size={compact ? 16 : 20} weight="fill" className="text-muted-foreground" />
  }

  const getStatusText = () => {
    if (status === 'syncing') return 'Synchronisation...'
    if (status === 'synced') return 'Synchronisé'
    if (status === 'error') return 'Erreur de sync'
    if (!isLatestVersion) return 'Nouvelle version disponible'
    return 'Cloud'
  }

  return (
    <div className="flex items-center gap-2">
      {getIcon()}
      {!compact && (
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{getStatusText()}</span>
          {lastModifiedBy && lastSyncTimestamp && status === 'idle' && (
            <span className="text-[10px] text-muted-foreground">
              Par {lastModifiedBy} • {new Date(lastSyncTimestamp).toLocaleTimeString('fr-FR')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
