import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SignOut, Car, MapPin, Calendar, Clock, User as UserIcon } from '@phosphor-icons/react'
import { Booking } from '@/types/booking'
import { motion } from 'framer-motion'

interface ClientDashboardProps {
  userEmail: string
  bookings: Booking[]
  onLogout: () => void
}

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  confirmed: 'bg-green-500/20 text-green-500 border-green-500/30',
  completed: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  cancelled: 'bg-red-500/20 text-red-500 border-red-500/30'
}

const serviceLabels = {
  business: 'Business Class',
  firstclass: 'First Class',
  suv: 'Premium SUV'
}

export default function ClientDashboard({ userEmail, bookings, onLogout }: ClientDashboardProps) {
  const userBookings = bookings.filter(b => b.userEmail === userEmail)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-accent bg-primary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                Client Dashboard
              </h1>
              <p className="text-sm text-foreground/70 mt-1">{userEmail}</p>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <SignOut className="mr-2" size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            My Bookings
          </h2>
          <p className="text-foreground/70">
            {userBookings.length} {userBookings.length === 1 ? 'booking' : 'bookings'} found
          </p>
        </div>

        {userBookings.length === 0 ? (
          <Card className="border-2 border-accent/20">
            <CardContent className="py-16 text-center">
              <Car size={64} className="mx-auto text-muted-foreground mb-4" weight="thin" />
              <p className="text-lg text-muted-foreground">No bookings yet</p>
              <p className="text-sm text-muted-foreground mt-2">Your reservations will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {userBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
                  <CardHeader className="border-b border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold uppercase tracking-wide">
                          {serviceLabels[booking.serviceType]}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <UserIcon size={16} />
                          {booking.passengers} {booking.passengers === '1' ? 'passenger' : 'passengers'}
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
                            <span className="uppercase tracking-wide font-medium">Pickup</span>
                          </div>
                          <p className="text-foreground pl-6">{booking.pickup}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <MapPin size={16} weight="fill" />
                            <span className="uppercase tracking-wide font-medium">Destination</span>
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
                            <span className="uppercase tracking-wide font-medium">Time</span>
                          </div>
                          <p className="text-foreground pl-6">{booking.time}</p>
                        </div>
                      </div>
                    </div>
                    {booking.price && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground uppercase tracking-wide">Total Price</span>
                          <span className="text-2xl font-bold text-accent">{booking.price}€</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
