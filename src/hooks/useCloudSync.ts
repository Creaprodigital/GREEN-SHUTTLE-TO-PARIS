import { useEffect, useCallback, useRef } from 'react'
import { useKV } from '@github/spark/hooks'

interface SyncMetadata {
  lastSyncTimestamp: number
  syncVersion: number
  lastModifiedBy?: string
}

interface CloudSyncOptions {
  syncInterval?: number
  onSyncComplete?: (data: any) => void
  onSyncError?: (error: Error) => void
  onConflict?: (localData: any, cloudData: any) => any
}

export function useCloudSync<T>(
  key: string,
  initialValue: T,
  enabled: boolean = true,
  options?: CloudSyncOptions
) {
  const syncInterval = options?.syncInterval || 5000
  const [data, setData] = useKV<T>(key, initialValue)
  const [syncMeta, setSyncMeta] = useKV<SyncMetadata | null>(`${key}-sync-meta`, null)
  const isSyncing = useRef(false)
  const lastKnownVersion = useRef(syncMeta?.syncVersion || 0)

  const syncFromCloud = useCallback(async () => {
    if (!enabled || isSyncing.current) return

    isSyncing.current = true

    try {
      const cloudData = await spark.kv.get<T>(key)
      const cloudMeta = await spark.kv.get<SyncMetadata>(`${key}-sync-meta`)

      if (cloudMeta && cloudMeta.syncVersion > lastKnownVersion.current) {
        if (options?.onConflict && cloudData !== undefined) {
          const resolvedData = options.onConflict(data, cloudData)
          setData(resolvedData)
        } else if (cloudData !== undefined) {
          setData(cloudData)
        }

        setSyncMeta(cloudMeta)
        lastKnownVersion.current = cloudMeta.syncVersion
        options?.onSyncComplete?.(cloudData)
      }
    } catch (error) {
      options?.onSyncError?.(error as Error)
    } finally {
      isSyncing.current = false
    }
  }, [key, enabled, data, setData, setSyncMeta, options])

  const syncToCloud = useCallback(async (newData: T, modifiedBy?: string) => {
    if (!enabled) return

    try {
      const newVersion = (syncMeta?.syncVersion || 0) + 1
      
      await spark.kv.set(key, newData)
      await spark.kv.set(`${key}-sync-meta`, {
        lastSyncTimestamp: Date.now(),
        syncVersion: newVersion,
        lastModifiedBy: modifiedBy
      })

      setSyncMeta({
        lastSyncTimestamp: Date.now(),
        syncVersion: newVersion,
        lastModifiedBy: modifiedBy
      })

      lastKnownVersion.current = newVersion
    } catch (error) {
      options?.onSyncError?.(error as Error)
    }
  }, [key, enabled, syncMeta, setSyncMeta, options])

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(syncFromCloud, syncInterval)
    
    syncFromCloud()

    return () => clearInterval(interval)
  }, [enabled, syncFromCloud, syncInterval])

  return {
    data,
    setData,
    syncToCloud,
    syncFromCloud,
    isSyncing: isSyncing.current,
    lastSync: syncMeta?.lastSyncTimestamp || 0
  }
}
