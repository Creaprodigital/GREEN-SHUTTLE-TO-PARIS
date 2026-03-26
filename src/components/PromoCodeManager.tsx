import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Trash, Plus, Tag, Percent, CurrencyEur } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useCloudSync } from '@/hooks/useCloudSync'
import { CloudSyncIndicator } from '@/components/CloudSyncIndicator'
import { SyncNotification } from '@/components/SyncNotification'
import { PromoCode, DEFAULT_PROMO_CODES } from '@/types/promo'

export default function PromoCodeManager() {
  const [userEmail, setUserEmail] = useState<string>('')
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [showSyncNotification, setShowSyncNotification] = useState(false)
  const [syncNotificationMessage, setSyncNotificationMessage] = useState('')
  
  const { 
    data: promoCodes, 
    setData: setPromoCodes, 
    syncToCloud, 
    syncMeta, 
    isLatestVersion 
  } = useCloudSync<PromoCode[]>('promo-codes', DEFAULT_PROMO_CODES, {
    onSyncComplete: (data) => {
      console.log('Codes promo synchronisés:', data.length, 'codes')
      if (syncMeta?.lastModifiedBy && syncMeta.lastModifiedBy !== userEmail) {
        setSyncNotificationMessage(`Codes promo mis à jour par ${syncMeta.lastModifiedBy}`)
        setShowSyncNotification(true)
      }
    },
    onSyncError: (error) => {
      console.error('Erreur de synchronisation:', error)
      toast.error('Erreur de synchronisation cloud')
      setSyncStatus('error')
    },
    syncInterval: 2000
  })
  
  const [newCode, setNewCode] = useState('')
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage')
  const [newValue, setNewValue] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newMinAmount, setNewMinAmount] = useState('')
  const [newMaxDiscount, setNewMaxDiscount] = useState('')
  const [newUsageLimit, setNewUsageLimit] = useState('')
  const [newExpiresAt, setNewExpiresAt] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await spark.user()
        setUserEmail(user.email || user.login)
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }
    loadUser()
  }, [])

  const handleAddPromoCode = async () => {
    if (!newCode || !newValue) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    const value = parseFloat(newValue)
    if (isNaN(value) || value <= 0) {
      toast.error('La valeur doit être un nombre positif')
      return
    }

    if (newType === 'percentage' && value > 100) {
      toast.error('Le pourcentage ne peut pas dépasser 100%')
      return
    }

    if (promoCodes && promoCodes.some(p => p.code.toLowerCase() === newCode.toLowerCase())) {
      toast.error('Ce code promo existe déjà')
      return
    }

    const promoCode: PromoCode = {
      id: `promo-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      code: newCode.toUpperCase(),
      type: newType,
      value,
      description: newDescription || undefined,
      minAmount: newMinAmount ? parseFloat(newMinAmount) : undefined,
      maxDiscount: newMaxDiscount ? parseFloat(newMaxDiscount) : undefined,
      usageLimit: newUsageLimit ? parseInt(newUsageLimit) : undefined,
      expiresAt: newExpiresAt ? new Date(newExpiresAt).getTime() : undefined,
      usageCount: 0,
      createdAt: Date.now(),
      isActive: true
    }

    const updatedCodes = [...(promoCodes || []), promoCode]
    setPromoCodes(updatedCodes)
    
    setSyncStatus('syncing')
    await syncToCloud(updatedCodes, userEmail)
    setSyncStatus('synced')
    setTimeout(() => setSyncStatus('idle'), 2000)
    
    setNewCode('')
    setNewValue('')
    setNewDescription('')
    setNewMinAmount('')
    setNewMaxDiscount('')
    setNewUsageLimit('')
    setNewExpiresAt('')
    
    toast.success('Code promo créé et synchronisé')
  }

  const handleDeletePromoCode = async (id: string) => {
    const updatedCodes = (promoCodes || []).filter(p => p.id !== id)
    setPromoCodes(updatedCodes)
    
    setSyncStatus('syncing')
    await syncToCloud(updatedCodes, userEmail)
    setSyncStatus('synced')
    setTimeout(() => setSyncStatus('idle'), 2000)
    
    toast.success('Code promo supprimé et synchronisé')
  }

  const handleToggleActive = async (id: string) => {
    const updatedCodes = (promoCodes || []).map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    )
    setPromoCodes(updatedCodes)
    
    setSyncStatus('syncing')
    await syncToCloud(updatedCodes, userEmail)
    setSyncStatus('synced')
    setTimeout(() => setSyncStatus('idle'), 2000)
  }

  return (
    <>
      <SyncNotification
        show={showSyncNotification}
        message={syncNotificationMessage}
        onClose={() => setShowSyncNotification(false)}
      />
      
      <Card className="bg-card border-2 border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg uppercase tracking-wide">
              <Tag size={24} weight="fill" className="text-accent" />
              Codes Promo
            </CardTitle>
            <CloudSyncIndicator
              status={syncStatus}
              isLatestVersion={isLatestVersion}
              lastModifiedBy={syncMeta?.lastModifiedBy}
              lastSyncTimestamp={syncMeta?.lastSyncTimestamp}
            />
          </div>
        </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
            <Plus size={18} weight="bold" />
            Créer un code promo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promo-code" className="text-xs font-medium uppercase tracking-wide">
                Code *
              </Label>
              <Input
                id="promo-code"
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="PROMO2024"
                className="bg-secondary border-border uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo-type" className="text-xs font-medium uppercase tracking-wide">
                Type de réduction *
              </Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as 'percentage' | 'fixed')}>
                <SelectTrigger id="promo-type" className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                  <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo-value" className="text-xs font-medium uppercase tracking-wide">
                Valeur * {newType === 'percentage' ? '(%)' : '(€)'}
              </Label>
              <div className="relative">
                {newType === 'percentage' ? (
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                ) : (
                  <CurrencyEur className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                )}
                <Input
                  id="promo-value"
                  type="number"
                  step="0.01"
                  min="0"
                  max={newType === 'percentage' ? '100' : undefined}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={newType === 'percentage' ? '10' : '5.00'}
                  className="bg-secondary border-border pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo-min" className="text-xs font-medium uppercase tracking-wide">
                Montant minimum (€)
              </Label>
              <div className="relative">
                <CurrencyEur className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="promo-min"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newMinAmount}
                  onChange={(e) => setNewMinAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-secondary border-border pl-10"
                />
              </div>
            </div>

            {newType === 'percentage' && (
              <div className="space-y-2">
                <Label htmlFor="promo-max" className="text-xs font-medium uppercase tracking-wide">
                  Réduction maximale (€)
                </Label>
                <div className="relative">
                  <CurrencyEur className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="promo-max"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newMaxDiscount}
                    onChange={(e) => setNewMaxDiscount(e.target.value)}
                    placeholder="0.00"
                    className="bg-secondary border-border pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="promo-limit" className="text-xs font-medium uppercase tracking-wide">
                Nombre d'utilisations max
              </Label>
              <Input
                id="promo-limit"
                type="number"
                min="1"
                value={newUsageLimit}
                onChange={(e) => setNewUsageLimit(e.target.value)}
                placeholder="Illimité"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo-expires" className="text-xs font-medium uppercase tracking-wide">
                Date d'expiration
              </Label>
              <Input
                id="promo-expires"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={newExpiresAt}
                onChange={(e) => setNewExpiresAt(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="promo-description" className="text-xs font-medium uppercase tracking-wide">
                Description
              </Label>
              <Textarea
                id="promo-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description du code promo..."
                className="bg-secondary border-border resize-none"
                rows={2}
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddPromoCode}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus size={18} weight="bold" className="mr-2" />
            Ajouter le code promo
          </Button>
        </div>

        {promoCodes && promoCodes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Codes promo existants ({promoCodes.length})
            </h3>
            
            <div className="space-y-2">
              {promoCodes.map((promo) => {
                const isExpired = promo.expiresAt && promo.expiresAt < Date.now()
                const isLimitReached = promo.usageLimit && promo.usageCount >= promo.usageLimit
                
                return (
                  <div
                    key={promo.id}
                    className="flex items-center justify-between p-4 bg-secondary border-2 border-border rounded-lg"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-accent text-lg">{promo.code}</span>
                        <span className="text-sm font-medium text-foreground">
                          {promo.type === 'percentage' ? `${promo.value}%` : `${promo.value}€`}
                        </span>
                        {!promo.isActive && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded uppercase font-medium">
                            Inactif
                          </span>
                        )}
                        {isExpired && (
                          <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded uppercase font-medium">
                            Expiré
                          </span>
                        )}
                        {isLimitReached && (
                          <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded uppercase font-medium">
                            Limite atteinte
                          </span>
                        )}
                      </div>
                      
                      {promo.description && (
                        <p className="text-xs text-muted-foreground">{promo.description}</p>
                      )}
                      
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {promo.minAmount && <span>Min: {promo.minAmount}€</span>}
                        {promo.maxDiscount && <span>Max réd: {promo.maxDiscount}€</span>}
                        {promo.usageLimit && (
                          <span>Utilisations: {promo.usageCount}/{promo.usageLimit}</span>
                        )}
                        {!promo.usageLimit && promo.usageCount > 0 && (
                          <span>Utilisations: {promo.usageCount}</span>
                        )}
                        {promo.expiresAt && (
                          <span>Expire: {new Date(promo.expiresAt).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={promo.isActive}
                          onCheckedChange={() => handleToggleActive(promo.id)}
                        />
                        <span className="text-xs text-muted-foreground">{promo.isActive ? 'Actif' : 'Inactif'}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePromoCode(promo.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash size={18} />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  )
}
