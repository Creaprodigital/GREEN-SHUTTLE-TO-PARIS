import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Users, MapPin, Clock, CurrencyEur, ArrowRight, Info, Check, X, Sparkle, Lightning, TrendUp, Map } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { Booking } from '@/types/booking'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { autoMatchSharedRides, findPotentialMatches } from '@/lib/sharedRideMatching'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import MultiPassengerRouteMap from '@/components/MultiPassengerRouteMap'

export interface SharedRideSettings {
  enabled: boolean
  maxPassengersPerRide: number
  maxDetourPercentage: number
  maxWaitTimeMinutes: number
  discountPerPassenger: number
  minDiscountPercentage: number
  maxDiscountPercentage: number
  searchRadiusKm: number
  autoMatchEnabled: boolean
  requireSameVehicleClass: boolean
}

export const DEFAULT_SHARED_RIDE_SETTINGS: SharedRideSettings = {
  enabled: true,
  maxPassengersPerRide: 4,
  maxDetourPercentage: 20,
  maxWaitTimeMinutes: 15,
  discountPerPassenger: 25,
  minDiscountPercentage: 30,
  maxDiscountPercentage: 70,
  searchRadiusKm: 5,
  autoMatchEnabled: true,
  requireSameVehicleClass: true
}

interface SharedRideGroup {
  id: string
  bookings: Booking[]
  route: {
    pickup: string
    destination: string
    distanceKm: number
    durationMinutes: number
  }
  totalPassengers: number
  vehicleType: string
  date: string
  time: string
  pricePerPassenger: number
  status: 'matching' | 'confirmed' | 'in-progress' | 'completed'
}

interface SharedRideManagerProps {
  bookings: Booking[]
  onUpdateBooking?: (id: string, updates: Partial<Booking>) => void
}

export default function SharedRideManager({ bookings, onUpdateBooking }: SharedRideManagerProps) {
  const [settings, setSettings] = useKV<SharedRideSettings>('shared-ride-settings', DEFAULT_SHARED_RIDE_SETTINGS)
  const [isMatching, setIsMatching] = useState(false)
  const [lastMatchTime, setLastMatchTime] = useState<number | null>(null)
  const [selectedGroupForMap, setSelectedGroupForMap] = useState<string | null>(null)

  const sharedBookings = useMemo(() => {
    return bookings.filter(b => b.serviceType === 'shared' && b.status !== 'cancelled')
  }, [bookings])

  const runAutoMatch = async () => {
    if (!settings?.autoMatchEnabled || !onUpdateBooking) {
      toast.error('Le matching automatique n\'est pas activé')
      return
    }

    setIsMatching(true)
    try {
      const result = await autoMatchSharedRides(bookings, settings)
      
      if (result.matchesMade > 0) {
        result.updatedBookings.forEach(booking => {
          const original = bookings.find(b => b.id === booking.id)
          if (original && original.sharedRideId !== booking.sharedRideId) {
            onUpdateBooking(booking.id, {
              sharedRideId: booking.sharedRideId,
              isSharedRide: booking.isSharedRide,
              sharedPassengers: booking.sharedPassengers,
              price: booking.price
            })
          }
        })
        
        setLastMatchTime(Date.now())
        toast.success(`${result.matchesMade} nouveau${result.matchesMade > 1 ? 'x' : ''} groupe${result.matchesMade > 1 ? 's' : ''} créé${result.matchesMade > 1 ? 's' : ''} !`, {
          description: 'Les passagers compatibles ont été associés'
        })
      } else {
        toast.info('Aucun nouveau match trouvé', {
          description: 'Tous les trajets compatibles sont déjà groupés'
        })
      }
    } catch (error) {
      toast.error('Erreur lors du matching automatique')
      console.error('Auto-match error:', error)
    } finally {
      setIsMatching(false)
    }
  }

  const sharedRideGroups = useMemo(() => {
    const groups: SharedRideGroup[] = []
    const processedBookingIds = new Set<string>()

    sharedBookings.forEach(booking => {
      if (processedBookingIds.has(booking.id)) return

      if (booking.sharedRideId) {
        const existingGroup = groups.find(g => g.id === booking.sharedRideId)
        if (!existingGroup) {
          const groupBookings = sharedBookings.filter(b => b.sharedRideId === booking.sharedRideId)
          const totalPassengers = groupBookings.reduce((sum, b) => sum + parseInt(b.passengers || '1'), 0)
          
          groups.push({
            id: booking.sharedRideId,
            bookings: groupBookings,
            route: {
              pickup: booking.pickup,
              destination: booking.destination || '',
              distanceKm: 0,
              durationMinutes: 0
            },
            totalPassengers,
            vehicleType: booking.vehicleType,
            date: booking.date,
            time: booking.time || '',
            pricePerPassenger: booking.price || 0,
            status: booking.status === 'pending' ? 'matching' : booking.status === 'confirmed' ? 'confirmed' : 'in-progress'
          })
          
          groupBookings.forEach(b => processedBookingIds.add(b.id))
        }
      } else {
        groups.push({
          id: `temp-${booking.id}`,
          bookings: [booking],
          route: {
            pickup: booking.pickup,
            destination: booking.destination || '',
            distanceKm: 0,
            durationMinutes: 0
          },
          totalPassengers: parseInt(booking.passengers || '1'),
          vehicleType: booking.vehicleType,
          date: booking.date,
          time: booking.time || '',
          pricePerPassenger: booking.price || 0,
          status: 'matching'
        })
        processedBookingIds.add(booking.id)
      }
    })

    return groups.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [sharedBookings])

  const pendingMatches = useMemo(() => {
    return sharedRideGroups.filter(g => g.status === 'matching' && g.bookings.length === 1)
  }, [sharedRideGroups])

  const activeGroups = useMemo(() => {
    return sharedRideGroups.filter(g => g.bookings.length > 1 || g.status !== 'matching')
  }, [sharedRideGroups])

  const stats = useMemo(() => {
    const totalSharedBookings = sharedBookings.length
    const totalGroups = activeGroups.length
    const totalPassengers = sharedBookings.reduce((sum, b) => sum + parseInt(b.passengers || '1'), 0)
    const avgPassengersPerGroup = totalGroups > 0 ? (totalPassengers / totalGroups).toFixed(1) : '0'
    const matchRate = totalSharedBookings > 0 
      ? ((sharedBookings.filter(b => b.sharedRideId).length / totalSharedBookings) * 100).toFixed(0)
      : '0'

    return {
      totalSharedBookings,
      totalGroups,
      totalPassengers,
      avgPassengersPerGroup,
      matchRate
    }
  }, [sharedBookings, activeGroups])

  const handleUpdateSettings = (key: keyof SharedRideSettings, value: any) => {
    setSettings((current) => ({
      ...DEFAULT_SHARED_RIDE_SETTINGS,
      ...current,
      [key]: value
    }))
    toast.success('Paramètres mis à jour')
  }

  const getStatusBadge = (status: SharedRideGroup['status']) => {
    const statusConfig = {
      matching: { label: 'En recherche', className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
      confirmed: { label: 'Confirmé', className: 'bg-green-500/20 text-green-500 border-green-500/30' },
      'in-progress': { label: 'En cours', className: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
      completed: { label: 'Terminé', className: 'bg-gray-500/20 text-gray-500 border-gray-500/30' }
    }

    const config = statusConfig[status]
    return <Badge className={`${config.className} border`}>{config.label}</Badge>
  }

  const selectedGroup = selectedGroupForMap ? activeGroups.find(g => g.id === selectedGroupForMap) : null

  return (
    <div className="space-y-6">
      <Dialog open={!!selectedGroupForMap} onOpenChange={(open) => !open && setSelectedGroupForMap(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Map size={24} weight="fill" />
              Itinéraire Multi-Passagers
            </DialogTitle>
            <DialogDescription>
              Visualisation de l'itinéraire optimisé avec les points de prise en charge intermédiaires
            </DialogDescription>
          </DialogHeader>
          {selectedGroup && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Groupe</div>
                  <div className="font-semibold">{selectedGroup.bookings.length} réservation{selectedGroup.bookings.length > 1 ? 's' : ''}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Passagers</div>
                  <div className="font-semibold">{selectedGroup.totalPassengers} passager{selectedGroup.totalPassengers > 1 ? 's' : ''}</div>
                </div>
              </div>
              <MultiPassengerRouteMap 
                bookings={bookings}
                sharedRideId={selectedGroup.id}
                height="600px"
                showDetails={true}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Total Réservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSharedBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Groupes Actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalGroups}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Total Passagers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPassengers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Moy. Pass./Groupe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgPassengersPerGroup}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Taux de Match</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.matchRate}%</div>
          </CardContent>
        </Card>
      </div>

      {settings?.autoMatchEnabled && (
        <Alert className="border-2 border-accent/30 bg-accent/5">
          <Sparkle size={20} weight="fill" className="text-accent" />
          <AlertTitle>Matching Automatique Actif</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Le système recherche automatiquement des trajets compatibles toutes les 30 secondes</span>
            <Button 
              onClick={runAutoMatch} 
              disabled={isMatching || !onUpdateBooking}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              {isMatching ? (
                <>
                  <Lightning size={16} className="mr-2 animate-pulse" />
                  Matching en cours...
                </>
              ) : (
                <>
                  <Lightning size={16} className="mr-2" />
                  Matcher Maintenant
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users size={24} weight="fill" />
                Paramètres du Transfert Partagé
              </CardTitle>
              <CardDescription>Configurez les règles de matching et les remises</CardDescription>
            </div>
            <Button 
              onClick={runAutoMatch} 
              disabled={isMatching || !onUpdateBooking || !settings?.enabled}
              size="lg"
              className="gap-2"
            >
              {isMatching ? (
                <>
                  <TrendUp size={20} className="animate-pulse" />
                  Matching...
                </>
              ) : (
                <>
                  <Lightning size={20} weight="fill" />
                  Lancer le Matching
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Activer les Transferts Partagés</Label>
              <p className="text-sm text-muted-foreground">Permettre aux clients de réserver des trajets partagés</p>
            </div>
            <Switch
              checked={settings?.enabled}
              onCheckedChange={(checked) => handleUpdateSettings('enabled', checked)}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="maxPassengers" className="flex items-center gap-2">
                Passagers Maximum par Course
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Nombre maximum de passagers pouvant partager un même véhicule</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="maxPassengers"
                  min={2}
                  max={8}
                  step={1}
                  value={[settings?.maxPassengersPerRide || 4]}
                  onValueChange={([value]) => handleUpdateSettings('maxPassengersPerRide', value)}
                  className="flex-1"
                />
                <span className="w-12 text-center font-semibold">{settings?.maxPassengersPerRide || 4}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxDetour" className="flex items-center gap-2">
                Détour Maximum (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Pourcentage maximum de détour autorisé par rapport au trajet direct</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="maxDetour"
                  min={5}
                  max={50}
                  step={5}
                  value={[settings?.maxDetourPercentage || 20]}
                  onValueChange={([value]) => handleUpdateSettings('maxDetourPercentage', value)}
                  className="flex-1"
                />
                <span className="w-12 text-center font-semibold">{settings?.maxDetourPercentage || 20}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxWait" className="flex items-center gap-2">
                Temps d'Attente Maximum (min)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Temps maximum qu'un passager peut attendre pour récupérer d'autres passagers</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="maxWait"
                  min={5}
                  max={30}
                  step={5}
                  value={[settings?.maxWaitTimeMinutes || 15]}
                  onValueChange={([value]) => handleUpdateSettings('maxWaitTimeMinutes', value)}
                  className="flex-1"
                />
                <span className="w-12 text-center font-semibold">{settings?.maxWaitTimeMinutes || 15}m</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="searchRadius" className="flex items-center gap-2">
                Rayon de Recherche (km)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Distance maximum entre deux points de départ pour les matcher</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="searchRadius"
                  min={1}
                  max={20}
                  step={1}
                  value={[settings?.searchRadiusKm || 5]}
                  onValueChange={([value]) => handleUpdateSettings('searchRadiusKm', value)}
                  className="flex-1"
                />
                <span className="w-12 text-center font-semibold">{settings?.searchRadiusKm || 5}km</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label htmlFor="minDiscount" className="flex items-center gap-2">
                Remise Minimum (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Remise minimum garantie pour un trajet partagé</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="minDiscount"
                  min={10}
                  max={50}
                  step={5}
                  value={[settings?.minDiscountPercentage || 30]}
                  onValueChange={([value]) => handleUpdateSettings('minDiscountPercentage', value)}
                  className="flex-1"
                />
                <span className="w-12 text-center font-semibold">{settings?.minDiscountPercentage || 30}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxDiscount" className="flex items-center gap-2">
                Remise Maximum (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Remise maximum possible avec plusieurs passagers</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="maxDiscount"
                  min={50}
                  max={80}
                  step={5}
                  value={[settings?.maxDiscountPercentage || 70]}
                  onValueChange={([value]) => handleUpdateSettings('maxDiscountPercentage', value)}
                  className="flex-1"
                />
                <span className="w-12 text-center font-semibold">{settings?.maxDiscountPercentage || 70}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="discountPerPassenger" className="flex items-center gap-2">
                Remise par Passager (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Pourcentage de remise ajouté pour chaque passager supplémentaire</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="discountPerPassenger"
                  min={5}
                  max={35}
                  step={5}
                  value={[settings?.discountPerPassenger || 25]}
                  onValueChange={([value]) => handleUpdateSettings('discountPerPassenger', value)}
                  className="flex-1"
                />
                <span className="w-12 text-center font-semibold">{settings?.discountPerPassenger || 25}%</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Matching Automatique</Label>
                <p className="text-sm text-muted-foreground">Associer automatiquement les trajets compatibles</p>
              </div>
              <Switch
                checked={settings?.autoMatchEnabled}
                onCheckedChange={(checked) => handleUpdateSettings('autoMatchEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Classe de Véhicule Identique</Label>
                <p className="text-sm text-muted-foreground">Les passagers doivent avoir sélectionné la même classe de véhicule</p>
              </div>
              <Switch
                checked={settings?.requireSameVehicleClass}
                onCheckedChange={(checked) => handleUpdateSettings('requireSameVehicleClass', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} weight="fill" />
              En Attente de Match ({pendingMatches.length})
            </CardTitle>
            <CardDescription>Réservations en recherche de partenaires</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingMatches.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users size={48} weight="thin" className="mx-auto mb-3 opacity-30" />
                <p>Aucune réservation en attente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingMatches.map((group) => (
                  <Card key={group.id} className="border-2 border-yellow-500/30 bg-yellow-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(group.status)}
                            <Badge variant="outline" className="text-xs">
                              <Users size={12} className="mr-1" />
                              {group.totalPassengers} passager{group.totalPassengers > 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin size={14} weight="fill" />
                              <span className="truncate">{group.route.pickup}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <ArrowRight size={14} />
                              <span className="truncate">{group.route.destination}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                              <span>{group.date} à {group.time}</span>
                              <span>•</span>
                              <span>{group.vehicleType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{group.pricePerPassenger.toFixed(2)}€</div>
                          <div className="text-xs text-muted-foreground">par personne</div>
                        </div>
                      </div>
                      {group.bookings.map((booking) => (
                        <div key={booking.id} className="text-xs text-muted-foreground border-t border-border/50 pt-2 mt-2">
                          {booking.firstName} {booking.lastName} • {booking.email}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check size={20} weight="fill" />
              Groupes Actifs ({activeGroups.length})
            </CardTitle>
            <CardDescription>Trajets avec passagers matchés</CardDescription>
          </CardHeader>
          <CardContent>
            {activeGroups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users size={48} weight="thin" className="mx-auto mb-3 opacity-30" />
                <p>Aucun groupe actif</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeGroups.map((group) => (
                  <Card key={group.id} className="border-2 border-green-500/30 bg-green-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(group.status)}
                            <Badge variant="outline" className="text-xs bg-green-500/20 border-green-500/30">
                              <Users size={12} className="mr-1" />
                              {group.bookings.length} réservation{group.bookings.length > 1 ? 's' : ''}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {group.totalPassengers} passager{group.totalPassengers > 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin size={14} weight="fill" />
                              <span className="truncate">{group.route.pickup}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <ArrowRight size={14} />
                              <span className="truncate">{group.route.destination}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                              <span>{group.date} à {group.time}</span>
                              <span>•</span>
                              <span>{group.vehicleType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{group.pricePerPassenger.toFixed(2)}€</div>
                          <div className="text-xs text-muted-foreground">par personne</div>
                        </div>
                      </div>
                      <div className="border-t border-border/50 pt-3 mt-3 space-y-2">
                        {group.bookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {booking.firstName} {booking.lastName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {booking.passengers} pass.
                            </Badge>
                          </div>
                        ))}
                      </div>
                      {group.bookings.length > 1 && (
                        <div className="border-t border-border/50 pt-3 mt-3">
                          <Button 
                            onClick={() => setSelectedGroupForMap(group.id)}
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                          >
                            <Map size={16} />
                            Voir l'itinéraire optimisé
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
