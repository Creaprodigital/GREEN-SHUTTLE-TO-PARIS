import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PlacesAutocomplete from '@/components/PlacesAutocomplete'
import { 
  CalendarBlank, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  EnvelopeSimple,
  User,
  Car,
  CheckCircle,
  ArrowRight
} from '@phosphor-icons/react'

interface ChauffeurPriveProps {
  onBackToHome: () => void
  onNavigateToAirportTransfer: () => void
  onNavigateToCorporateEvent: () => void
  onNavigateToEmbassyDelegation: () => void
}

export default function ChauffeurPrive({ 
  onBackToHome, 
  onNavigateToAirportTransfer,
  onNavigateToCorporateEvent,
  onNavigateToEmbassyDelegation
}: ChauffeurPriveProps) {
  const [bookings, setBookings] = useKV('bookings', [])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupLocation: '',
    dropoffLocation: '',
    date: '',
    time: '',
    passengers: '1',
    vehicleType: 'eco',
    additionalInfo: ''
  })

  const [pickupCoordinates, setPickupCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [dropoffCoordinates, setDropoffCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone || 
        !formData.pickupLocation || !formData.dropoffLocation || 
        !formData.date || !formData.time) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    const newBooking = {
      id: Date.now().toString(),
      ...formData,
      serviceType: 'chauffeur-prive',
      status: 'pending',
      createdAt: new Date().toISOString(),
      pickupCoordinates,
      dropoffCoordinates
    }

    setBookings((current: any) => [...(current || []), newBooking])

    toast.success('Votre réservation a été envoyée avec succès!')

    setFormData({
      name: '',
      email: '',
      phone: '',
      pickupLocation: '',
      dropoffLocation: '',
      date: '',
      time: '',
      passengers: '1',
      vehicleType: 'eco',
      additionalInfo: ''
    })
    setPickupCoordinates(null)
    setDropoffCoordinates(null)
  }

  const features = [
    {
      icon: <Car size={32} />,
      title: 'Service sur mesure',
      description: 'Un chauffeur privé dédié pour tous vos déplacements personnels ou professionnels'
    },
    {
      icon: <Clock size={32} />,
      title: 'Ponctualité garantie',
      description: 'Nos chauffeurs sont toujours à l\'heure pour assurer vos rendez-vous'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Discrétion & Confort',
      description: 'Un service premium dans des véhicules haut de gamme'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onNavigateToHome={onBackToHome}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
        onNavigateToCorporateEvent={onNavigateToCorporateEvent}
        onNavigateToEmbassyDelegation={onNavigateToEmbassyDelegation}
      />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              Chauffeur Privé
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Un service de chauffeur privé pour tous vos déplacements. Confort, discrétion et professionnalisme.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border hover:border-accent transition-all duration-300">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="flex justify-center mb-4 text-accent">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card border-border max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-foreground text-center" style={{ fontFamily: 'var(--font-display)' }}>
                Réserver votre chauffeur privé
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground flex items-center gap-2">
                      <User size={16} />
                      Nom complet *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                      <EnvelopeSimple size={16} />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground flex items-center gap-2">
                      <Phone size={16} />
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passengers" className="text-foreground flex items-center gap-2">
                      <Users size={16} />
                      Nombre de passagers *
                    </Label>
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      max="8"
                      value={formData.passengers}
                      onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-foreground flex items-center gap-2">
                      <CalendarBlank size={16} />
                      Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-foreground flex items-center gap-2">
                      <Clock size={16} />
                      Heure *
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupLocation" className="text-foreground flex items-center gap-2">
                    <MapPin size={16} />
                    Lieu de prise en charge *
                  </Label>
                  <PlacesAutocomplete
                    value={formData.pickupLocation}
                    onChange={(value, coords) => {
                      setFormData({ ...formData, pickupLocation: value })
                      setPickupCoordinates(coords)
                    }}
                    placeholder="Adresse de départ"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropoffLocation" className="text-foreground flex items-center gap-2">
                    <MapPin size={16} />
                    Destination *
                  </Label>
                  <PlacesAutocomplete
                    value={formData.dropoffLocation}
                    onChange={(value, coords) => {
                      setFormData({ ...formData, dropoffLocation: value })
                      setDropoffCoordinates(coords)
                    }}
                    placeholder="Adresse d'arrivée"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType" className="text-foreground flex items-center gap-2">
                    <Car size={16} />
                    Type de véhicule
                  </Label>
                  <select
                    id="vehicleType"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="eco">ECO</option>
                    <option value="business">BUSINESS CLASS</option>
                    <option value="van">VAN CLASS</option>
                    <option value="first">FIRST CLASS</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-foreground">
                    Informations complémentaires
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    className="bg-background border-border text-foreground min-h-[100px]"
                    placeholder="Informations supplémentaires..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-6 text-lg"
                >
                  Réserver maintenant
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
