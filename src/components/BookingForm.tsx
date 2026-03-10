import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MapPin, Calendar, Clock, Users, ArrowRight, ArrowLeft, User, Phone, EnvelopeSimple, CreditCard, Money, Bank, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import PlacesAutocomplete from '@/components/PlacesAutocomplete'
import { Booking } from '@/types/booking'
import { VehicleClass } from '@/types/fleet'

export default function BookingForm() {
  const [bookings, setBookings] = useKV<Booking[]>('bookings', [] as Booking[])
  const [fleet] = useKV<VehicleClass[]>('fleet', [])
  const [currentStep, setCurrentStep] = useState(1)
  
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'hourly'>('oneway')
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [returnTime, setReturnTime] = useState('')
  const [passengers, setPassengers] = useState('1')
  
  const [vehicleType, setVehicleType] = useState('')
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card')

  const validateStep1 = () => {
    if (!pickup || !destination || !date || !time) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return false
    }
    if (tripType === 'roundtrip' && (!returnDate || !returnTime)) {
      toast.error('Veuillez remplir les informations de retour')
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

    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: email,
      userEmail: email,
      tripType,
      pickup,
      destination,
      date,
      time,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      returnTime: tripType === 'roundtrip' ? returnTime : undefined,
      passengers,
      vehicleType,
      firstName,
      lastName,
      phone,
      email,
      notes,
      paymentMethod,
      status: 'pending',
      createdAt: Date.now()
    }

    setBookings((current) => [...(current || []), newBooking])
    
    toast.success('Réservation enregistrée avec succès!', {
      description: `Un email de confirmation a été envoyé à ${email}`
    })

    setCurrentStep(1)
    setPickup('')
    setDestination('')
    setDate('')
    setTime('')
    setReturnDate('')
    setReturnTime('')
    setPassengers('1')
    setVehicleType('')
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
                  <Tabs value={tripType} onValueChange={(v) => setTripType(v as 'oneway' | 'roundtrip' | 'hourly')} className="mb-6">
                    <TabsList className="grid w-full grid-cols-3 bg-secondary">
                      <TabsTrigger value="oneway">Aller Simple</TabsTrigger>
                      <TabsTrigger value="roundtrip">Aller-Retour</TabsTrigger>
                      <TabsTrigger value="hourly">À l'heure</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="pickup" className="text-sm font-medium uppercase tracking-wide">Lieu de Prise en Charge</Label>
                      <PlacesAutocomplete
                        id="pickup"
                        value={pickup}
                        onChange={setPickup}
                        placeholder="Adresse de départ"
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
                        placeholder="Adresse d'arrivée"
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
                      <Label htmlFor="time" className="text-sm font-medium uppercase tracking-wide">Heure</Label>
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

                    {tripType === 'roundtrip' && (
                      <>
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
                      </>
                    )}

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
                  </div>

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
                  <div className="space-y-4">
                    <Label className="text-sm font-medium uppercase tracking-wide">Sélectionnez votre véhicule</Label>
                    <RadioGroup value={vehicleType} onValueChange={setVehicleType}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fleet && fleet.length > 0 ? (
                          fleet.sort((a, b) => a.order - b.order).map((vehicle) => (
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
                                <div className="text-center">
                                  <div className="font-semibold uppercase tracking-wide">{vehicle.title}</div>
                                  <div className="text-xs text-muted-foreground mt-1">{vehicle.description}</div>
                                </div>
                              </Label>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center text-muted-foreground py-8">
                            Aucun véhicule disponible
                          </div>
                        )}
                      </div>
                    </RadioGroup>
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
                        <span className="text-muted-foreground">Trajet:</span>
                        <span className="font-medium">{tripType === 'oneway' ? 'Aller Simple' : tripType === 'roundtrip' ? 'Aller-Retour' : 'À l\'heure'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">De:</span>
                        <span className="font-medium text-right">{pickup || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">À:</span>
                        <span className="font-medium text-right">{destination || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{date || '-'} à {time || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Véhicule:</span>
                        <span className="font-medium">{fleet?.find(v => v.id === vehicleType)?.title || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Passagers:</span>
                        <span className="font-medium">{passengers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span className="font-medium">{firstName} {lastName}</span>
                      </div>
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
