import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Calendar, Clock, Users, ArrowRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import PlacesAutocomplete from '@/components/PlacesAutocomplete'

interface BookingData {
  tripType: string
  pickup: string
  destination: string
  date: string
  time: string
  passengers: string
  serviceType: string
}

export default function BookingForm() {
  const [bookings, setBookings] = useKV<BookingData[]>('bookings', [] as BookingData[])
  const [tripType, setTripType] = useState('oneway')
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [passengers, setPassengers] = useState('1')
  const [serviceType, setServiceType] = useState('business')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pickup || !destination || !date || !time) {
      toast.error('Please fill in all required fields')
      return
    }

    const newBooking: BookingData = {
      tripType,
      pickup,
      destination,
      date,
      time,
      passengers,
      serviceType
    }

    setBookings((current) => [...(current || []), newBooking])
    
    toast.success('Booking request submitted successfully!', {
      description: `${pickup} → ${destination} on ${date}`
    })

    setPickup('')
    setDestination('')
    setDate('')
    setTime('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative -mt-24 z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <Card className="shadow-2xl border-2 border-accent/20 bg-card">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="text-2xl font-semibold text-center uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
            Reserve Your Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={tripType} onValueChange={setTripType} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-secondary">
              <TabsTrigger value="oneway">One Way</TabsTrigger>
              <TabsTrigger value="roundtrip">Round Trip</TabsTrigger>
              <TabsTrigger value="hourly">Hourly</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="pickup" className="text-sm font-medium uppercase tracking-wide">Pickup Location</Label>
                <PlacesAutocomplete
                  id="pickup"
                  value={pickup}
                  onChange={setPickup}
                  placeholder="Enter pickup address"
                  className="h-12 bg-secondary border-border"
                  icon={<MapPin size={20} />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-medium uppercase tracking-wide">Destination</Label>
                <PlacesAutocomplete
                  id="destination"
                  value={destination}
                  onChange={setDestination}
                  placeholder="Enter destination"
                  className="h-12 bg-secondary border-border"
                  icon={<MapPin size={20} weight="fill" />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium uppercase tracking-wide">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-11 h-12 bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium uppercase tracking-wide">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-11 h-12 bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengers" className="text-sm font-medium uppercase tracking-wide">Passengers</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger id="passengers" className="pl-11 h-12 bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Passenger' : 'Passengers'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service" className="text-sm font-medium uppercase tracking-wide">Service Type</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger id="service" className="h-12 bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business Class</SelectItem>
                    <SelectItem value="firstclass">First Class</SelectItem>
                    <SelectItem value="suv">Premium SUV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 group font-medium uppercase tracking-widest">
              Continue
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
