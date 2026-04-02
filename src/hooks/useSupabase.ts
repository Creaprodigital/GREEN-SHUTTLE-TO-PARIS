import { useKV } from '@github/spark/hooks'

export function useSupabase<T>(table: string, defaultValue: T) {
  return useKV<T>(table, defaultValue)
}
