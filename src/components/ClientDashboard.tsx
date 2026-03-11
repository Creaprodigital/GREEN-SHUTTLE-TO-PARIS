import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Car, MapPin, Calendar, Clock, User as UserIcon, Users, Map, Star, CreditCard, TrendUp, Plus, BookmarkSimple, ArrowsClockwise } from '@phosphor-icons/react'
import { Booking } from '@/types/booking'
import { VehicleClass } from '@/types/fleet'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import MultiPassengerRouteMap from '@/components/MultiPassengerRouteMap'
import { useState } from 'react'
import { useSharedRideNotifications } from '@/hooks/useSharedRideNotifications'
import NotificationCenter from '@/components/NotificationCenter'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface ClientDashboardProps {
  userEmail: string
  bookings: Booking[]
  onLogout: () => void
  onNavigateToHome: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
}

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  confirmed: 'bg-green-500/20 text-green-500 border-green-500/30',
  completed: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  cancelled: 'bg-red-500/20 text-red-500 border-red-500/30'
}

export default function ClientDashboard({ userEmail, bookings, onLogout, onNavigateToHome, onNavigateToServices, onNavigateToAbout, onNavigateToContact }: ClientDashboardProps) {
  const userBookings = bookings.filter(b => b.userEmail === userEmail)
  const [fleet] = useKV<VehicleClass[]>('fleet', [])
  const [selectedSharedRide, setSelectedSharedRide] = useState<string | null>(null)
  const [savedAddresses] = useKV<string[]>('saved-addresses-' + userEmail, [])

  useSharedRideNotifications({
    bookings,
    userEmail,
    enabled: true
  })

  const hasSharedRideBookings = userBookings.some(b => b.serviceType === 'shared')
  
  const upcomingBookings = userBookings.filter(b => 
    (b.status === 'pending' || b.status === 'confirmed') && 
    new Date(b.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  const pastBookings = userBookings.filter(b => 
    b.status === 'completed' || new Date(b.date) < new Date()
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  const totalSpent = userBookings
    .filter(b => b.status === 'completed' && b.price)
    .reduce((sum, b) => sum + parseFloat(b.price || '0'), 0)
  
  const loyaltyPoints = Math.floor(totalSpent / 10)
  const nextRewardAt = Math.ceil(loyaltyPoints / 100) * 100
  const loyaltyProgress = ((loyaltyPoints % 100) / 100) * 100

  return (
    <>
      <Dialog open={!!selectedSharedRide} onOpenChange={(open) => !open && setSelectedSharedRide(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Map size={24} weight="fill" />
              Itinéraire de Votre Trajet Partagé
            </DialogTitle>
            <DialogDescription>
              Visualisation de l'itinéraire avec les autres passagers
            </DialogDescription>
          </DialogHeader>
          {selectedSharedRide && (
            <MultiPassengerRouteMap 
              bookings={bookings}
              sharedRideId={selectedSharedRide}
              height="600px"
              showDetails={true}
            />
          )}
        </DialogContent>
      </Dialog>

      <Header 
        onNavigateToHome={onNavigateToHome}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToContact={onNavigateToContact}
        onLogout={onLogout}
        userEmail={userEmail}
        isAdmin={false}
      />
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Espace Client
            </h2>
            <p className="text-foreground/70">
              Bienvenue {userEmail}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <TrendUp size={18} />
                  Total Dépensé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{totalSpent.toFixed(2)}€</div>
                <p className="text-xs text-muted-foreground mt-1">{userBookings.filter(b => b.status === 'completed').length} trajets complétés</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <Star size={18} weight="fill" />
                  Points Fidélité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{loyaltyPoints}</div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Prochain palier</span>
                    <span>{nextRewardAt} pts</span>
                  </div>
                  <Progress value={loyaltyProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <Calendar size={18} />
                  Prochains Trajets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{upcomingBookings.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {upcomingBookings.length > 0 
                    ? `Prochain: ${new Date(upcomingBookings[0].date).toLocaleDateString('fr-FR')}`
                    : 'Aucune réservation'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upcoming">Trajets à Venir ({upcomingBookings.length})</TabsTrigger>
                  <TabsTrigger value="past">Historique ({pastBookings.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-6">
                  {upcomingBookings.length === 0 ? (
                    <Card className="border-2 border-accent/20">
                      <CardContent className="py-16 text-center">
                        <Car size={64} className="mx-auto text-muted-foreground mb-4" weight="thin" />
                        <p className="text-lg text-muted-foreground">Aucun trajet prévu</p>
                        <p className="text-sm text-muted-foreground mt-2">Réservez votre prochain transfert</p>
                        <Button 
                          onClick={onNavigateToHome}
                          className="mt-6 gap-2 bg-accent hover:bg-accent/90"
                        >
                          <Plus size={18} />
                          Nouvelle Réservation
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    upcomingBookings.map((booking, index) => (
                      <BookingCard 
                        key={booking.id}
                        booking={booking}
                        index={index}
                        fleet={fleet}
                        onViewRoute={setSelectedSharedRide}
                        showRebook={false}
                      />
                    ))
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-6">
                  {pastBookings.length === 0 ? (
                    <Card className="border-2 border-accent/20">
                      <CardContent className="py-16 text-center">
                        <Clock size={64} className="mx-auto text-muted-foreground mb-4" weight="thin" />
                        <p className="text-lg text-muted-foreground">Aucun historique</p>
                        <p className="text-sm text-muted-foreground mt-2">Vos trajets passés apparaîtront ici</p>
                      </CardContent>
                    </Card>
                  ) : (
                    pastBookings.map((booking, index) => (
                      <BookingCard 
                        key={booking.id}
                        booking={booking}
                        index={index}
                        fleet={fleet}
                        onViewRoute={setSelectedSharedRide}
                        showRebook={true}
                        onRebook={() => onNavigateToServices?.()}
                      />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {hasSharedRideBookings && <NotificationCenter userEmail={userEmail} />}
              
              <Card className="border-2 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookmarkSimple size={20} weight="fill" />
                    Adresses Favorites
                  </CardTitle>
                  <CardDescription>Accès rapide à vos destinations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(!savedAddresses || savedAddresses.length === 0) ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune adresse enregistrée
                    </p>
                  ) : (
                    savedAddresses.slice(0, 5).map((address, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded-lg border border-border hover:border-accent/40 transition-colors">
                        <MapPin size={16} className="text-accent mt-1 flex-shrink-0" />
                        <p className="text-sm text-foreground">{address}</p>
                      </div>
                    ))
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-2 border-accent/30 hover:border-accent hover:bg-accent/10"
                    onClick={onNavigateToHome}
                  >
                    <Plus size={16} className="mr-2" />
                    Nouvelle Réservation
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard size={20} />
                    Moyens de Paiement
                  </CardTitle>
                  <CardDescription>Gestion de vos paiements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg border border-border bg-muted/30">
                      <p className="text-sm font-medium">Carte •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expire 12/25</p>
                    </div>
                    <Button variant="outline" className="w-full border-2 border-accent/30 hover:border-accent hover:bg-accent/10">
                      <Plus size={16} className="mr-2" />
                      Ajouter une carte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

interface BookingCardProps {
  booking: Booking
  index: number
  fleet: VehicleClass[] | undefined
  onViewRoute: (id: string | null) => void
  showRebook: boolean
  onRebook?: () => void
}

function BookingCard({ booking, index, fleet, onViewRoute, showRebook, onRebook }: BookingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
        <CardHeader className="border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-semibold uppercase tracking-wide">
                {fleet?.find(v => v.id === booking.vehicleType)?.title || booking.vehicleType || 'Réservation'}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2">
                <UserIcon size={16} />
                {booking.passengers} {booking.passengers === '1' ? 'passager' : 'passagers'}
              </CardDescription>
            </div>
            <Badge className={`${statusColors[booking.status]} border font-medium uppercase text-xs`}>
              {booking.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin size={16} />
                  <span className="uppercase tracking-wide font-medium">Départ</span>
                </div>
                <p className="text-foreground pl-6">{booking.pickup}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin size={16} weight="fill" />
                  <span className="uppercase tracking-wide font-medium">Arrivée</span>
                </div>
                <p className="text-foreground pl-6">{booking.destination}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar size={16} />
                  <span className="uppercase tracking-wide font-medium">Date</span>
                </div>
                <p className="text-foreground pl-6">{new Date(booking.date).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock size={16} />
                  <span className="uppercase tracking-wide font-medium">Heure</span>
                </div>
                <p className="text-foreground pl-6">{booking.time}</p>
              </div>
            </div>
          </div>
          {booking.serviceType === 'shared' && booking.sharedRideId && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="bg-accent/5 border-2 border-accent/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} weight="fill" className="text-accent" />
                  <span className="font-semibold text-sm uppercase tracking-wide">Transfert Partagé</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ce trajet est partagé avec {booking.sharedPassengers || 1} autre{(booking.sharedPassengers || 1) > 1 ? 's' : ''} passager{(booking.sharedPassengers || 1) > 1 ? 's' : ''}
                </p>
              </div>
              <Button
                onClick={() => onViewRoute(booking.sharedRideId || null)}
                variant="outline"
                className="w-full gap-2 border-2 border-accent/30 hover:border-accent hover:bg-accent/10 text-accent"
              >
                <Map size={18} />
                Voir l'itinéraire complet
              </Button>
            </div>
          )}
          {booking.price && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground uppercase tracking-wide">Prix Total</span>
                <span className="text-2xl font-bold text-accent">{booking.price}€</span>
              </div>
            </div>
          )}
          {showRebook && onRebook && (
            <div className="mt-6">
              <Button
                onClick={onRebook}
                variant="outline"
                className="w-full gap-2 border-2 border-accent/30 hover:border-accent hover:bg-accent/10"
              >
                <ArrowsClockwise size={18} />
                Réserver à nouveau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
