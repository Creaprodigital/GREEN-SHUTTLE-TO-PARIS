import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CurrencyCircleDollar, Warning, CheckCircle, XCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Booking } from '@/types/booking'

interface RefundDisputeManagerProps {
  booking: Booking
  onUpdate: (id: string, updates: Partial<Booking>) => void
}

export default function RefundDisputeManager({ booking, onUpdate }: RefundDisputeManagerProps) {
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [showDisputeDialog, setShowDisputeDialog] = useState(false)
  const [refundType, setRefundType] = useState<'partial' | 'full'>('full')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeEvidence, setDisputeEvidence] = useState('')
  const [disputeStatus, setDisputeStatus] = useState<'pending' | 'won' | 'lost'>('pending')

  const hasStripePayment = !!booking.stripePaymentIntentId
  const hasRefund = booking.refundStatus && booking.refundStatus !== 'none'
  const hasDispute = booking.disputeStatus && booking.disputeStatus !== 'none'

  const handleRefund = async () => {
    if (!hasStripePayment) {
      toast.error('Aucun paiement Stripe trouvé pour cette réservation')
      return
    }

    if (refundType === 'partial' && (!refundAmount || parseFloat(refundAmount) <= 0)) {
      toast.error('Veuillez entrer un montant de remboursement valide')
      return
    }

    if (!refundReason.trim()) {
      toast.error('Veuillez fournir une raison pour le remboursement')
      return
    }

    const amount = refundType === 'full' ? booking.price || 0 : parseFloat(refundAmount)
    
    if (amount > (booking.price || 0)) {
      toast.error('Le montant du remboursement ne peut pas dépasser le prix de la réservation')
      return
    }

    onUpdate(booking.id, {
      refundStatus: refundType,
      refundAmount: amount,
      refundReason: refundReason.trim(),
      refundDate: Date.now()
    })

    toast.success(`Remboursement ${refundType === 'full' ? 'total' : 'partiel'} de ${amount}€ effectué`)
    setShowRefundDialog(false)
    setRefundAmount('')
    setRefundReason('')
  }

  const handleDispute = () => {
    if (!hasStripePayment) {
      toast.error('Aucun paiement Stripe trouvé pour cette réservation')
      return
    }

    if (!disputeReason.trim()) {
      toast.error('Veuillez fournir une raison pour le litige')
      return
    }

    onUpdate(booking.id, {
      disputeStatus: disputeStatus,
      disputeReason: disputeReason.trim(),
      disputeEvidence: disputeEvidence.trim(),
      disputeDate: Date.now()
    })

    toast.success(`Litige enregistré avec le statut: ${disputeStatus}`)
    setShowDisputeDialog(false)
    setDisputeReason('')
    setDisputeEvidence('')
  }

  const getRefundBadge = () => {
    if (!hasRefund) return null
    
    const variant = booking.refundStatus === 'full' ? 'default' : 'secondary'
    const icon = booking.refundStatus === 'full' ? <CheckCircle size={14} weight="fill" /> : <ClockCounterClockwise size={14} />
    
    return (
      <Badge variant={variant} className="gap-1.5">
        {icon}
        Remboursé {booking.refundStatus === 'full' ? 'Totalement' : 'Partiellement'}: {booking.refundAmount}€
      </Badge>
    )
  }

  const getDisputeBadge = () => {
    if (!hasDispute) return null
    
    let icon = <Warning size={14} weight="fill" />
    let className = 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    
    if (booking.disputeStatus === 'won') {
      icon = <CheckCircle size={14} weight="fill" />
      className = 'bg-green-500/20 text-green-500 border-green-500/30'
    } else if (booking.disputeStatus === 'lost') {
      icon = <XCircle size={14} weight="fill" />
      className = 'bg-red-500/20 text-red-500 border-red-500/30'
    }
    
    return (
      <Badge className={`gap-1.5 ${className}`}>
        {icon}
        Litige: {booking.disputeStatus === 'pending' ? 'En cours' : booking.disputeStatus === 'won' ? 'Gagné' : 'Perdu'}
      </Badge>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {(hasRefund || hasDispute) && (
          <div className="flex flex-wrap gap-2">
            {getRefundBadge()}
            {getDisputeBadge()}
          </div>
        )}

        {hasStripePayment && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRefundDialog(true)}
              disabled={hasRefund}
              className="flex-1 text-xs"
            >
              <CurrencyCircleDollar size={16} className="mr-2" />
              {hasRefund ? 'Déjà remboursé' : 'Rembourser'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDisputeDialog(true)}
              className="flex-1 text-xs"
            >
              <Warning size={16} className="mr-2" />
              {hasDispute ? 'Modifier litige' : 'Gérer litige'}
            </Button>
          </div>
        )}

        {hasRefund && (
          <Card className="border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Détails du remboursement</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montant:</span>
                <span className="font-semibold">{booking.refundAmount}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span>{booking.refundStatus === 'full' ? 'Remboursement total' : 'Remboursement partiel'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{booking.refundDate ? new Date(booking.refundDate).toLocaleDateString('fr-FR') : '-'}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-muted-foreground mb-1">Raison:</p>
                <p className="text-foreground">{booking.refundReason}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {hasDispute && (
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Warning size={18} weight="fill" className="text-yellow-500" />
                Détails du litige
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut:</span>
                <span className="font-semibold">
                  {booking.disputeStatus === 'pending' ? 'En cours' : booking.disputeStatus === 'won' ? 'Gagné' : 'Perdu'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{booking.disputeDate ? new Date(booking.disputeDate).toLocaleDateString('fr-FR') : '-'}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-muted-foreground mb-1">Raison:</p>
                <p className="text-foreground">{booking.disputeReason}</p>
              </div>
              {booking.disputeEvidence && (
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground mb-1">Preuves:</p>
                  <p className="text-foreground">{booking.disputeEvidence}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CurrencyCircleDollar size={24} className="text-accent" />
              Rembourser la réservation
            </DialogTitle>
            <DialogDescription>
              Effectuer un remboursement pour cette réservation (Prix: {booking.price}€)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="refund-type">Type de remboursement</Label>
              <Select value={refundType} onValueChange={(value) => setRefundType(value as 'partial' | 'full')}>
                <SelectTrigger id="refund-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Remboursement total ({booking.price}€)</SelectItem>
                  <SelectItem value="partial">Remboursement partiel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {refundType === 'partial' && (
              <div className="space-y-2">
                <Label htmlFor="refund-amount">Montant à rembourser (€)</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={booking.price}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Montant..."
                  className="h-10"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="refund-reason">Raison du remboursement</Label>
              <Textarea
                id="refund-reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Expliquez la raison du remboursement..."
                className="min-h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleRefund} className="bg-accent text-accent-foreground">
              Confirmer le remboursement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warning size={24} className="text-yellow-500" weight="fill" />
              Gérer le litige
            </DialogTitle>
            <DialogDescription>
              Enregistrer ou mettre à jour un litige pour cette réservation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dispute-status">Statut du litige</Label>
              <Select value={disputeStatus} onValueChange={(value) => setDisputeStatus(value as 'pending' | 'won' | 'lost')}>
                <SelectTrigger id="dispute-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En cours</SelectItem>
                  <SelectItem value="won">Gagné</SelectItem>
                  <SelectItem value="lost">Perdu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dispute-reason">Raison du litige</Label>
              <Textarea
                id="dispute-reason"
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Décrivez la raison du litige..."
                className="min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dispute-evidence">Preuves / Notes (optionnel)</Label>
              <Textarea
                id="dispute-evidence"
                value={disputeEvidence}
                onChange={(e) => setDisputeEvidence(e.target.value)}
                placeholder="Ajoutez des preuves ou notes supplémentaires..."
                className="min-h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisputeDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleDispute} className="bg-accent text-accent-foreground">
              Enregistrer le litige
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
