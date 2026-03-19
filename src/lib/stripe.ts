import { loadStripe, Stripe } from '@stripe/stripe-js'
import { StripeSettings } from '@/types/stripe'

let stripeInstance: Stripe | null = null

export const initializeStripe = async (publicKey: string): Promise<Stripe | null> => {
  if (!publicKey) {
    console.warn('⚠️ Stripe public key is missing')
    return null
  }

  try {
    stripeInstance = await loadStripe(publicKey)
    return stripeInstance
  } catch (error) {
    console.error('❌ Error initializing Stripe:', error)
    return null
  }
}

export const getStripe = (): Stripe | null => {
  return stripeInstance
}

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'eur',
  metadata: Record<string, string> = {}
): Promise<{ clientSecret: string; paymentIntentId: string } | null> => {
  try {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        metadata
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }

    const data = await response.json()
    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId
    }
  } catch (error) {
    console.error('❌ Error creating payment intent:', error)
    return null
  }
}

export const confirmCardPayment = async (
  clientSecret: string,
  cardElement: any
): Promise<{ success: boolean; error?: string }> => {
  if (!stripeInstance) {
    return { success: false, error: 'Stripe not initialized' }
  }

  try {
    const result = await stripeInstance.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    })

    if (result.error) {
      return { success: false, error: result.error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Error confirming payment:', error)
    return { success: false, error: 'Payment confirmation failed' }
  }
}

export const handleWebhookEvent = async (
  event: any,
  settings: StripeSettings
): Promise<{ success: boolean; message: string }> => {
  console.log('🔔 Stripe webhook event received:', event.type)

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('✅ Payment succeeded:', event.data.object.id)
      return { success: true, message: 'Payment succeeded' }

    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', event.data.object.id)
      return { success: true, message: 'Payment failed' }

    case 'charge.succeeded':
      console.log('✅ Charge succeeded:', event.data.object.id)
      return { success: true, message: 'Charge succeeded' }

    case 'charge.failed':
      console.log('❌ Charge failed:', event.data.object.id)
      return { success: true, message: 'Charge failed' }

    default:
      console.log('ℹ️ Unhandled event type:', event.type)
      return { success: true, message: 'Event received' }
  }
}
