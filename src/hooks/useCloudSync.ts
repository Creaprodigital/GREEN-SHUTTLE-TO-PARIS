import { useEffect, useCallback, useRef } from 'react'


interface SyncMetadata {
  lastSyncTimestamp: number
  syncVersion: number
  options?: {
 

) {
  const enable
  const [data, set
    lastSyncT
  })
  const lastKnownVersion = useRef<number

    if (!enabled || i
   
   
      
        const cloudData = await spark.kv.get
  
          lastKnownVersion.current = cloudMeta.syncVe
          options?.onSyncComplete?.(cloudData)
      }
      options?.onS
    
  
  const syncToCloud = useCallback(async (newData: T, modifiedBy?: str


      await spark.kv.set(key, newData)
        lastSyncTimestamp: Date.now(),


        lastSyncTimestamp: Dat
      

    } 
    }

    if (
    const interval = setInterval(syncF
    syncFromCloud()
    return () => clearInterval(interval)

    data,
    syncT
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










