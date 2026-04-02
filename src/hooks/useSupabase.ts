import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useKV } from '@github/spark/hooks'

type SupabaseTable = 
  | 'fleet'
  | 'bookings'
  | 'pricing'
  | 'service_options'
  | 'circuits'
  | 'pricing_zones'
  | 'zone_forfaits'
  | 'promo_codes'
  | 'admin_accounts'
  | 'system_settings'

export function useSupabase<T>(table: SupabaseTable, defaultValue: T) {
  const useSupabaseBackend = isSupabaseConfigured()
  
  const [kvData, setKvData, deleteKvData] = useKV<T>(table, defaultValue)
  const [supabaseData, setSupabaseData] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchFromSupabase = useCallback(async () => {
    if (!useSupabaseBackend) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      if (table === 'system_settings') {
        const { data, error } = await supabase
          .from(table)
          .select('*')
        
        if (error) throw error
        
        const settingsObj = {} as T
        if (data && Array.isArray(data)) {
          data.forEach((item: { key: string; value: unknown }) => {
            settingsObj[item.key as keyof T] = item.value as T[keyof T]
          })
        }
        setSupabaseData(settingsObj)
      } else {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: true })
        
        if (error) throw error
        setSupabaseData((data || defaultValue) as T)
      }
      
      setError(null)
    } catch (err) {
      console.error(`Erreur lors du chargement de ${table}:`, err)
      setError(err as Error)
      setSupabaseData(defaultValue)
    } finally {
      setIsLoading(false)
    }
  }, [table, defaultValue, useSupabaseBackend])

  useEffect(() => {
    if (useSupabaseBackend) {
      fetchFromSupabase()

      const channel = supabase
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
          },
          () => {
            fetchFromSupabase()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [fetchFromSupabase, table, useSupabaseBackend])

  const saveToSupabase = useCallback(async (newData: T) => {
    if (!useSupabaseBackend) return

    try {
      if (table === 'system_settings') {
        const entries = Object.entries(newData as object)
        for (const [key, value] of entries) {
          await supabase
            .from(table)
            .upsert({ key, value }, { onConflict: 'key' })
        }
      } else if (Array.isArray(newData)) {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .neq('id', '')

        if (deleteError) throw deleteError

        if (newData.length > 0) {
          const { error: insertError } = await supabase
            .from(table)
            .insert(newData)

          if (insertError) throw insertError
        }
      } else {
        await supabase
          .from(table)
          .upsert(newData, { onConflict: 'id' })
      }
      
      setError(null)
    } catch (err) {
      console.error(`Erreur lors de la sauvegarde dans ${table}:`, err)
      setError(err as Error)
      throw err
    }
  }, [table, useSupabaseBackend])

  const setValue = useCallback((updater: T | ((prev: T) => T)) => {
    if (useSupabaseBackend) {
      setSupabaseData((prev) => {
        const newValue = typeof updater === 'function' 
          ? (updater as (prev: T) => T)(prev) 
          : updater
        saveToSupabase(newValue)
        return newValue
      })
    } else {
      setKvData(updater)
    }
  }, [useSupabaseBackend, setKvData, saveToSupabase])

  const deleteValue = useCallback(async () => {
    if (useSupabaseBackend) {
      try {
        await supabase
          .from(table)
          .delete()
          .neq('id', '')
        
        setSupabaseData(defaultValue)
        setError(null)
      } catch (err) {
        console.error(`Erreur lors de la suppression de ${table}:`, err)
        setError(err as Error)
        throw err
      }
    } else {
      deleteKvData()
    }
  }, [useSupabaseBackend, table, defaultValue, deleteKvData])

  const data = useSupabaseBackend ? supabaseData : kvData

  return [data, setValue, deleteValue, { isLoading, error, isSupabase: useSupabaseBackend }] as const
}

export async function insertIntoSupabase<T extends { id: string }>(
  table: SupabaseTable,
  item: T
): Promise<T | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase non configuré')
    return null
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data as T
  } catch (err) {
    console.error(`Erreur lors de l'insertion dans ${table}:`, err)
    throw err
  }
}

export async function updateInSupabase<T extends { id: string }>(
  table: SupabaseTable,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase non configuré')
    return null
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as T
  } catch (err) {
    console.error(`Erreur lors de la mise à jour dans ${table}:`, err)
    throw err
  }
}

export async function deleteFromSupabase(
  table: SupabaseTable,
  id: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase non configuré')
    return
  }

  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (err) {
    console.error(`Erreur lors de la suppression dans ${table}:`, err)
    throw err
  }
}
