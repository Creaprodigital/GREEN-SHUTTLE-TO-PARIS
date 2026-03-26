import { useEffect, useCallback, useRef } from 'react'
import { useKV } from '@github/spark/hooks'

  lastModifiedBy?: strin

  key: string,
  options?: {
 

) {
  const enable
  const [data, set
  options?: {
    onSyncComplete?: (data: T) => void
    onSyncError?: (error: Error) => void
    syncInterval?: number
    enabled?: boolean
  }
) {
  const syncInterval = options?.syncInterval || 2000
  const enabled = options?.enabled !== false
  
  const [data, setData] = useKV<T>(key, defaultValue)
  const [syncMeta, setSyncMeta] = useKV<SyncMetadata>(`${key}-sync-meta`, {
    lastSyncTimestamp: Date.now(),
    syncVersion: 0
    
  
  const lastKnownVersion = useRef<number>(syncMeta?.syncVersion || 0)
  const isSyncing = useRef(false)

  const syncFromCloud = useCallback(async () => {
    if (!enabled || isSyncing.current) return

    try {
      isSyncing.current = true
      
      const cloudMeta = await spark.kv.get<SyncMetadata>(`${key}-sync-meta`)
      
      if (cloudMeta && cloudMeta.syncVersion > lastKnownVersion.current) {
        const cloudData = await spark.kv.get<T>(key)
        
        if (cloudData !== undefined) {
          setData(cloudData)
          lastKnownVersion.current = cloudMeta.syncVersion
          
      setSyncMeta({
        }
       
    } catch (error) {
      options?.onSyncError?.(error as Error)
    } finally {
      isSyncing.current = false
    }
  }, [key, enabled, setData, options])

  const syncToCloud = useCallback(async (newData: T, modifiedBy?: string) => {
    if (!enabled) return

    try {
      const newVersion = (syncMeta?.syncVersion || 0) + 1
      
    setData,
      await spark.kv.set(`${key}-sync-meta`, {
    syncMeta,
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

  }, [key, enabled, syncMeta, setSyncMeta, options])

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(syncFromCloud, syncInterval)
    



  }, [enabled, syncInterval, syncFromCloud])

  return {

    setData,
    syncToCloud,
    syncFromCloud,




