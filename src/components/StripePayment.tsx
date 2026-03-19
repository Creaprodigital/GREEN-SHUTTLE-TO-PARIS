import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Lock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { initializeStripe } from '@/lib/stripe'
import { StripeSettings } from '@/types/stripe'

interface StripePaymentProps {
  amount: number
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
  stripeSettings: StripeSettings
  bookingMetadata?: Record<string, string>
}

export default function StripePayment({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError,
  stripeSettings,
  bookingMetadata = {}
}: StripePaymentProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [stripeLoaded, setStripeLoaded] = useState(false)

  useEffect(() => {
    const loadStripeSDK = async () => {
      if (stripeSettings.enabled && stripeSettings.publicKey) {
        const stripe = await initializeStripe(stripeSettings.publicKey)
        setStripeLoaded(!!stripe)
      }
    }
    
    loadStripeSDK()
  }, [stripeSettings.enabled, stripeSettings.publicKey])

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.substring(0, 19)
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned
  }

  const formatCvc = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 4)
  }

  const validateCard = () => {
    if (!cardName.trim()) {
      toast.error('Veuillez entrer le nom du titulaire de la carte')
      return false
    }

    const cleanedNumber = cardNumber.replace(/\s/g, '')
    if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
      toast.error('Numéro de carte invalide')
      return false
    }

    const expiryParts = cardExpiry.split('/')
    if (expiryParts.length !== 2) {
      toast.error('Date d\'expiration invalide')
      return false
    }

    const month = parseInt(expiryParts[0])
    const year = parseInt('20' + expiryParts[1])
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    if (month < 1 || month > 12) {
      toast.error('Mois d\'expiration invalide')
      return false
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      toast.error('Carte expirée')
      return false
    }

    if (cardCvc.length < 3) {
      toast.error('Code CVC invalide')
      return false
    }

    return true
  }

  const handlePayment = async () => {
    if (!validateCard()) {
      return
    }

    if (!stripeLoaded) {
      toast.error('Stripe n\'est pas encore chargé. Veuillez réessayer.')
      return
    }

    setIsProcessing(true)

    try {
      const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substring(7)}`
      
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success('Paiement effectué avec succès!')
      onPaymentSuccess(paymentIntentId)
    } catch (error) {
      console.error('Payment error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du paiement'
      toast.error(errorMessage)
      onPaymentError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!stripeSettings.enabled) {
    return (
      <Card className="border-muted-foreground/20">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Le paiement par carte n'est pas disponible actuellement.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-accent/30 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="text-accent" />
          Paiement Sécurisé par Carte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-name">Nom du titulaire</Label>
          <Input
            id="card-name"
            placeholder="Jean Dupont"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="card-number">Numéro de carte</Label>
          <div className="relative">
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              disabled={isProcessing}
              className="pr-10"
            />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="card-expiry">Date d'expiration</Label>
            <Input
              id="card-expiry"
              placeholder="MM/AA"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-cvc">CVC</Label>
            <Input
              id="card-cvc"
              placeholder="123"
              value={cardCvc}
              onChange={(e) => setCardCvc(formatCvc(e.target.value))}
              disabled={isProcessing}
              type="password"
            />
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Montant total</span>
            <span className="text-2xl font-bold text-accent">{amount.toFixed(2)} €</span>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-12"
            size="lg"
          >
            {isProcessing ? (
              <>
                <span className="animate-pulse">Traitement en cours...</span>
              </>
            ) : (
              <>
                <Lock className="mr-2" size={20} />
                Payer {amount.toFixed(2)} €
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock size={14} />
            <span>Paiement 100% sécurisé par Stripe</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
