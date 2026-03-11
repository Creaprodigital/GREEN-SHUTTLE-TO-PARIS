import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { MapPin, Calendar, Clock, Users, ArrowRight, ArrowLeft, User, Phone, EnvelopeSimple, CreditCard, Money, Bank, Check, Suitcase, CurrencyEur } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import PlacesAutocomplete from '@/components/PlacesAutocomplete'
import CircuitMap from '@/components/CircuitMap'
import { Booking } from '@/types/booking'
import { VehicleClass, DEFAULT_FLEET } from '@/types/fleet'
import { ServiceOption, VehiclePricing, DEFAULT_PRICING, DEFAULT_OPTIONS, PricingSettings } from '@/types/pricing'
import { Circuit } from '@/types/circuit'
import { PricingZone, ZoneForfait } from '@/components/ZoneForfaitManager'

export default function BookingForm() {
  const [bookings, setBookings] = useKV<Booking[]>('bookings', [] as Booking[])
  const [fleet] = useKV<VehicleClass[]>('fleet', DEFAULT_FLEET)
  const [serviceOptions] = useKV<ServiceOption[]>('service-options', DEFAULT_OPTIONS)
  const [pricing] = useKV<VehiclePricing[]>('pricing', DEFAULT_PRICING)
  const [circuits] = useKV<Circuit[]>('circuits', [])
  const [activePricingMode] = useKV<'high-demand' | 'low-season'>('active-pricing-mode', 'high-demand')
  const [pricingSettings] = useKV<PricingSettings>('pricing-settings', { roundToWholeEuro: false })
  const [pricingZones] = useKV<PricingZone[]>('pricing-zones', [])
  const [zoneForfaits] = useKV<ZoneForfait[]>('zone-forfaits', [])
  const [currentStep, setCurrentStep] = useState(1)
  
  const [serviceType, setServiceType] = useState<'transfer' | 'tour'>('transfer')
  const [transferType, setTransferType] = useState<'oneway' | 'roundtrip'>('oneway')
  const [hourlyDuration, setHourlyDuration] = useState('2')
  const [selectedCircuitId, setSelectedCircuitId] = useState('')
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [distanceKm, setDistanceKm] = useState<number>(0)
  const [durationMinutes, setDurationMinutes] = useState<number>(0)
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [returnTime, setReturnTime] = useState('')
  const [passengers, setPassengers] = useState('1')
  const [luggage, setLuggage] = useState('0')
  
  const [vehicleType, setVehicleType] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card')

  const isPointInPolygon = (point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]): boolean => {
    if (!polygon || polygon.length < 3) {
      console.log('⚠️ Polygone invalide:', polygon)
      return false
    }
    
    const x = point.lng
    const y = point.lat
    
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng
      const yi = polygon[i].lat
      const xj = polygon[j].lng
      const yj = polygon[j].lat
      
      const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }
    
    console.log(`   isPointInPolygon(lat=${point.lat}, lng=${point.lng}) dans polygone[${polygon.length} points] = ${inside}`)
    return inside
  }

  const findZoneForPoint = (point: { lat: number; lng: number } | null): PricingZone | null => {
    if (!point) {
      console.log('  ⚠️ findZoneForPoint - Point null')
      return null
    }
    
    if (!pricingZones || pricingZones.length === 0) {
      console.log('  ⚠️ findZoneForPoint - Aucune zone de pricing disponible')
      return null
    }
    
    console.log(`  🔍 findZoneForPoint - Recherche zone pour point (${point.lat}, ${point.lng})`)
    console.log(`  📍 Zones disponibles:`, pricingZones.map(z => `${z.name} (${z.polygon.length} points)`))
    
    for (const zone of pricingZones) {
      if (isPointInPolygon(point, zone.polygon)) {
        console.log(`  ✅ Zone trouvée: ${zone.name}`)
        return zone
      }
    }
    
    console.log('  ❌ Aucune zone trouvée pour ce point')
    return null
  }

  const findForfaitForRoute = (vehicleId: string): ZoneForfait | null => {
    if (!pickupCoords || !destinationCoords || !zoneForfaits || !pricingZones) {
      console.log('🔍 findForfaitForRoute - Données manquantes:', {
        pickupCoords: !!pickupCoords,
        destinationCoords: !!destinationCoords,
        zoneForfaits: zoneForfaits?.length || 0,
        pricingZones: pricingZones?.length || 0
      })
      return null
    }
    
    const fromZone = findZoneForPoint(pickupCoords)
    const toZone = findZoneForPoint(destinationCoords)
    
    console.log('🔍 findForfaitForRoute - Zones trouvées:', {
      fromZone: fromZone?.name || 'non trouvée',
      toZone: toZone?.name || 'non trouvée',
      pickupCoords,
      destinationCoords
    })
    
    if (!fromZone || !toZone) return null
    
    const forfait = zoneForfaits.find(
      f => f.fromZoneId === fromZone.id && f.toZoneId === toZone.id && f.vehicleId === vehicleId
    )
    
    console.log('🔍 findForfaitForRoute - Recherche forfait:', {
      fromZoneId: fromZone.id,
      toZoneId: toZone.id,
      vehicleId,
      forfaitTrouve: !!forfait,
      prixForfait: forfait?.fixedPrice,
      tousLesForfaits: zoneForfaits
    })
    
    return forfait || null
  }

  const vehiclePrices = useMemo(() => {
    const prices: Record<string, number> = {}
    
    console.log('=== RECALCUL DES PRIX ===')
    console.log('Fleet:', fleet?.length, 'véhicules')
    console.log('Pricing:', pricing?.length, 'tarifs')
    console.log('Service type:', serviceType)
    console.log('Distance:', distanceKm, 'km')
    console.log('Duration:', durationMinutes, 'min')
    console.log('Transfer type:', transferType)
    console.log('Hourly duration:', hourlyDuration)
    console.log('Active pricing mode:', activePricingMode)
    console.log('Selected options:', selectedOptions)
    console.log('Pickup coords:', pickupCoords)
    console.log('Destination coords:', destinationCoords)
    console.log('Zone forfaits disponibles:', zoneForfaits)
    console.log('Pricing zones disponibles:', pricingZones)
    
    if (!fleet || fleet.length === 0) {
      console.log('❌ Fleet vide ou manquant')
      return prices
    }

    if (!pricing || pricing.length === 0) {
      console.log('❌ Pricing vide ou manquant')
      return prices
    }

    fleet.forEach((vehicle) => {
      const vehiclePricing = pricing.find(p => p.vehicleId === vehicle.id)
      if (!vehiclePricing) {
        console.log(`❌ Pas de tarif pour ${vehicle.id}`)
        prices[vehicle.id] = 0
        return
      }

      console.log(`\n📊 Calcul pour ${vehicle.title} (${vehicle.id}):`)
      console.log('Tarif trouvé:', vehiclePricing)

      let basePrice = 0
      let usedForfait = false
      
      if (serviceType === 'transfer' && pickupCoords && destinationCoords) {
        console.log('🔍 PRIORITÉ 1: Recherche de forfait zone à zone pour:', vehicle.id)
        const forfait = findForfaitForRoute(vehicle.id)
        if (forfait) {
          basePrice = forfait.fixedPrice
          usedForfait = true
          const fromZone = findZoneForPoint(pickupCoords)
          const toZone = findZoneForPoint(destinationCoords)
          console.log(`💎 FORFAIT TROUVÉ ET APPLIQUÉ: ${fromZone?.name} → ${toZone?.name} = ${basePrice}€`)
          console.log(`✅ Forfait prioritaire utilisé - Les tarifs km/minute sont IGNORÉS`)
          console.log('Forfait details:', forfait)
          
          if (transferType === 'roundtrip') {
            basePrice *= 2
            console.log(`↔️ Aller-retour forfait: × 2 = ${basePrice.toFixed(2)}€`)
          }
          
          let totalPrice = basePrice

          const optionsPrice = selectedOptions.reduce((sum, optionId) => {
            const option = serviceOptions?.find(o => o.id === optionId)
            const price = option?.price || 0
            if (price > 0) {
              console.log(`   ➕ Option ${option?.name}: +${price}€`)
            }
            return sum + price
          }, 0)

          totalPrice = basePrice + optionsPrice
          
          if (pricingSettings?.roundToWholeEuro) {
            totalPrice = Math.ceil(totalPrice)
            console.log(`🔄 Prix arrondi à .00€: ${totalPrice.toFixed(2)}€`)
          }
          
          console.log(`✅ TOTAL ${vehicle.title} (FORFAIT): ${basePrice.toFixed(2)}€ forfait + ${optionsPrice.toFixed(2)}€ options = ${totalPrice.toFixed(2)}€`)
          
          prices[vehicle.id] = totalPrice
          return
        } else {
          console.log(`⚠️ Aucun forfait trouvé - Passage au calcul km/minute`)
        }
      }
      
      if (serviceType === 'hourly') {
        const hours = parseInt(hourlyDuration)
        const pricePerHour = activePricingMode === 'low-season' ? (vehiclePricing.lowSeasonPricePerHour || vehiclePricing.pricePerHour) : vehiclePricing.pricePerHour
        basePrice = pricePerHour * hours
        console.log(`⏱️ Hourly: ${hours}h × ${pricePerHour}€/h = ${basePrice}€`)
      } else if (serviceType === 'tour') {
        const selectedCircuit = circuits?.find(c => c.id === selectedCircuitId)
        if (selectedCircuit && selectedCircuit.price !== undefined) {
          basePrice = selectedCircuit.price
          console.log(`🗺️ Tour: prix personnalisé du circuit "${selectedCircuit.name}" = ${basePrice}€`)
        } else {
          basePrice = activePricingMode === 'low-season' ? (vehiclePricing.lowSeasonTourBasePrice || vehiclePricing.tourBasePrice) : vehiclePricing.tourBasePrice
          console.log(`🗺️ Tour: prix de base par défaut = ${basePrice}€`)
        }
      } else if (serviceType === 'transfer') {
        const pricePerKm = activePricingMode === 'low-season' ? (vehiclePricing.lowSeasonPricePerKm || vehiclePricing.pricePerKm) : vehiclePricing.pricePerKm
        const pricePerMinute = activePricingMode === 'low-season' ? (vehiclePricing.lowSeasonPricePerMinute || vehiclePricing.pricePerMinute) : vehiclePricing.pricePerMinute
        
        console.log(`💰 CALCUL KM/MIN (pas de forfait disponible) - Prix/km: ${pricePerKm}€, Prix/min: ${pricePerMinute}€`)
        
        if (distanceKm > 0 && durationMinutes > 0) {
          const kmPrice = pricePerKm * distanceKm
          const minutePrice = pricePerMinute * durationMinutes
          basePrice = kmPrice + minutePrice
          console.log(`🚗 Transfer: (${distanceKm}km × ${pricePerKm}€) + (${durationMinutes}min × ${pricePerMinute}€) = ${kmPrice.toFixed(2)}€ + ${minutePrice.toFixed(2)}€ = ${basePrice.toFixed(2)}€`)
          
          if (transferType === 'roundtrip') {
            basePrice *= 2
            console.log(`↔️ Aller-retour: × 2 = ${basePrice.toFixed(2)}€`)
          }
        } else if (pickup && destination) {
          basePrice = 0
          console.log(`📍 Adresses saisies mais distance non calculée, prix = 0`)
          
          if (transferType === 'roundtrip') {
            basePrice *= 2
            console.log(`↔️ Aller-retour: × 2 = ${basePrice.toFixed(2)}€`)
          }
        } else {
          basePrice = 0
          console.log('⚠️ Départ ou destination manquante, prix = 0')
        }
      }

      let totalPrice = basePrice

      const optionsPrice = selectedOptions.reduce((sum, optionId) => {
        const option = serviceOptions?.find(o => o.id === optionId)
        const price = option?.price || 0
        if (price > 0) {
          console.log(`   ➕ Option ${option?.name}: +${price}€`)
        }
        return sum + price
      }, 0)

      totalPrice = basePrice + optionsPrice
      
      if (pricingSettings?.roundToWholeEuro) {
        totalPrice = Math.ceil(totalPrice)
        console.log(`🔄 Prix arrondi à .00€: ${totalPrice.toFixed(2)}€`)
      }
      
      console.log(`✅ Total ${vehicle.title}: ${basePrice.toFixed(2)}€ + ${optionsPrice.toFixed(2)}€ options = ${totalPrice.toFixed(2)}€`)
      
      prices[vehicle.id] = totalPrice
    })

    console.log('📋 Prix finaux calculés:', prices)
    return prices
  }, [fleet, pricing, serviceType, hourlyDuration, activePricingMode, distanceKm, durationMinutes, transferType, selectedOptions, serviceOptions, pickup, destination, pricingSettings, pickupCoords, destinationCoords, selectedCircuitId, circuits, zoneForfaits, pricingZones])

  const calculatePrice = (vehicleId: string): number => {
    return vehiclePrices[vehicleId] || 0
  }

  useEffect(() => {
    if (serviceType !== 'transfer' || !pickupCoords || !destinationCoords) {
      setDistanceKm(0)
      setDurationMinutes(0)
      setIsCalculatingDistance(false)
      return
    }

    const google = (window as any).google
    if (!google || !google.maps) {
      console.error('Google Maps API non disponible')
      setIsCalculatingDistance(false)
      return
    }

    setIsCalculatingDistance(true)
    console.log('Calcul de la distance entre:', pickupCoords, 'et', destinationCoords)

    const service = new google.maps.DistanceMatrixService()
    service.getDistanceMatrix(
      {
        origins: [new google.maps.LatLng(pickupCoords.lat, pickupCoords.lng)],
        destinations: [new google.maps.LatLng(destinationCoords.lat, destinationCoords.lng)],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
      },
      (response: any, status: any) => {
        console.log('Distance Matrix API Status:', status)
        console.log('Distance Matrix API Response:', response)
        
        if (status === 'OK' && response.rows[0]?.elements[0]?.status === 'OK') {
          const element = response.rows[0].elements[0]
          const distanceMeters = element.distance.value
          const durationSeconds = element.duration.value
          const km = distanceMeters / 1000
          const minutes = Math.ceil(durationSeconds / 60)
          
          console.log('Distance calculée:', km, 'km')
          console.log('Durée calculée:', minutes, 'minutes')
          
          setDistanceKm(km)
          setDurationMinutes(minutes)
          setIsCalculatingDistance(false)
        } else {
          console.error('Erreur Distance Matrix:', status, response?.rows[0]?.elements[0]?.status)
          setDistanceKm(0)
          setDurationMinutes(0)
          setIsCalculatingDistance(false)
          toast.error('Impossible de calculer la distance. Veuillez réessayer.')
        }
      }
    )
  }, [pickupCoords, destinationCoords, serviceType])

  const validateStep1 = () => {
    if (!pickup || !date) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return false
    }
    if (serviceType === 'tour' && !selectedCircuitId) {
      toast.error('Veuillez sélectionner un circuit touristique')
      return false
    }
    if (serviceType === 'transfer' && !destination) {
      toast.error('Veuillez indiquer la destination')
      return false
    }
    if (serviceType === 'transfer' && transferType === 'roundtrip' && (!returnDate || !returnTime)) {
      toast.error('Veuillez indiquer la date et l\'heure de retour')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!vehicleType) {
      toast.error('Veuillez sélectionner un type de véhicule')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!firstName || !lastName || !phone || !email) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return false
    }
    if (!email.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    if (currentStep === 3 && !validateStep3()) return
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const calculatedPrice = calculatePrice(vehicleType)

    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: email,
      userEmail: email,
      serviceType,
      transferType: serviceType === 'transfer' ? transferType : undefined,
      hourlyDuration: serviceType === 'hourly' ? hourlyDuration : undefined,
      circuitId: serviceType === 'tour' ? selectedCircuitId : undefined,
      pickup,
      destination: serviceType === 'transfer' ? destination : undefined,
      date,
      time: serviceType !== 'tour' ? time : undefined,
      returnDate: serviceType === 'transfer' && transferType === 'roundtrip' ? returnDate : undefined,
      returnTime: serviceType === 'transfer' && transferType === 'roundtrip' ? returnTime : undefined,
      passengers,
      luggage: serviceType === 'transfer' ? luggage : undefined,
      vehicleType,
      selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
      firstName,
      lastName,
      phone,
      email,
      notes,
      paymentMethod,
      status: 'pending',
      createdAt: Date.now(),
      price: calculatedPrice
    }

    setBookings((current) => [...(current || []), newBooking])
    
    toast.success('Réservation enregistrée avec succès!', {
      description: `Un email de confirmation a été envoyé à ${email}`
    })

    setCurrentStep(1)
    setServiceType('transfer')
    setTransferType('oneway')
    setHourlyDuration('2')
    setSelectedCircuitId('')
    setPickup('')
    setDestination('')
    setPickupCoords(null)
    setDestinationCoords(null)
    setDistanceKm(0)
    setDurationMinutes(0)
    setDate('')
    setTime('')
    setReturnDate('')
    setReturnTime('')
    setPassengers('1')
    setLuggage('0')
    setVehicleType('')
    setSelectedOptions([])
    setFirstName('')
    setLastName('')
    setPhone('')
    setEmail('')
    setNotes('')
    setPaymentMethod('card')
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Informations du Trajet'
      case 2: return 'Choix du Véhicule'
      case 3: return 'Vos Informations'
      case 4: return 'Mode de Paiement'
      default: return 'Réservation'
    }
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
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  step === currentStep 
                    ? 'bg-accent text-accent-foreground' 
                    : step < currentStep 
                    ? 'bg-accent/50 text-accent-foreground' 
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {step < currentStep ? <Check size={20} weight="bold" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-1 ${step < currentStep ? 'bg-accent/50' : 'bg-secondary'}`} />
                )}
              </div>
            ))}
          </div>
          <CardTitle className="text-2xl font-semibold text-center uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
            {getStepTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <Tabs value={serviceType} onValueChange={(v) => setServiceType(v as 'transfer' | 'hourly' | 'tour')} className="mb-6">
                    <TabsList className="grid w-full grid-cols-3 bg-secondary">
                      <TabsTrigger value="transfer">Transfert</TabsTrigger>
                      <TabsTrigger value="hourly">Mise à Disposition</TabsTrigger>
                      <TabsTrigger value="tour">Circuit Touristique</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {serviceType === 'transfer' && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium uppercase tracking-wide mb-3 block">Type de Transfert</Label>
                      <RadioGroup value={transferType} onValueChange={(v) => setTransferType(v as 'oneway' | 'roundtrip')}>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <RadioGroupItem
                              value="oneway"
                              id="oneway"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="oneway"
                              className="flex items-center justify-center rounded-lg border-2 border-border bg-secondary p-3 cursor-pointer hover:bg-accent/10 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/20 transition-all font-medium uppercase tracking-wide text-sm"
                            >
                              Aller Simple
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="roundtrip"
                              id="roundtrip"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="roundtrip"
                              className="flex items-center justify-center rounded-lg border-2 border-border bg-secondary p-3 cursor-pointer hover:bg-accent/10 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/20 transition-all font-medium uppercase tracking-wide text-sm"
                            >
                              Aller-Retour
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {serviceType === 'hourly' && (
                    <div className="mb-4">
                      <Label htmlFor="hourlyDuration" className="text-sm font-medium uppercase tracking-wide">Nombre d'Heures</Label>
                      <div className="relative mt-2">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Select value={hourlyDuration} onValueChange={setHourlyDuration}>
                          <SelectTrigger id="hourlyDuration" className="pl-11 h-12 bg-secondary border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 23 }, (_, i) => i + 2).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Heure' : 'Heures'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {serviceType === 'tour' && (
                    <div className="mb-4">
                      <Label htmlFor="circuit-select" className="text-sm font-medium uppercase tracking-wide">Choisissez votre Circuit</Label>
                      <div className="relative mt-2">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} weight="fill" />
                        <Select value={selectedCircuitId} onValueChange={setSelectedCircuitId}>
                          <SelectTrigger id="circuit-select" className="pl-11 h-12 bg-secondary border-border">
                            <SelectValue placeholder="Sélectionnez un circuit..." />
                          </SelectTrigger>
                          <SelectContent>
                            {circuits && circuits.length > 0 ? (
                              circuits.map((circuit) => (
                                <SelectItem key={circuit.id} value={circuit.id}>
                                  {circuit.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>Aucun circuit disponible</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      {selectedCircuitId && circuits && (
                        <div className="mt-4 p-4 bg-accent/10 border-2 border-accent/30 rounded-lg">
                          <h4 className="text-sm font-semibold uppercase tracking-wide mb-2 text-accent">Description du Circuit</h4>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {circuits.find(c => c.id === selectedCircuitId)?.description || 'Aucune description disponible'}
                          </p>
                          {circuits.find(c => c.id === selectedCircuitId)?.stops && circuits.find(c => c.id === selectedCircuitId)!.stops.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-accent/20">
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                                Étapes du circuit ({circuits.find(c => c.id === selectedCircuitId)!.stops.length})
                              </p>
                              <div className="space-y-1">
                                {circuits.find(c => c.id === selectedCircuitId)!.stops.map((stop, idx) => (
                                  <div key={stop.id} className="flex items-start gap-2 text-xs">
                                    <span className="flex-shrink-0 w-5 h-5 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-[10px]">
                                      {idx + 1}
                                    </span>
                                    <span className="text-foreground/70 flex-1">{stop.address}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="pickup" className="text-sm font-medium uppercase tracking-wide">Lieu de Départ</Label>
                      <PlacesAutocomplete
                        id="pickup"
                        value={pickup}
                        onChange={(value, coords) => {
                          setPickup(value)
                          setPickupCoords(coords || null)
                        }}
                        placeholder="Adresse de départ"
                        className="h-12 bg-secondary border-border"
                        icon={<MapPin size={20} />}
                      />
                    </div>

                    {serviceType === 'transfer' && (
                      <div className="space-y-2">
                        <Label htmlFor="destination" className="text-sm font-medium uppercase tracking-wide">Destination</Label>
                        <PlacesAutocomplete
                          id="destination"
                          value={destination}
                          onChange={(value, coords) => {
                            setDestination(value)
                            setDestinationCoords(coords || null)
                          }}
                          placeholder="Adresse d'arrivée"
                          className="h-12 bg-secondary border-border"
                          icon={<MapPin size={20} weight="fill" />}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium uppercase tracking-wide">Date de Départ</Label>
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
                      <Label htmlFor="time" className="text-sm font-medium uppercase tracking-wide">Heure de Départ</Label>
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
                      <Label htmlFor="passengers" className="text-sm font-medium uppercase tracking-wide">Passagers</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Select value={passengers} onValueChange={setPassengers}>
                          <SelectTrigger id="passengers" className="pl-11 h-12 bg-secondary border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Passager' : 'Passagers'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {serviceType === 'transfer' && (
                      <div className="space-y-2">
                        <Label htmlFor="luggage" className="text-sm font-medium uppercase tracking-wide">Nombre de Valises</Label>
                        <div className="relative">
                          <Suitcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                          <Select value={luggage} onValueChange={setLuggage}>
                            <SelectTrigger id="luggage" className="pl-11 h-12 bg-secondary border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num <= 1 ? 'Valise' : 'Valises'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  {serviceType === 'tour' && selectedCircuitId && circuits && circuits.find(c => c.id === selectedCircuitId) && (
                    <div className="mt-5 border-t border-border pt-5">
                      <h4 className="text-sm font-medium uppercase tracking-wide mb-3 text-accent flex items-center gap-2">
                        <MapPin size={18} weight="fill" />
                        Itinéraire du Circuit
                      </h4>
                      <CircuitMap 
                        circuit={circuits.find(c => c.id === selectedCircuitId)!} 
                        className="h-80 w-full border-2 border-accent/30 rounded-lg overflow-hidden"
                      />
                    </div>
                  )}

                  {serviceType === 'transfer' && transferType === 'roundtrip' && (
                    <div className="border-t border-border pt-5 mt-2">
                      <h4 className="text-sm font-medium uppercase tracking-wide mb-4 text-accent">Informations de Retour</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="returnDate" className="text-sm font-medium uppercase tracking-wide">Date de Retour</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <Input
                              id="returnDate"
                              type="date"
                              value={returnDate}
                              onChange={(e) => setReturnDate(e.target.value)}
                              min={date || new Date().toISOString().split('T')[0]}
                              className="pl-11 h-12 bg-secondary border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="returnTime" className="text-sm font-medium uppercase tracking-wide">Heure de Retour</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <Input
                              id="returnTime"
                              type="time"
                              value={returnTime}
                              onChange={(e) => setReturnTime(e.target.value)}
                              className="pl-11 h-12 bg-secondary border-border"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={handleNext} className="w-full md:w-auto h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90 group font-medium uppercase tracking-widest">
                      Continuer
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {serviceType === 'transfer' && (
                    <div className="bg-accent/5 border-2 border-accent/20 rounded-lg p-4">
                      {isCalculatingDistance ? (
                        <div className="flex justify-center items-center text-sm text-muted-foreground py-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent mr-3"></div>
                          Calcul de la distance en cours...
                        </div>
                      ) : distanceKm > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col items-center justify-center p-3 bg-background rounded-md">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Distance</div>
                            <div className="text-2xl font-bold text-accent">{distanceKm.toFixed(1)} km</div>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 bg-background rounded-md">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Durée estimée</div>
                            <div className="text-2xl font-bold text-accent">{durationMinutes} min</div>
                          </div>
                        </div>
                      ) : (pickup && destination && !pickupCoords && !destinationCoords) ? (
                        <div className="text-center text-xs text-muted-foreground py-3">
                          ⚠️ Veuillez sélectionner une adresse dans la liste de suggestions pour calculer la distance
                        </div>
                      ) : (pickup && destination && (!pickupCoords || !destinationCoords)) ? (
                        <div className="text-center text-xs text-muted-foreground py-3">
                          ⚠️ Veuillez sélectionner {!pickupCoords ? 'le lieu de départ' : 'la destination'} dans la liste de suggestions
                        </div>
                      ) : (
                        <div className="text-center text-xs text-muted-foreground py-3">
                          Saisissez le départ et la destination pour calculer la distance
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Label className="text-sm font-medium uppercase tracking-wide">Sélectionnez votre véhicule</Label>
                    <RadioGroup value={vehicleType} onValueChange={setVehicleType}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fleet && fleet.length > 0 ? (
                          fleet.sort((a, b) => a.order - b.order).map((vehicle) => {
                            const vehiclePrice = calculatePrice(vehicle.id)
                            return (
                              <div key={vehicle.id}>
                                <RadioGroupItem
                                  value={vehicle.id}
                                  id={vehicle.id}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={vehicle.id}
                                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-border bg-secondary p-4 cursor-pointer hover:bg-accent/10 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/20 transition-all"
                                >
                                  {vehicle.image && (
                                    <div className="w-full h-32 rounded-md overflow-hidden bg-background">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.title}
                                        className="w-full h-full"
                                        style={{
                                          objectFit: vehicle.imageSettings?.fit || 'cover',
                                          objectPosition: `${vehicle.imageSettings?.positionX || 50}% ${vehicle.imageSettings?.positionY || 50}%`
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div className="text-center w-full">
                                    <div className="font-semibold uppercase tracking-wide">{vehicle.title}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{vehicle.description}</div>
                                    {vehiclePrice > 0 && (
                                      <div className="mt-3 pt-3 border-t border-border">
                                        <div className="flex items-center justify-center gap-1 text-accent font-bold text-lg">
                                          <CurrencyEur size={20} weight="bold" />
                                          <span>{vehiclePrice.toFixed(2)}</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-1">Véhicule avec Chauffeur</div>
                                      </div>
                                    )}
                                  </div>
                                </Label>
                              </div>
                            )
                          })
                        ) : (
                          <div className="col-span-2 text-center text-muted-foreground py-8">
                            Aucun véhicule disponible
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </div>

                  {serviceOptions && serviceOptions.length > 0 && (
                    <div className="space-y-4 pt-6 border-t border-border">
                      <Label className="text-sm font-medium uppercase tracking-wide">Options Supplémentaires</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {serviceOptions.map((option) => (
                          <div key={option.id} className="flex items-start space-x-3 p-4 border-2 border-border rounded-lg hover:border-accent/50 transition-colors">
                            <Checkbox
                              id={option.id}
                              checked={selectedOptions.includes(option.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedOptions([...selectedOptions, option.id])
                                } else {
                                  setSelectedOptions(selectedOptions.filter(id => id !== option.id))
                                }
                              }}
                              className="mt-1"
                            />
                            <div className="flex-1 cursor-pointer" onClick={() => {
                              const checkbox = document.getElementById(option.id) as HTMLButtonElement
                              if (checkbox) checkbox.click()
                            }}>
                              <Label htmlFor={option.id} className="font-semibold text-sm cursor-pointer">
                                {option.name}
                                {option.price > 0 && <span className="text-accent ml-2">+{option.price}€</span>}
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {vehicleType && (
                    <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-5 space-y-3">
                      <h4 className="font-semibold uppercase tracking-wide text-sm flex items-center gap-2">
                        <CurrencyEur size={18} weight="bold" />
                        Prix de la Course
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Véhicule avec Chauffeur:</span>
                          <span className="font-medium">{fleet?.find(v => v.id === vehicleType)?.title}</span>
                        </div>
                        {serviceType === 'transfer' && (
                          <>
                            {isCalculatingDistance ? (
                              <div className="flex justify-center items-center text-xs text-muted-foreground py-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent border-t-transparent mr-2"></div>
                                Calcul de la distance en cours...
                              </div>
                            ) : distanceKm > 0 ? (
                              <>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground">Distance:</span>
                                  <span className="font-medium">{distanceKm.toFixed(1)} km</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground">Durée estimée:</span>
                                  <span className="font-medium">{durationMinutes} min</span>
                                </div>
                              </>
                            ) : null}
                          </>
                        )}
                        {serviceType === 'hourly' && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Durée:</span>
                            <span className="font-medium">{hourlyDuration} heure{parseInt(hourlyDuration) > 1 ? 's' : ''}</span>
                          </div>
                        )}
                        {selectedOptions.length > 0 && (
                          <>
                            {selectedOptions.map(optionId => {
                              const option = serviceOptions?.find(o => o.id === optionId)
                              if (!option || option.price === 0) return null
                              return (
                                <div key={optionId} className="flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground">{option.name}:</span>
                                  <span className="font-medium">+{option.price.toFixed(2)}€</span>
                                </div>
                              )
                            })}
                          </>
                        )}
                        <div className="border-t border-accent/20 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold uppercase tracking-wide">Total:</span>
                            <span className="text-2xl font-bold text-accent">{calculatePrice(vehicleType).toFixed(2)}€</span>
                          </div>
                        </div>
                        </div>
                      </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button type="button" onClick={handleBack} variant="outline" className="h-12 px-8 text-base font-medium uppercase tracking-widest">
                      <ArrowLeft className="mr-2" size={20} />
                      Retour
                    </Button>
                    <Button type="button" onClick={handleNext} className="h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90 group font-medium uppercase tracking-widest">
                      Continuer
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium uppercase tracking-wide">Prénom *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Votre prénom"
                          className="pl-11 h-12 bg-secondary border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium uppercase tracking-wide">Nom *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Votre nom"
                          className="pl-11 h-12 bg-secondary border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium uppercase tracking-wide">Téléphone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+33 1 23 45 67 89"
                          className="pl-11 h-12 bg-secondary border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium uppercase tracking-wide">Email *</Label>
                      <div className="relative">
                        <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@email.com"
                          className="pl-11 h-12 bg-secondary border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes" className="text-sm font-medium uppercase tracking-wide">Notes (Optionnel)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Informations supplémentaires (bagages, besoins spéciaux, etc.)"
                        className="min-h-24 bg-secondary border-border resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" onClick={handleBack} variant="outline" className="h-12 px-8 text-base font-medium uppercase tracking-widest">
                      <ArrowLeft className="mr-2" size={20} />
                      Retour
                    </Button>
                    <Button type="button" onClick={handleNext} className="h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90 group font-medium uppercase tracking-widest">
                      Continuer
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="space-y-4">
                    <Label className="text-sm font-medium uppercase tracking-wide">Mode de paiement</Label>
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'card' | 'cash' | 'transfer')}>
                      <div className="space-y-3">
                        <div>
                          <RadioGroupItem
                            value="card"
                            id="card"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="card"
                            className="flex items-center gap-4 rounded-lg border-2 border-border bg-secondary p-4 cursor-pointer hover:bg-accent/10 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/20 transition-all"
                          >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                              <CreditCard size={24} className="text-accent" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold uppercase tracking-wide">Carte Bancaire</div>
                              <div className="text-xs text-muted-foreground mt-1">Paiement sécurisé par carte</div>
                            </div>
                          </Label>
                        </div>

                        <div>
                          <RadioGroupItem
                            value="cash"
                            id="cash"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="cash"
                            className="flex items-center gap-4 rounded-lg border-2 border-border bg-secondary p-4 cursor-pointer hover:bg-accent/10 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/20 transition-all"
                          >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                              <Money size={24} className="text-accent" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold uppercase tracking-wide">Espèces</div>
                              <div className="text-xs text-muted-foreground mt-1">Paiement en espèces au chauffeur</div>
                            </div>
                          </Label>
                        </div>

                        <div>
                          <RadioGroupItem
                            value="transfer"
                            id="transfer"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="transfer"
                            className="flex items-center gap-4 rounded-lg border-2 border-border bg-secondary p-4 cursor-pointer hover:bg-accent/10 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/20 transition-all"
                          >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                              <Bank size={24} className="text-accent" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold uppercase tracking-wide">Virement Bancaire</div>
                              <div className="text-xs text-muted-foreground mt-1">Paiement par virement</div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold uppercase tracking-wide text-sm">Récapitulatif</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service:</span>
                        <span className="font-medium">
                          {serviceType === 'transfer' ? 'Transfert' : serviceType === 'hourly' ? 'Mise à Disposition' : 'Circuit Touristique'}
                          {serviceType === 'transfer' && ` (${transferType === 'oneway' ? 'Aller Simple' : 'Aller-Retour'})`}
                          {serviceType === 'hourly' && ` (${hourlyDuration}h)`}
                        </span>
                      </div>
                      {serviceType === 'tour' && selectedCircuitId && circuits && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Circuit:</span>
                          <span className="font-medium text-right">{circuits.find(c => c.id === selectedCircuitId)?.name || '-'}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Départ:</span>
                        <span className="font-medium text-right">{pickup || '-'}</span>
                      </div>
                      {serviceType === 'transfer' && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Destination:</span>
                          <span className="font-medium text-right">{destination || '-'}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date départ:</span>
                        <span className="font-medium">{date || '-'}{time && ` à ${time}`}</span>
                      </div>
                      {serviceType === 'transfer' && transferType === 'roundtrip' && returnDate && returnTime && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date retour:</span>
                          <span className="font-medium">{returnDate} à {returnTime}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Véhicule:</span>
                        <span className="font-medium">{fleet?.find(v => v.id === vehicleType)?.title || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Passagers:</span>
                        <span className="font-medium">{passengers}</span>
                      </div>
                      {serviceType === 'transfer' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valises:</span>
                            <span className="font-medium">{luggage}</span>
                          </div>
                          {distanceKm > 0 && (
                            <>
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Distance:</span>
                                <span className="font-medium">{distanceKm.toFixed(1)} km</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Durée estimée:</span>
                                <span className="font-medium">{durationMinutes} min</span>
                              </div>
                            </>
                          )}
                        </>
                      )}
                      {serviceType === 'hourly' && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Durée:</span>
                          <span className="font-medium">{hourlyDuration} heure{parseInt(hourlyDuration) > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span className="font-medium">{firstName} {lastName}</span>
                      </div>
                      {selectedOptions.length > 0 && (
                        <>
                          <div className="border-t border-accent/20 pt-2 mt-2">
                            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Options:</div>
                            {selectedOptions.map(optionId => {
                              const option = serviceOptions?.find(o => o.id === optionId)
                              if (!option) return null
                              return (
                                <div key={optionId} className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">{option.name}:</span>
                                  <span className="font-medium">{option.price > 0 ? `+${option.price.toFixed(2)}€` : 'Inclus'}</span>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )}
                      {vehicleType && (
                        <div className="border-t border-accent/20 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold uppercase tracking-wide">Prix Total:</span>
                            <span className="text-2xl font-bold text-accent flex items-center gap-1">
                              <CurrencyEur size={20} weight="bold" />
                              {calculatePrice(vehicleType).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="button" onClick={handleBack} variant="outline" className="h-12 px-8 text-base font-medium uppercase tracking-widest">
                      <ArrowLeft className="mr-2" size={20} />
                      Retour
                    </Button>
                    <Button type="submit" className="h-12 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90 group font-medium uppercase tracking-widest">
                      Confirmer
                      <Check className="ml-2 group-hover:scale-110 transition-transform" size={20} weight="bold" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
