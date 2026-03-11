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

export interface RoundTripDiscount {
  enabled: boolean
  type: 'percentage' | 'fixed'
  value: number
  description?: string
}

export const DEFAULT_PROMO_CODES: PromoCode[] = []

export const DEFAULT_ROUNDTRIP_DISCOUNT: RoundTripDiscount = {
  enabled: false,
  type: 'percentage',
  value: 0,
  description: 'Réduction aller-retour'
}
