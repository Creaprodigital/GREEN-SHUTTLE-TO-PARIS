export interface StripeSettings {
  enabled: boolean
  publicKey: string
  secretKey: string
  webhookSecret: string
}

export const DEFAULT_STRIPE_SETTINGS: StripeSettings = {
  enabled: false,
  publicKey: '',
  secretKey: '',
  webhookSecret: ''
}

export interface StripePaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  clientSecret: string
  created: number
}
