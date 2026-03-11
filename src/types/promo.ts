export interface PromoCode {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description?: string
  minAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  expiresAt?: number
  createdAt: number
  isActive: boolean
}

export const DEFAULT_PROMO_CODES: PromoCode[] = []
