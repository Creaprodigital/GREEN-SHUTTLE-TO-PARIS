import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Car, MapPin, Calendar, Clock, User as UserIcon, CheckCircle, XCircle, Trash } from '@phosphor-icons/react'
import { Booking } from '@/types/booking'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Header from '@/components/Header'

interface AdminDashboardProps {
  userEmail: string
  bookings: Booking[]
  onLogout: () => void
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void
  onDeleteBooking: (id: string) => void
  onNavigateToHome: () => void
  onNavigateToAirportTransfer: () => void
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

export default function AdminDashboard({ userEmail, bookings, onLogout, onUpdateBooking, onDeleteBooking, onNavigateToHome, onNavigateToAirportTransfer }: AdminDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus
    const matchesSearch = !searchTerm || 
      b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  }

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    onUpdateBooking(bookingId, { status: newStatus })
    toast.success(`Booking status updated to ${newStatus}`)
  }

  const handlePriceChange = (bookingId: string, price: string) => {
    const priceNum = parseFloat(price)
    if (!isNaN(priceNum) && priceNum > 0) {
      onUpdateBooking(bookingId, { price: priceNum })
      toast.success('Price updated successfully')
    }
  }

  const handleDelete = (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      onDeleteBooking(bookingId)
      toast.success('Booking deleted')
    }
  }

  return (
    <>
      <Header 
        onNavigateToHome={onNavigateToHome}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
        onLogout={onLogout}
        userEmail={userEmail}
        isAdmin={true}
      />
      <div className="min-h-screen bg-background pt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="border-2 border-accent/20">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-accent">{stats.total}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">Total</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-yellow-500/20">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-500/20">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-500">{stats.confirmed}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">Confirmed</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-500/20">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-500">{stats.completed}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-500/20">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-red-500">{stats.cancelled}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">Cancelled</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-accent/20 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold uppercase tracking-wide">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wide">Search</label>
                <Input
                  placeholder="Search by email, pickup, or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wide">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-12 bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            All Bookings
          </h2>
          <p className="text-foreground/70">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
          </p>
        </div>

        {filteredBookings.length === 0 ? (
          <Card className="border-2 border-accent/20">
            <CardContent className="py-16 text-center">
              <Car size={64} className="mx-auto text-muted-foreground mb-4" weight="thin" />
              <p className="text-lg text-muted-foreground">No bookings found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-2 border-accent/20">
                  <CardHeader className="border-b border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold uppercase tracking-wide">
                          {serviceLabels[booking.serviceType]}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Client: {booking.userEmail}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value as Booking['status'])}
                        >
                          <SelectTrigger className={`w-[140px] ${statusColors[booking.status]} border font-medium uppercase text-xs`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash size={20} />
                        </Button>
                      </div>
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
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <UserIcon size={16} />
                            <span className="uppercase tracking-wide font-medium">Passengers</span>
                          </div>
                          <p className="text-foreground pl-6">{booking.passengers}</p>
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
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <span className="uppercase tracking-wide font-medium">Price (€)</span>
                          </div>
                          <Input
                            type="number"
                            defaultValue={booking.price || ''}
                            onBlur={(e) => handlePriceChange(booking.id, e.target.value)}
                            placeholder="Set price..."
                            className="h-10 bg-secondary border-border"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  )
}
