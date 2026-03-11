import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Car, MapPin, Calendar, Clock, User as UserIcon, Trash, ShieldCheck, Plus, Key, Upload, Image as ImageIcon, Check, MagnifyingGlassPlus, ArrowsOutSimple, X, CurrencyCircleDollar, Sparkle, Info, EnvelopeSimple } from '@phosphor-icons/react'
import { Booking } from '@/types/booking'
import { VehicleClass, DEFAULT_FLEET } from '@/types/fleet'
import { VehiclePricing, DEFAULT_PRICING, ServiceOption, DEFAULT_OPTIONS, PricingSettings } from '@/types/pricing'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CircuitManager from '@/components/CircuitManager'
import ZoneForfaitManager from '@/components/ZoneForfaitManager'
import PromoCodeManager from '@/components/PromoCodeManager'
import SharedRideManager from '@/components/SharedRideManager'
import { useKV } from '@github/spark/hooks'
import { TelegramSettings, DEFAULT_TELEGRAM_SETTINGS } from '@/types/telegram'
import { RoundTripDiscount, DEFAULT_ROUNDTRIP_DISCOUNT } from '@/types/promo'
import { EmailSettings, DEFAULT_EMAIL_SETTINGS } from '@/types/email'
import { sendBookingUpdate, sendBookingConfirmation } from '@/lib/email'

interface AdminAccount {
  email: string
  password: string
  createdAt: string
}

interface AdminDashboardProps {
  userEmail: string
  bookings: Booking[]
  onLogout: () => void
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void
  onDeleteBooking: (id: string) => void
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



export default function AdminDashboard({ userEmail, bookings, onLogout, onUpdateBooking, onDeleteBooking, onNavigateToHome, onNavigateToServices, onNavigateToAbout, onNavigateToContact }: AdminDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [adminAccounts, setAdminAccounts] = useKV<AdminAccount[]>('admin-accounts', [
    { email: 'admin@greenshuttle.com', password: 'admin123', createdAt: new Date().toISOString() }
  ])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  
  const [fleetData, setFleetData] = useKV<VehicleClass[]>('fleet', DEFAULT_FLEET)
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState<string>('')
  const [editedDescription, setEditedDescription] = useState<string>('')
  const [editingImage, setEditingImage] = useState<string | null>(null)
  const [imageZoom, setImageZoom] = useState<number>(100)
  const [imagePosition, setImagePosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 })
  const [imageFit, setImageFit] = useState<'cover' | 'contain' | 'fill'>('cover')
  const [hasImageChanges, setHasImageChanges] = useState(false)
  const [newVehicleTitle, setNewVehicleTitle] = useState('')
  const [newVehicleDescription, setNewVehicleDescription] = useState('')

  const [pricingData, setPricingData] = useKV<VehiclePricing[]>('pricing', DEFAULT_PRICING)
  const [optionsData, setOptionsData] = useKV<ServiceOption[]>('service-options', DEFAULT_OPTIONS)
  const [newOptionName, setNewOptionName] = useState('')
  const [newOptionDescription, setNewOptionDescription] = useState('')
  const [newOptionPrice, setNewOptionPrice] = useState('')
  const [activePricingMode, setActivePricingMode] = useKV<'high-demand' | 'low-season'>('active-pricing-mode', 'high-demand')
  const [pricingSettings, setPricingSettings] = useKV<PricingSettings>('pricing-settings', { roundToWholeEuro: false })
  
  const [telegramSettings, setTelegramSettings] = useKV<TelegramSettings>('telegram-settings', DEFAULT_TELEGRAM_SETTINGS)
  const [roundTripDiscount, setRoundTripDiscount] = useKV<RoundTripDiscount>('roundtrip-discount', DEFAULT_ROUNDTRIP_DISCOUNT)
  const [emailSettings, setEmailSettings] = useKV<EmailSettings>('email-settings', DEFAULT_EMAIL_SETTINGS)

  useEffect(() => {
    if (!fleetData || !pricingData) return
    
    const validVehicleIds = fleetData.map(v => v.id)
    const invalidPricings = pricingData.filter(p => !validVehicleIds.includes(p.vehicleId))
    
    if (invalidPricings.length > 0) {
      const validPricings = pricingData.filter(p => validVehicleIds.includes(p.vehicleId))
      const missingPricings = fleetData
        .filter(v => !pricingData.some(p => p.vehicleId === v.id))
        .map(v => {
          const defaultPricing = DEFAULT_PRICING.find(p => p.vehicleId === v.id)
          if (defaultPricing) return defaultPricing
          
          return {
            vehicleId: v.id,
            pricePerKm: 0,
            pricePerMinute: 0,
            tourBasePrice: 0,
            lowSeasonPricePerKm: 0,
            lowSeasonPricePerMinute: 0,
            lowSeasonTourBasePrice: 0
          }
        })
      
      setPricingData([...validPricings, ...missingPricings])
      toast.info(`Tarifs synchronisés avec la flotte: ${invalidPricings.length} supprimé(s), ${missingPricings.length} ajouté(s)`)
    }
    
    const missingVehicles = fleetData.filter(v => !pricingData.some(p => p.vehicleId === v.id))
    if (missingVehicles.length > 0 && invalidPricings.length === 0) {
      const newPricings = missingVehicles.map(v => {
        const defaultPricing = DEFAULT_PRICING.find(p => p.vehicleId === v.id)
        if (defaultPricing) return defaultPricing
        
        return {
          vehicleId: v.id,
          pricePerKm: 0,
          pricePerMinute: 0,
          tourBasePrice: 0,
          lowSeasonPricePerKm: 0,
          lowSeasonPricePerMinute: 0,
          lowSeasonTourBasePrice: 0
        }
      })
      
      setPricingData((current) => [...(current || []), ...newPricings])
      toast.info(`${missingVehicles.length} tarif(s) créé(s) pour les nouveaux véhicules`)
    }
  }, [fleetData, pricingData, setPricingData])

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus
    const matchesSearch = !searchTerm || 
      b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.destination?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  }

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    const booking = bookings.find(b => b.id === bookingId)
    const previousStatus = booking?.status
    
    onUpdateBooking(bookingId, { status: newStatus })
    toast.success(`Booking status updated to ${newStatus}`)
    
    if (emailSettings?.enabled && emailSettings?.sendUpdatesToClient && booking && previousStatus !== newStatus) {
      const updatedBooking = { ...booking, status: newStatus }
      const result = await sendBookingUpdate(updatedBooking, emailSettings, previousStatus)
      
      if (result.success) {
        toast.success('Email de mise à jour envoyé au client')
      }
    }
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

  const handleAddAdmin = () => {
    if (!newAdminEmail || !newAdminPassword) {
      toast.error('Please enter both email and password')
      return
    }

    if (!newAdminEmail.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }

    const existingAdmin = adminAccounts?.find(
      acc => acc.email.toLowerCase() === newAdminEmail.toLowerCase()
    )

    if (existingAdmin) {
      toast.error('Admin account already exists')
      return
    }

    setAdminAccounts((current) => [
      ...(current || []),
      {
        email: newAdminEmail,
        password: newAdminPassword,
        createdAt: new Date().toISOString()
      }
    ])

    setNewAdminEmail('')
    setNewAdminPassword('')
    toast.success('Admin account created successfully')
  }

  const handleDeleteAdmin = (email: string) => {
    if (adminAccounts && adminAccounts.length <= 1) {
      toast.error('Cannot delete the last admin account')
      return
    }

    if (confirm(`Delete admin account: ${email}?`)) {
      setAdminAccounts((current) => 
        (current || []).filter(acc => acc.email !== email)
      )
      toast.success('Admin account deleted')
    }
  }

  const handleImageUpload = async (vehicleId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez uploader un fichier image')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('L\'image doit faire moins de 5MB')
      return
    }

    setUploadingImage(vehicleId)
    
    try {
      const generateUniqueFileName = (originalName: string): string => {
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const extension = originalName.substring(originalName.lastIndexOf('.'))
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'))
        return `${nameWithoutExt}_${timestamp}_${randomStr}${extension}`
      }

      const uniqueFileName = generateUniqueFileName(file.name)
      
      const result = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target?.result as string
          if (data) {
            resolve(data)
          } else {
            reject(new Error('No data'))
          }
        }
        reader.onerror = () => reject(new Error('FileReader error'))
        reader.readAsDataURL(file)
      })

      setFleetData((currentData) => {
        const data = Array.isArray(currentData) ? currentData : DEFAULT_FLEET
        const updated = data.map((vehicle) => {
          if (vehicle.id === vehicleId) {
            return { ...vehicle, image: result, imageName: uniqueFileName }
          }
          return vehicle
        })
        return updated
      })
      
      setUploadingImage(null)
      toast.success(`Image "${uniqueFileName}" téléchargée avec succès`)
    } catch (error) {
      setUploadingImage(null)
      toast.error('Erreur lors du téléchargement de l\'image')
      console.error('Upload error:', error)
    }
  }

  const handleUpdateVehicle = (vehicleId: string, updates: Partial<VehicleClass>) => {
    setFleetData((current) => {
      const data = Array.isArray(current) ? current : DEFAULT_FLEET
      return data.map((vehicle) =>
        vehicle.id === vehicleId
          ? { ...vehicle, ...updates }
          : vehicle
      )
    })
    setEditingVehicle(null)
    toast.success('Vehicle updated successfully')
  }

  const handleAddVehicle = () => {
    if (!newVehicleTitle || !newVehicleDescription) {
      toast.error('Please enter both title and description')
      return
    }

    setFleetData((current) => {
      const data = Array.isArray(current) ? current : DEFAULT_FLEET
      const maxOrder = Math.max(...data.map(v => v.order), 0)
      const newId = `vehicle-${Date.now()}`
      
      return [
        ...data,
        {
          id: newId,
          title: newVehicleTitle,
          description: newVehicleDescription,
          image: '',
          order: maxOrder + 1
        }
      ]
    })

    setNewVehicleTitle('')
    setNewVehicleDescription('')
    toast.success('Vehicle added successfully')
  }

  const handleDeleteVehicle = (vehicleId: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      setFleetData((current) => {
        const data = Array.isArray(current) ? current : DEFAULT_FLEET
        return data.filter((vehicle) => vehicle.id !== vehicleId)
      })
      toast.success('Vehicle deleted')
    }
  }

  const handleUpdatePricing = (vehicleId: string, field: keyof VehiclePricing, value: number) => {
    setPricingData((current) => {
      const data = Array.isArray(current) ? current : DEFAULT_PRICING
      const existingIndex = data.findIndex(p => p.vehicleId === vehicleId)
      
      if (existingIndex >= 0) {
        return data.map((pricing, idx) =>
          idx === existingIndex ? { ...pricing, [field]: value } : pricing
        )
      } else {
        const defaultPricing = DEFAULT_PRICING.find(p => p.vehicleId === vehicleId) || {
          vehicleId,
          pricePerKm: 0,
          pricePerMinute: 0,
          pricePerHour: 0,
          tourBasePrice: 0,
          minimumTransferPrice: 0,
          lowSeasonPricePerKm: 0,
          lowSeasonPricePerMinute: 0,
          lowSeasonPricePerHour: 0,
          lowSeasonTourBasePrice: 0,
          lowSeasonMinimumTransferPrice: 0
        }
        return [...data, {
          ...defaultPricing,
          [field]: value
        }]
      }
    })
    toast.success('Tarif mis à jour')
  }

  const handleTogglePricingMode = () => {
    setActivePricingMode((current) => {
      const newMode = current === 'high-demand' ? 'low-season' : 'high-demand'
      toast.success(`Mode basculé vers: ${newMode === 'high-demand' ? 'Tarifs Forte demande' : 'Tarifs Basse Saison'}`)
      return newMode
    })
  }

  const handleAddOption = () => {
    if (!newOptionName || !newOptionDescription) {
      toast.error('Veuillez remplir le nom et la description')
      return
    }

    const price = parseFloat(newOptionPrice) || 0

    setOptionsData((current) => [
      ...(current || []),
      {
        id: `option-${Date.now()}`,
        name: newOptionName,
        description: newOptionDescription,
        price
      }
    ])

    setNewOptionName('')
    setNewOptionDescription('')
    setNewOptionPrice('')
    toast.success('Option ajoutée avec succès')
  }

  const handleUpdateOption = (id: string, updates: Partial<ServiceOption>) => {
    setOptionsData((current) => {
      const data = Array.isArray(current) ? current : DEFAULT_OPTIONS
      return data.map((option) =>
        option.id === id ? { ...option, ...updates } : option
      )
    })
    toast.success('Option mise à jour')
  }

  const handleDeleteOption = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette option?')) {
      setOptionsData((current) => {
        const data = Array.isArray(current) ? current : DEFAULT_OPTIONS
        return data.filter((option) => option.id !== id)
      })
      toast.success('Option supprimée')
    }
  }


  return (
    <>
      <Header 
        onNavigateToHome={onNavigateToHome}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToContact={onNavigateToContact}
        onLogout={onLogout}
        userEmail={userEmail}
        isAdmin={true}
      />
      <div className="min-h-screen bg-background pt-20">

      <Dialog open={editingImage !== null} onOpenChange={(open) => !open && setEditingImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase tracking-wide">
              {editingImage && (Array.isArray(fleetData) ? fleetData : DEFAULT_FLEET).find(v => v.id === editingImage)?.title} - Modifier l'image
            </DialogTitle>
          </DialogHeader>
          
          {editingImage && (() => {
            const data = Array.isArray(fleetData) ? fleetData : DEFAULT_FLEET
            const vehicle = data.find(v => v.id === editingImage)
            return vehicle?.image && (
            <div className="space-y-6 pt-4">
              <div 
                className="relative aspect-[4/3] bg-muted/50 border-2 border-border overflow-hidden"
                style={{
                  backgroundImage: `url(${vehicle.image})`,
                  backgroundSize: imageFit,
                  backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                  backgroundRepeat: 'no-repeat',
                  transform: `scale(${imageZoom / 100})`
                }}
              />

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium uppercase tracking-wide">
                      Zoom: {imageZoom}%
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImageZoom(100)
                        setHasImageChanges(true)
                      }}
                    >
                      Réinitialiser
                    </Button>
                  </div>
                  <Slider
                    value={[imageZoom]}
                    onValueChange={(value) => {
                      setImageZoom(value[0])
                      setHasImageChanges(true)
                    }}
                    min={50}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium uppercase tracking-wide">
                    Mode d'affichage
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={imageFit === 'cover' ? 'default' : 'outline'}
                      onClick={() => {
                        setImageFit('cover')
                        setHasImageChanges(true)
                      }}
                      className="h-12"
                    >
                      Couvrir
                    </Button>
                    <Button
                      variant={imageFit === 'contain' ? 'default' : 'outline'}
                      onClick={() => {
                        setImageFit('contain')
                        setHasImageChanges(true)
                      }}
                      className="h-12"
                    >
                      Contenir
                    </Button>
                    <Button
                      variant={imageFit === 'fill' ? 'default' : 'outline'}
                      onClick={() => {
                        setImageFit('fill')
                        setHasImageChanges(true)
                      }}
                      className="h-12"
                    >
                      Remplir
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium uppercase tracking-wide">
                    Position horizontale: {imagePosition.x}%
                  </Label>
                  <Slider
                    value={[imagePosition.x]}
                    onValueChange={(value) => {
                      setImagePosition(prev => ({ ...prev, x: value[0] }))
                      setHasImageChanges(true)
                    }}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium uppercase tracking-wide">
                    Position verticale: {imagePosition.y}%
                  </Label>
                  <Slider
                    value={[imagePosition.y]}
                    onValueChange={(value) => {
                      setImagePosition(prev => ({ ...prev, y: value[0] }))
                      setHasImageChanges(true)
                    }}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ajustez l'affichage de l'image et cliquez sur "Enregistrer" pour appliquer les modifications.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (editingImage) {
                          setFleetData((current) => {
                            const data = Array.isArray(current) ? current : DEFAULT_FLEET
                            return data.map((vehicle) =>
                              vehicle.id === editingImage
                                ? {
                                    ...vehicle,
                                    imageSettings: {
                                      fit: imageFit,
                                      positionX: imagePosition.x,
                                      positionY: imagePosition.y
                                    }
                                  }
                                : vehicle
                            )
                          })
                          toast.success('Paramètres d\'affichage enregistrés')
                          setEditingImage(null)
                          setHasImageChanges(false)
                        }
                      }}
                      className="flex-1 h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
                      disabled={!hasImageChanges}
                    >
                      <Check className="mr-2" size={20} />
                      Enregistrer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingImage(null)
                        setHasImageChanges(false)
                      }}
                      className="h-12 px-6"
                    >
                      Fermer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <Tabs defaultValue="bookings" className="w-full">
          <div className="w-full overflow-x-auto mb-6 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:max-w-6xl sm:mx-auto sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1 h-auto p-1">
              <TabsTrigger value="bookings" className="text-xs sm:text-sm px-3 sm:px-2 py-2.5 whitespace-nowrap">Réservations</TabsTrigger>
              <TabsTrigger value="shared-rides" className="text-xs sm:text-sm px-3 sm:px-2 py-2.5 whitespace-nowrap">Partagés</TabsTrigger>
              <TabsTrigger value="fleet" className="text-xs sm:text-sm px-3 sm:px-2 py-2.5 whitespace-nowrap">Véhicules</TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs sm:text-sm px-3 sm:px-2 py-2.5 whitespace-nowrap">Tarifs</TabsTrigger>
              <TabsTrigger value="options" className="text-xs sm:text-sm px-3 sm:px-2 py-2.5 whitespace-nowrap">Options</TabsTrigger>
              <TabsTrigger value="circuits" className="text-xs sm:text-sm px-3 sm:px-2 py-2.5 whitespace-nowrap">Circuits</TabsTrigger>
              <TabsTrigger value="promos" className="text-xs sm:text-sm px-3 sm:px-2 py-2.5 whitespace-nowrap">Promos</TabsTrigger>
              <TabsTrigger value="admins" className="text-xs sm:text-sm px-3 sm:px-2 py-2.5 whitespace-nowrap">Admins</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm px-3 sm:px-2 py-2.5 whitespace-nowrap">Paramètres</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="admins" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Admin Accounts
              </h2>
              <p className="text-foreground/70">
                Manage administrator access to the dashboard
              </p>
            </div>

            <Card className="border-2 border-accent/20 mb-6">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl font-semibold uppercase tracking-wide flex items-center gap-2">
                  <Plus size={24} className="text-accent" />
                  Add New Admin
                </CardTitle>
                <CardDescription>Create a new administrator account</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-email" className="text-sm font-medium uppercase tracking-wide">
                      Email Address
                    </Label>
                    <Input
                      id="new-admin-email"
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="h-12 bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-password" className="text-sm font-medium uppercase tracking-wide">
                      Password
                    </Label>
                    <Input
                      id="new-admin-password"
                      type="text"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Enter password"
                      className="h-12 bg-secondary border-border"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddAdmin}
                  className="w-full md:w-auto h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
                >
                  <Plus className="mr-2" size={20} />
                  Create Admin Account
                </Button>
              </CardContent>
            </Card>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Existing Admin Accounts ({adminAccounts?.length || 0})
              </h3>
            </div>

            {(!adminAccounts || adminAccounts.length === 0) ? (
              <Card className="border-2 border-accent/20">
                <CardContent className="py-16 text-center">
                  <ShieldCheck size={64} className="mx-auto text-muted-foreground mb-4" weight="thin" />
                  <p className="text-lg text-muted-foreground">No admin accounts found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {adminAccounts.map((admin, index) => (
                  <motion.div
                    key={admin.email}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="border-2 border-accent/20">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                              <ShieldCheck size={24} className="text-accent-foreground" weight="bold" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground text-lg">{admin.email}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Key size={14} />
                                  <span className="font-mono">••••••••</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Created: {new Date(admin.createdAt).toLocaleDateString('fr-FR')}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteAdmin(admin.email)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            disabled={adminAccounts.length <= 1}
                          >
                            <Trash size={20} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fleet" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Fleet Management
              </h2>
              <p className="text-foreground/70">
                Manage vehicle classes displayed on the home page
              </p>
            </div>

            <Card className="border-2 border-accent/20 mb-6">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl font-semibold uppercase tracking-wide flex items-center gap-2">
                  <Plus size={24} className="text-accent" />
                  Add New Vehicle
                </CardTitle>
                <CardDescription>Create a new vehicle class</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-vehicle-title" className="text-sm font-medium uppercase tracking-wide">
                      Title
                    </Label>
                    <Input
                      id="new-vehicle-title"
                      value={newVehicleTitle}
                      onChange={(e) => setNewVehicleTitle(e.target.value)}
                      placeholder="e.g., PREMIUM SUV"
                      className="h-12 bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-vehicle-description" className="text-sm font-medium uppercase tracking-wide">
                      Description
                    </Label>
                    <Textarea
                      id="new-vehicle-description"
                      value={newVehicleDescription}
                      onChange={(e) => setNewVehicleDescription(e.target.value)}
                      placeholder="Describe the vehicle class..."
                      className="h-12 bg-secondary border-border resize-none"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddVehicle}
                  className="w-full md:w-auto h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
                >
                  <Plus className="mr-2" size={20} />
                  Add Vehicle
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {(Array.isArray(fleetData) ? fleetData : DEFAULT_FLEET)
                .sort((a, b) => a.order - b.order)
                .map((vehicle, index) => {
                  const isEditing = editingVehicle === vehicle.id
                  
                  return (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="border-2 border-accent/20">
                        <CardContent className="py-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-64 flex-shrink-0">
                              <div className="aspect-[4/3] bg-muted/50 relative overflow-hidden border-2 border-border group">
                                {vehicle.image ? (
                                  <>
                                    <img
                                      src={vehicle.image}
                                      alt={vehicle.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                      <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => {
                                          setEditingImage(vehicle.id)
                                          const settings = vehicle.imageSettings
                                          setImageZoom(100)
                                          setImagePosition({ 
                                            x: settings?.positionX || 50, 
                                            y: settings?.positionY || 50 
                                          })
                                          setImageFit(settings?.fit || 'cover')
                                          setHasImageChanges(false)
                                        }}
                                        className="h-10 w-10"
                                      >
                                        <MagnifyingGlassPlus size={20} />
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon size={60} className="text-muted-foreground/30" weight="thin" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-3 space-y-2">
                                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                  Upload Image
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    id={`file-${vehicle.id}`}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        handleImageUpload(vehicle.id, file)
                                        e.target.value = ''
                                      }
                                    }}
                                    className="h-10 text-xs bg-secondary border-border"
                                    disabled={uploadingImage === vehicle.id}
                                  />
                                  {uploadingImage === vehicle.id && (
                                    <Button disabled size="icon" className="h-10 w-10 flex-shrink-0">
                                      <Upload className="animate-pulse" size={16} />
                                    </Button>
                                  )}
                                  {vehicle.image && uploadingImage !== vehicle.id && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-10 w-10 flex-shrink-0 border-green-500/30 text-green-500"
                                      disabled
                                    >
                                      <Check size={16} />
                                    </Button>
                                  )}
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                  Max 5MB. Recommended: 800x600px
                                </p>
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="mb-4 flex items-start justify-between">
                                <h3 className="text-2xl font-semibold uppercase tracking-wide text-foreground">
                                  {vehicle.title}
                                </h3>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeleteVehicle(vehicle.id)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                >
                                  <X size={20} />
                                </Button>
                              </div>

                              {isEditing ? (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`title-${vehicle.id}`} className="text-sm font-medium uppercase tracking-wide">
                                      Title
                                    </Label>
                                    <Input
                                      id={`title-${vehicle.id}`}
                                      value={editedTitle}
                                      onChange={(e) => setEditedTitle(e.target.value)}
                                      className="h-11 bg-secondary border-border"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`desc-${vehicle.id}`} className="text-sm font-medium uppercase tracking-wide">
                                      Description
                                    </Label>
                                    <Textarea
                                      id={`desc-${vehicle.id}`}
                                      value={editedDescription}
                                      onChange={(e) => setEditedDescription(e.target.value)}
                                      className="min-h-[100px] bg-secondary border-border resize-none"
                                    />
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      onClick={() => handleUpdateVehicle(vehicle.id, { 
                                        title: editedTitle, 
                                        description: editedDescription 
                                      })}
                                      className="h-11 px-6 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
                                    >
                                      <Check className="mr-2" size={18} />
                                      Valider
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => setEditingVehicle(null)}
                                      className="h-11 px-6"
                                    >
                                      Annuler
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                                    <p className="text-foreground/90 leading-relaxed">{vehicle.description}</p>
                                  </div>
                                  <Button
                                    onClick={() => {
                                      setEditingVehicle(vehicle.id)
                                      setEditedTitle(vehicle.title)
                                      setEditedDescription(vehicle.description)
                                    }}
                                    className="h-11 px-6 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
                                  >
                                    Edit Details
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Gestion des Tarifs KM / Minute / Heure
              </h2>
              <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded mb-4">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Info size={20} className="text-blue-500" />
                  Quand ces tarifs sont-ils utilisés ?
                </h3>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>Transfert (Aller simple / Aller-retour)</strong> : Prix calculé = (Distance × Prix/KM) + (Durée × Prix/Minute)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>Mise à Disposition</strong> : Prix calculé = Nombre d'heures × Prix/Heure MAD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>Circuit Touristique</strong> : Prix de base configuré dans l'onglet "Circuits"</span>
                  </li>
                  <li className="flex items-start gap-2 mt-3 pt-3 border-t border-border/50">
                    <span className="text-accent mt-0.5">⚠️</span>
                    <span className="text-accent italic"><strong>Important</strong> : Si un forfait zone à zone est configuré (onglet "Forfaits Zones"), il sera prioritaire et ces tarifs ne seront PAS utilisés pour ce trajet.</span>
                  </li>
                </ul>
              </div>
              <p className="text-foreground/70">
                Ces tarifs s'appliquent automatiquement quand aucun forfait zone à zone n'est défini.
              </p>
            </div>

            <Card className="border-2 border-accent/20 mb-6">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkle size={32} className="text-accent" weight="fill" />
                    <div>
                      <h3 className="text-xl font-semibold uppercase tracking-wide">
                        Mode Tarifaire Actif
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Basculez entre les tarifs haute demande et basse saison en 1 clic
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleTogglePricingMode}
                    size="lg"
                    className={`h-14 px-8 font-bold uppercase tracking-widest text-lg transition-all ${
                      activePricingMode === 'high-demand'
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {activePricingMode === 'high-demand' ? '🔥 Tarifs Forte demande' : '❄️ Tarifs Basse Saison'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20 mb-6">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CurrencyCircleDollar size={32} className="text-accent" weight="fill" />
                    <div>
                      <h3 className="text-xl font-semibold uppercase tracking-wide">
                        Arrondissement des Tarifs
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Arrondir automatiquement tous les prix calculés à .00€
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium uppercase tracking-wide ${pricingSettings?.roundToWholeEuro ? 'text-accent' : 'text-muted-foreground'}`}>
                      {pricingSettings?.roundToWholeEuro ? 'Activé' : 'Désactivé'}
                    </span>
                    <Switch
                      checked={pricingSettings?.roundToWholeEuro || false}
                      onCheckedChange={(checked) => {
                        setPricingSettings((current) => ({
                          ...current,
                          roundToWholeEuro: checked
                        }))
                        toast.success(checked ? 'Arrondissement activé - les prix seront arrondis à .00€' : 'Arrondissement désactivé')
                      }}
                      className="data-[state=checked]:bg-accent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {(Array.isArray(fleetData) ? fleetData : DEFAULT_FLEET)
                .sort((a, b) => a.order - b.order)
                .map((vehicle, index) => {
                  const pricing = (Array.isArray(pricingData) ? pricingData : DEFAULT_PRICING)
                    .find(p => p.vehicleId === vehicle.id) || {
                      vehicleId: vehicle.id,
                      pricePerKm: 0,
                      pricePerMinute: 0,
                      tourBasePrice: 0,
                      lowSeasonPricePerKm: 0,
                      lowSeasonPricePerMinute: 0,
                      lowSeasonTourBasePrice: 0
                    }

                  const isHighDemand = activePricingMode === 'high-demand'

                  return (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="border-2 border-accent/20">
                        <CardHeader className="border-b border-border">
                          <CardTitle className="text-xl font-semibold uppercase tracking-wide flex items-center gap-2">
                            <CurrencyCircleDollar size={24} className="text-accent" />
                            {vehicle.title}
                            <span className="ml-auto text-sm font-normal text-muted-foreground">
                              {isHighDemand ? '🔥 Forte demande' : '❄️ Basse Saison'}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            {isHighDemand ? 'Tarifs haute demande (périodes de forte affluence)' : 'Tarifs basse saison (périodes creuses)'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <TooltipProvider>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-2 flex flex-col">
                                <div className="flex items-center gap-2 min-h-[48px]">
                                  <Label htmlFor={`price-km-${vehicle.id}`} className="text-sm font-medium uppercase tracking-wide leading-tight">
                                    Prix par KM (€)
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info size={16} className="text-muted-foreground cursor-help flex-shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="font-semibold mb-1">Prix par Kilomètre</p>
                                      <p className="text-sm">Utilisé pour calculer le prix des transferts aéroport et des trajets Chauffeur Privé. Le prix final est calculé selon la formule : (distance × prix/km) + (durée × prix/minute).</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <Input
                                  id={`price-km-${vehicle.id}`}
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={isHighDemand ? pricing.pricePerKm : (pricing.lowSeasonPricePerKm || 0)}
                                  onChange={(e) => handleUpdatePricing(
                                    vehicle.id, 
                                    isHighDemand ? 'pricePerKm' : 'lowSeasonPricePerKm', 
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="h-12 bg-secondary border-border"
                                />
                              </div>

                              <div className="space-y-2 flex flex-col">
                                <div className="flex items-center gap-2 min-h-[48px]">
                                  <Label htmlFor={`price-minute-${vehicle.id}`} className="text-sm font-medium uppercase tracking-wide leading-tight">
                                    Prix par Minute (€)
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info size={16} className="text-muted-foreground cursor-help flex-shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="font-semibold mb-1">Prix par Minute</p>
                                      <p className="text-sm">Utilisé pour calculer le prix des transferts aéroport et des trajets Chauffeur Privé. Le prix final est calculé selon la formule : (distance × prix/km) + (durée × prix/minute).</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <Input
                                  id={`price-minute-${vehicle.id}`}
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={isHighDemand ? pricing.pricePerMinute : (pricing.lowSeasonPricePerMinute || 0)}
                                  onChange={(e) => handleUpdatePricing(
                                    vehicle.id, 
                                    isHighDemand ? 'pricePerMinute' : 'lowSeasonPricePerMinute', 
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="h-12 bg-secondary border-border"
                                />
                              </div>

                              <div className="space-y-2 flex flex-col">
                                <div className="flex items-center gap-2 min-h-[48px]">
                                  <Label htmlFor={`price-tour-${vehicle.id}`} className="text-sm font-medium uppercase tracking-wide leading-tight">
                                    Prix Base Circuit (€)
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info size={16} className="text-muted-foreground cursor-help flex-shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="font-semibold mb-1">Prix Circuit Touristique</p>
                                      <p className="text-sm">Prix fixe pour les circuits touristiques. Ce prix est défini ici dans l'admin et est appliqué directement sans calcul additionnel. Parfait pour les forfaits tout compris.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <Input
                                  id={`price-tour-${vehicle.id}`}
                                  type="number"
                                  step="1"
                                  min="0"
                                  value={isHighDemand ? pricing.tourBasePrice : (pricing.lowSeasonTourBasePrice || 0)}
                                  onChange={(e) => handleUpdatePricing(
                                    vehicle.id, 
                                    isHighDemand ? 'tourBasePrice' : 'lowSeasonTourBasePrice', 
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="h-12 bg-secondary border-border"
                                />
                              </div>
                            </div>
                          </TooltipProvider>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
            </div>

            <div className="mt-12 pt-12 border-t-2 border-border">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Forfaits Zone à Zone
                </h3>
                <p className="text-foreground/70">
                  Créez des zones géographiques et définissez des tarifs fixes entre zones (prioritaire sur les calculs KM/Min)
                </p>
              </div>
              <ZoneForfaitManager fleetData={Array.isArray(fleetData) ? fleetData : DEFAULT_FLEET} />
            </div>
          </TabsContent>

          <TabsContent value="options" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Gestion des Options
              </h2>
              <p className="text-foreground/70">
                Gérez les options supplémentaires disponibles lors de la réservation
              </p>
            </div>

            <Card className="border-2 border-accent/20 mb-6">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl font-semibold uppercase tracking-wide flex items-center gap-2">
                  <Plus size={24} className="text-accent" />
                  Ajouter une Nouvelle Option
                </CardTitle>
                <CardDescription>Créez une nouvelle option pour les clients</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-option-name" className="text-sm font-medium uppercase tracking-wide">
                      Nom de l'option
                    </Label>
                    <Input
                      id="new-option-name"
                      value={newOptionName}
                      onChange={(e) => setNewOptionName(e.target.value)}
                      placeholder="ex: Siège Enfant"
                      className="h-12 bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-option-description" className="text-sm font-medium uppercase tracking-wide">
                      Description
                    </Label>
                    <Input
                      id="new-option-description"
                      value={newOptionDescription}
                      onChange={(e) => setNewOptionDescription(e.target.value)}
                      placeholder="Description de l'option"
                      className="h-12 bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-option-price" className="text-sm font-medium uppercase tracking-wide">
                      Prix (€)
                    </Label>
                    <Input
                      id="new-option-price"
                      type="number"
                      step="0.5"
                      min="0"
                      value={newOptionPrice}
                      onChange={(e) => setNewOptionPrice(e.target.value)}
                      placeholder="0.00"
                      className="h-12 bg-secondary border-border"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddOption}
                  className="w-full md:w-auto h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
                >
                  <Plus className="mr-2" size={20} />
                  Ajouter l'Option
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {(Array.isArray(optionsData) ? optionsData : DEFAULT_OPTIONS).map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-2 border-accent/20">
                    <CardContent className="py-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Nom
                            </Label>
                            <Input
                              value={option.name}
                              onChange={(e) => handleUpdateOption(option.id, { name: e.target.value })}
                              className="h-10 bg-secondary border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Description
                            </Label>
                            <Input
                              value={option.description}
                              onChange={(e) => handleUpdateOption(option.id, { description: e.target.value })}
                              className="h-10 bg-secondary border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Prix (€)
                            </Label>
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              value={option.price}
                              onChange={(e) => handleUpdateOption(option.id, { price: parseFloat(e.target.value) || 0 })}
                              className="h-10 bg-secondary border-border"
                            />
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteOption(option.id)}
                          className="ml-4 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash size={20} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="circuits" className="space-y-6">
            <CircuitManager />
          </TabsContent>

          <TabsContent value="promos" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Codes Promo
              </h2>
              <p className="text-foreground/70">
                Gérez les codes promotionnels pour offrir des réductions à vos clients
              </p>
            </div>

            <Card className="border-2 border-accent/20 mb-6">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl font-semibold uppercase tracking-wide flex items-center gap-2">
                  <Sparkle size={24} className="text-accent" weight="fill" />
                  Promotion Aller-Retour
                </CardTitle>
                <CardDescription>
                  Configurez une remise automatique pour les réservations aller-retour
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-secondary/50 border border-border">
                  <div className="space-y-1">
                    <Label htmlFor="roundtrip-enabled" className="text-sm font-medium uppercase tracking-wide">
                      Activer la promotion
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Active ou désactive la réduction sur les transferts aller-retour
                    </p>
                  </div>
                  <Switch
                    id="roundtrip-enabled"
                    checked={roundTripDiscount?.enabled || false}
                    onCheckedChange={(checked) => {
                      setRoundTripDiscount((current) => ({
                        ...(current || DEFAULT_ROUNDTRIP_DISCOUNT),
                        enabled: checked
                      }))
                      toast.success(checked ? 'Promotion aller-retour activée' : 'Promotion aller-retour désactivée')
                    }}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="roundtrip-type" className="text-sm font-medium uppercase tracking-wide">
                      Type de réduction
                    </Label>
                    <Select
                      value={roundTripDiscount?.type || 'percentage'}
                      onValueChange={(value: 'percentage' | 'fixed') => {
                        setRoundTripDiscount((current) => ({
                          ...(current || DEFAULT_ROUNDTRIP_DISCOUNT),
                          type: value
                        }))
                      }}
                    >
                      <SelectTrigger id="roundtrip-type" className="h-12 bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                        <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roundtrip-value" className="text-sm font-medium uppercase tracking-wide">
                      Valeur de la réduction
                    </Label>
                    <Input
                      id="roundtrip-value"
                      type="number"
                      step={roundTripDiscount?.type === 'percentage' ? '1' : '0.5'}
                      min="0"
                      max={roundTripDiscount?.type === 'percentage' ? '100' : undefined}
                      value={roundTripDiscount?.value || 0}
                      onChange={(e) => {
                        setRoundTripDiscount((current) => ({
                          ...(current || DEFAULT_ROUNDTRIP_DISCOUNT),
                          value: parseFloat(e.target.value) || 0
                        }))
                      }}
                      className="h-12 bg-secondary border-border"
                      placeholder={roundTripDiscount?.type === 'percentage' ? 'ex: 10' : 'ex: 15.00'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roundtrip-description" className="text-sm font-medium uppercase tracking-wide">
                    Description (optionnel)
                  </Label>
                  <Input
                    id="roundtrip-description"
                    type="text"
                    value={roundTripDiscount?.description || ''}
                    onChange={(e) => {
                      setRoundTripDiscount((current) => ({
                        ...(current || DEFAULT_ROUNDTRIP_DISCOUNT),
                        description: e.target.value
                      }))
                    }}
                    className="h-12 bg-secondary border-border"
                    placeholder="ex: Économisez sur vos trajets aller-retour !"
                  />
                </div>

                {roundTripDiscount?.enabled && roundTripDiscount?.value > 0 && (
                  <div className="bg-accent/20 border-2 border-accent rounded-lg p-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-2">
                      ✓ Aperçu de la promotion
                    </p>
                    <p className="text-sm text-foreground/80">
                      Les clients qui choisissent un transfert <strong>Aller-Retour</strong> recevront automatiquement une réduction de{' '}
                      <strong className="text-accent">
                        {roundTripDiscount.value}{roundTripDiscount.type === 'percentage' ? '%' : '€'}
                      </strong>{' '}
                      sur le prix total.
                      {roundTripDiscount.description && (
                        <>
                          <br />
                          <span className="italic">"{roundTripDiscount.description}"</span>
                        </>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <PromoCodeManager />
          </TabsContent>

          <TabsContent value="shared-rides" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Gestion des Trajets Partagés
              </h2>
              <p className="text-foreground/70">
                Configurez et surveillez le système de partage de trajets pour maximiser l'occupation des véhicules
              </p>
            </div>

            <SharedRideManager bookings={bookings} onUpdateBooking={onUpdateBooking} />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
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
          <div className="grid gap-4 sm:gap-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-2 border-accent/20 overflow-hidden">
                  <CardHeader className="border-b border-border pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg md:text-xl font-semibold uppercase tracking-wide truncate">
                            {fleetData?.find(v => v.id === booking.vehicleType)?.title || booking.vehicleType || 'Réservation'}
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs sm:text-sm truncate">
                            Client: {booking.userEmail}
                          </CardDescription>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <Trash size={18} className="sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Statut</Label>
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value as Booking['status'])}
                        >
                          <SelectTrigger className={`w-full h-9 sm:h-10 ${statusColors[booking.status]} border font-medium uppercase text-xs`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6 pb-3 sm:pb-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex gap-2 sm:gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Pickup</div>
                            <p className="text-xs sm:text-sm text-foreground break-words">{booking.pickup}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 sm:gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-accent/60" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Destination</div>
                            <p className="text-xs sm:text-sm text-foreground break-words">{booking.destination}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-border">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground mb-1">
                            <Calendar size={14} className="flex-shrink-0" />
                            <span className="uppercase tracking-wide font-medium">Date</span>
                          </div>
                          <p className="text-xs sm:text-sm text-foreground">{new Date(booking.date).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground mb-1">
                            <Clock size={14} className="flex-shrink-0" />
                            <span className="uppercase tracking-wide font-medium">Heure</span>
                          </div>
                          <p className="text-xs sm:text-sm text-foreground">{booking.time}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground mb-1">
                            <UserIcon size={14} className="flex-shrink-0" />
                            <span className="uppercase tracking-wide font-medium">Passagers</span>
                          </div>
                          <p className="text-xs sm:text-sm text-foreground">{booking.passengers}</p>
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                            Prix (€)
                          </div>
                          <Input
                            type="number"
                            defaultValue={booking.price || ''}
                            onBlur={(e) => handlePriceChange(booking.id, e.target.value)}
                            placeholder="Prix..."
                            className="h-8 sm:h-10 bg-secondary border-border text-xs sm:text-sm"
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
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Paramètres
              </h2>
              <p className="text-foreground/70">
                Configurez les paramètres de notification et autres options système
              </p>
            </div>

            <Card className="border-2 border-accent/20">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl font-semibold uppercase tracking-wide flex items-center gap-2">
                  <Sparkle size={24} className="text-accent" />
                  Notifications Telegram
                </CardTitle>
                <CardDescription>
                  Recevez une notification Telegram à chaque nouvelle réservation
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-secondary/50 border border-border">
                  <div className="space-y-1">
                    <Label htmlFor="telegram-enabled" className="text-sm font-medium uppercase tracking-wide">
                      Activer les notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Active ou désactive l'envoi de notifications Telegram
                    </p>
                  </div>
                  <Switch
                    id="telegram-enabled"
                    checked={telegramSettings?.enabled || false}
                    onCheckedChange={(checked) => {
                      setTelegramSettings((current) => ({
                        ...(current || DEFAULT_TELEGRAM_SETTINGS),
                        enabled: checked
                      }))
                      toast.success(checked ? 'Notifications activées' : 'Notifications désactivées')
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="telegram-bot-token" className="text-sm font-medium uppercase tracking-wide">
                      Bot Token
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={16} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            Créez un bot avec @BotFather sur Telegram et copiez le token ici
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="telegram-bot-token"
                    type="text"
                    value={telegramSettings?.botToken || ''}
                    onChange={(e) => {
                      setTelegramSettings((current) => ({
                        ...(current || DEFAULT_TELEGRAM_SETTINGS),
                        botToken: e.target.value
                      }))
                    }}
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    className="h-12 bg-secondary border-border font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="telegram-chat-id" className="text-sm font-medium uppercase tracking-wide">
                      Chat ID (Personnel)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={16} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            Envoyez un message à votre bot, puis utilisez @userinfobot pour obtenir votre Chat ID
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="telegram-chat-id"
                    type="text"
                    value={telegramSettings?.chatId || ''}
                    onChange={(e) => {
                      setTelegramSettings((current) => ({
                        ...(current || DEFAULT_TELEGRAM_SETTINGS),
                        chatId: e.target.value
                      }))
                    }}
                    placeholder="123456789"
                    className="h-12 bg-secondary border-border font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="telegram-group-chat-id" className="text-sm font-medium uppercase tracking-wide">
                      Group Chat ID
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={16} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            Ajoutez le bot à un groupe, puis utilisez @userinfobot dans le groupe pour obtenir le Group Chat ID (commence généralement par -)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="telegram-group-chat-id"
                    type="text"
                    value={telegramSettings?.groupChatId || ''}
                    onChange={(e) => {
                      setTelegramSettings((current) => ({
                        ...(current || DEFAULT_TELEGRAM_SETTINGS),
                        groupChatId: e.target.value
                      }))
                    }}
                    placeholder="-123456789"
                    className="h-12 bg-secondary border-border font-mono text-sm"
                  />
                </div>

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => {
                      if (!telegramSettings?.botToken) {
                        toast.error('Veuillez remplir le Bot Token')
                        return
                      }
                      if (!telegramSettings?.chatId && !telegramSettings?.groupChatId) {
                        toast.error('Veuillez remplir au moins un Chat ID (Personnel ou Group)')
                        return
                      }
                      toast.success('Paramètres Telegram enregistrés')
                    }}
                    className="flex-1 h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest text-xs sm:text-sm"
                  >
                    <Check className="mr-2" size={18} />
                    Enregistrer
                  </Button>
                  
                  <Button
                    onClick={async () => {
                      if (!telegramSettings?.botToken) {
                        toast.error('Veuillez d\'abord configurer le Bot Token')
                        return
                      }
                      if (!telegramSettings?.chatId && !telegramSettings?.groupChatId) {
                        toast.error('Veuillez configurer au moins un Chat ID')
                        return
                      }
                      if (!telegramSettings?.enabled) {
                        toast.error('Veuillez activer les notifications Telegram')
                        return
                      }

                      const testBooking: Booking = {
                        id: `test-${Date.now()}`,
                        userId: 'test@greenshuttle.com',
                        userEmail: 'test@greenshuttle.com',
                        serviceType: 'transfer',
                        transferType: 'oneway',
                        pickup: 'Aéroport Charles de Gaulle (CDG), Terminal 2E',
                        destination: 'Paris, 5 Avenue des Champs-Élysées',
                        date: new Date().toISOString().split('T')[0],
                        time: '14:30',
                        passengers: '2',
                        luggage: '3',
                        vehicleType: 'berline',
                        selectedOptions: ['Wi-Fi à bord', 'Siège bébé'],
                        firstName: 'Jean',
                        lastName: 'Dupont',
                        phone: '+33 6 12 34 56 78',
                        email: 'test@greenshuttle.com',
                        notes: 'Ceci est une réservation de test pour vérifier les notifications Telegram',
                        paymentMethod: 'card',
                        status: 'pending',
                        createdAt: Date.now(),
                        price: 85.50
                      }

                      toast.loading('Envoi de la notification test...')
                      
                      const { sendTelegramNotification } = await import('@/lib/telegram')
                      const success = await sendTelegramNotification(telegramSettings, testBooking)
                      
                      if (success) {
                        toast.success('✅ Notification de test envoyée avec succès !', {
                          description: 'Vérifiez votre Telegram pour voir la notification'
                        })
                      } else {
                        toast.error('❌ Échec de l\'envoi de la notification', {
                          description: 'Vérifiez vos paramètres et réessayez'
                        })
                      }
                    }}
                    variant="outline"
                    className="flex-1 h-11 sm:h-12 border-2 border-accent/40 text-accent hover:bg-accent/10 font-medium uppercase tracking-widest text-xs sm:text-sm"
                  >
                    <Sparkle className="mr-2" size={18} />
                    Tester
                  </Button>
                </div>

                <div className="mt-6 p-3 sm:p-4 bg-muted/30 border border-border space-y-2">
                  <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-foreground">
                    ℹ️ Comment configurer Telegram
                  </p>
                  <ol className="text-xs sm:text-sm text-muted-foreground space-y-1 list-decimal list-inside pl-2">
                    <li>Recherchez @BotFather sur Telegram</li>
                    <li>Envoyez /newbot et suivez les instructions</li>
                    <li>Copiez le Bot Token fourni et collez-le ci-dessus</li>
                    <li><strong>Pour un chat personnel:</strong> Envoyez un message à votre bot, puis utilisez @userinfobot pour obtenir votre Chat ID</li>
                    <li><strong>Pour un groupe:</strong> Ajoutez le bot au groupe, puis utilisez @userinfobot dans le groupe pour obtenir le Group Chat ID (commence par -)</li>
                    <li>Vous pouvez configurer les deux pour recevoir les notifications dans votre chat personnel ET dans un groupe</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20">
              <CardHeader className="border-b border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl font-semibold uppercase tracking-wide flex items-center gap-2">
                      <EnvelopeSimple size={24} className="text-accent flex-shrink-0" />
                      <span>Notifications Email</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      Envoyez des confirmations et mises à jour de réservation par email
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                    {emailSettings?.smtpHost && emailSettings?.smtpPort && emailSettings?.smtpUser && emailSettings?.smtpPassword ? (
                      <div className="px-2 sm:px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-500 text-[10px] sm:text-xs font-medium uppercase tracking-wide flex items-center gap-1.5">
                        <Check size={12} weight="bold" />
                        <span className="whitespace-nowrap">SMTP Configuré</span>
                      </div>
                    ) : (
                      <div className="px-2 sm:px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-[10px] sm:text-xs font-medium uppercase tracking-wide flex items-center gap-1.5">
                        <Info size={12} weight="bold" />
                        <span className="whitespace-nowrap">SMTP Non configuré</span>
                      </div>
                    )}
                    {emailSettings?.enabled ? (
                      <div className="px-2 sm:px-3 py-1 bg-accent/20 border border-accent/30 text-accent text-[10px] sm:text-xs font-medium uppercase tracking-wide">
                        Activé
                      </div>
                    ) : (
                      <div className="px-2 sm:px-3 py-1 bg-muted border border-border text-muted-foreground text-[10px] sm:text-xs font-medium uppercase tracking-wide">
                        Désactivé
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="bg-accent/10 border-2 border-accent/30 p-3 sm:p-4 space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Info size={20} className="text-accent flex-shrink-0 mt-0.5" weight="fill" />
                    <div className="flex-1 space-y-2">
                      <p className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wide">
                        Guide de Configuration SMTP
                      </p>
                      <p className="text-xs sm:text-sm text-foreground/80">
                        Configurez vos paramètres SMTP pour envoyer des emails automatiques de confirmation, notification et mise à jour à vos clients et administrateurs.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <div className="px-2 py-1 bg-background/50 border border-border text-[10px] sm:text-xs font-medium whitespace-nowrap">
                          ✓ Gmail gratuit
                        </div>
                        <div className="px-2 py-1 bg-background/50 border border-border text-[10px] sm:text-xs font-medium whitespace-nowrap">
                          ✓ SendGrid professionnel
                        </div>
                        <div className="px-2 py-1 bg-background/50 border border-border text-[10px] sm:text-xs font-medium whitespace-nowrap">
                          ✓ Mailgun, AWS SES, Brevo
                        </div>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground pt-1">
                        📖 Consultez le fichier <code className="bg-background/50 px-1 py-0.5 font-mono text-[10px] sm:text-xs">SMTP_SETUP_GUIDE.md</code> à la racine du projet pour un guide détaillé.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-secondary/50 border border-border">
                  <div className="space-y-1">
                    <Label htmlFor="email-enabled" className="text-sm font-medium uppercase tracking-wide">
                      Activer les notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Active ou désactive l'envoi de notifications par email
                    </p>
                  </div>
                  <Switch
                    id="email-enabled"
                    checked={emailSettings?.enabled || false}
                    onCheckedChange={(checked) => {
                      setEmailSettings((current) => ({
                        ...(current || DEFAULT_EMAIL_SETTINGS),
                        enabled: checked
                      }))
                      toast.success(checked ? 'Notifications email activées' : 'Notifications email désactivées')
                    }}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="email-admin" className="text-sm font-medium uppercase tracking-wide">
                        Email Admin
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={16} className="text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">
                              L'adresse email où vous recevrez les notifications de nouvelles réservations
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="email-admin"
                      type="email"
                      value={emailSettings?.adminEmail || ''}
                      onChange={(e) => {
                        setEmailSettings((current) => ({
                          ...(current || DEFAULT_EMAIL_SETTINGS),
                          adminEmail: e.target.value
                        }))
                      }}
                      placeholder="admin@greenshuttle.com"
                      className="h-12 bg-secondary border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="email-from" className="text-sm font-medium uppercase tracking-wide">
                        Email Expéditeur
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={16} className="text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">
                              L'adresse email qui apparaîtra comme expéditeur dans les emails envoyés aux clients
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="email-from"
                      type="email"
                      value={emailSettings?.fromEmail || ''}
                      onChange={(e) => {
                        setEmailSettings((current) => ({
                          ...(current || DEFAULT_EMAIL_SETTINGS),
                          fromEmail: e.target.value
                        }))
                      }}
                      placeholder="noreply@greenshuttle.com"
                      className="h-12 bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-from-name" className="text-sm font-medium uppercase tracking-wide">
                    Nom de l'expéditeur
                  </Label>
                  <Input
                    id="email-from-name"
                    type="text"
                    value={emailSettings?.fromName || ''}
                    onChange={(e) => {
                      setEmailSettings((current) => ({
                        ...(current || DEFAULT_EMAIL_SETTINGS),
                        fromName: e.target.value
                      }))
                    }}
                    placeholder="Green Shuttle To Paris"
                    className="h-12 bg-secondary border-border"
                  />
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium uppercase tracking-wide">Paramètres SMTP</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={18} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-sm">
                            Configurez votre serveur SMTP pour l'envoi d'emails. Ces paramètres sont stockés de manière sécurisée et seront utilisés pour envoyer des emails automatiques.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="smtp-host" className="text-sm font-medium uppercase tracking-wide">
                          Serveur SMTP
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info size={16} className="text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">
                                L'adresse du serveur SMTP de votre fournisseur d'email (ex: smtp.gmail.com, smtp.sendgrid.net)
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="smtp-host"
                        type="text"
                        value={emailSettings?.smtpHost || ''}
                        onChange={(e) => {
                          setEmailSettings((current) => ({
                            ...(current || DEFAULT_EMAIL_SETTINGS),
                            smtpHost: e.target.value
                          }))
                        }}
                        placeholder="smtp.gmail.com"
                        className="h-12 bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="smtp-port" className="text-sm font-medium uppercase tracking-wide">
                          Port SMTP
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info size={16} className="text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">
                                Port du serveur SMTP. 587 (TLS) est recommandé, 465 (SSL) est aussi courant
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="smtp-port"
                        type="text"
                        value={emailSettings?.smtpPort || ''}
                        onChange={(e) => {
                          setEmailSettings((current) => ({
                            ...(current || DEFAULT_EMAIL_SETTINGS),
                            smtpPort: e.target.value
                          }))
                        }}
                        placeholder="587"
                        className="h-12 bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="smtp-user" className="text-sm font-medium uppercase tracking-wide">
                          Nom d'utilisateur SMTP
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info size={16} className="text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">
                                Votre adresse email complète ou nom d'utilisateur fourni par votre service SMTP
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="smtp-user"
                        type="text"
                        value={emailSettings?.smtpUser || ''}
                        onChange={(e) => {
                          setEmailSettings((current) => ({
                            ...(current || DEFAULT_EMAIL_SETTINGS),
                            smtpUser: e.target.value
                          }))
                        }}
                        placeholder="username@gmail.com"
                        className="h-12 bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="smtp-password" className="text-sm font-medium uppercase tracking-wide">
                          Mot de passe SMTP
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info size={16} className="text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">
                                Pour Gmail, utilisez un "Mot de passe d'application" plutôt que votre mot de passe normal. Pour d'autres services, utilisez votre clé API ou mot de passe SMTP.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={emailSettings?.smtpPassword || ''}
                        onChange={(e) => {
                          setEmailSettings((current) => ({
                            ...(current || DEFAULT_EMAIL_SETTINGS),
                            smtpPassword: e.target.value
                          }))
                        }}
                        placeholder="••••••••"
                        className="h-12 bg-secondary border-border"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <p className="text-sm font-medium uppercase tracking-wide">Options d'envoi</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary/30 border border-border">
                      <div className="space-y-0.5">
                        <Label htmlFor="send-confirmation" className="text-sm font-medium">
                          Confirmation au client
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Envoyer un email de confirmation lors d'une nouvelle réservation
                        </p>
                      </div>
                      <Switch
                        id="send-confirmation"
                        checked={emailSettings?.sendConfirmationToClient ?? true}
                        onCheckedChange={(checked) => {
                          setEmailSettings((current) => ({
                            ...(current || DEFAULT_EMAIL_SETTINGS),
                            sendConfirmationToClient: checked
                          }))
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-secondary/30 border border-border">
                      <div className="space-y-0.5">
                        <Label htmlFor="send-admin" className="text-sm font-medium">
                          Notification à l'admin
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Notifier l'administrateur des nouvelles réservations
                        </p>
                      </div>
                      <Switch
                        id="send-admin"
                        checked={emailSettings?.sendNotificationToAdmin ?? true}
                        onCheckedChange={(checked) => {
                          setEmailSettings((current) => ({
                            ...(current || DEFAULT_EMAIL_SETTINGS),
                            sendNotificationToAdmin: checked
                          }))
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-secondary/30 border border-border">
                      <div className="space-y-0.5">
                        <Label htmlFor="send-updates" className="text-sm font-medium">
                          Mises à jour au client
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Envoyer un email lors des changements de statut
                        </p>
                      </div>
                      <Switch
                        id="send-updates"
                        checked={emailSettings?.sendUpdatesToClient ?? true}
                        onCheckedChange={(checked) => {
                          setEmailSettings((current) => ({
                            ...(current || DEFAULT_EMAIL_SETTINGS),
                            sendUpdatesToClient: checked
                          }))
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex flex-col md:flex-row gap-3">
                  <Button
                    onClick={() => {
                      if (!emailSettings?.adminEmail) {
                        toast.error('Veuillez remplir l\'email admin')
                        return
                      }
                      if (!emailSettings?.fromEmail) {
                        toast.error('Veuillez remplir l\'email expéditeur')
                        return
                      }
                      if (!emailSettings?.fromName) {
                        toast.error('Veuillez remplir le nom de l\'expéditeur')
                        return
                      }
                      
                      const smtpConfigured = emailSettings?.smtpHost && 
                                            emailSettings?.smtpPort && 
                                            emailSettings?.smtpUser && 
                                            emailSettings?.smtpPassword
                      
                      if (smtpConfigured) {
                        toast.success('✅ Paramètres email et SMTP enregistrés', {
                          description: 'Configuration complète pour l\'envoi d\'emails'
                        })
                      } else {
                        toast.success('⚠️ Paramètres email enregistrés', {
                          description: 'Configurez les paramètres SMTP pour l\'envoi réel d\'emails'
                        })
                      }
                    }}
                    className="flex-1 md:flex-initial h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
                  >
                    <Check className="mr-2" size={20} />
                    Enregistrer les paramètres
                  </Button>
                  
                  <Button
                    onClick={async () => {
                      if (!emailSettings?.enabled) {
                        toast.error('Veuillez activer les notifications email')
                        return
                      }
                      if (!emailSettings?.adminEmail) {
                        toast.error('Veuillez configurer l\'email admin')
                        return
                      }

                      const testBooking: Booking = {
                        id: `test-${Date.now()}`,
                        userId: 'test@greenshuttle.com',
                        userEmail: 'test@greenshuttle.com',
                        serviceType: 'transfer',
                        transferType: 'oneway',
                        pickup: 'Aéroport Charles de Gaulle (CDG), Terminal 2E',
                        destination: 'Paris, 5 Avenue des Champs-Élysées',
                        date: new Date().toISOString().split('T')[0],
                        time: '14:30',
                        passengers: '2',
                        luggage: '3',
                        vehicleType: 'berline',
                        selectedOptions: ['Wi-Fi à bord'],
                        firstName: 'Jean',
                        lastName: 'Dupont',
                        phone: '+33 6 12 34 56 78',
                        email: emailSettings.adminEmail,
                        notes: 'Ceci est un email de test',
                        paymentMethod: 'card',
                        status: 'pending',
                        createdAt: Date.now(),
                        price: 85.50
                      }

                      toast.loading('Envoi de l\'email test...')
                      
                      const result = await sendBookingConfirmation(testBooking, emailSettings)
                      
                      if (result.success) {
                        toast.success('✅ Email de test envoyé !', {
                          description: result.message
                        })
                      } else {
                        toast.error('❌ Échec de l\'envoi', {
                          description: result.message
                        })
                      }
                    }}
                    variant="outline"
                    className="flex-1 md:flex-initial h-12 border-2 border-accent/40 text-accent hover:bg-accent/10 font-medium uppercase tracking-widest"
                  >
                    <EnvelopeSimple className="mr-2" size={20} />
                    Tester l'email
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted/30 border border-border space-y-3">
                  <p className="text-sm font-medium uppercase tracking-wide text-foreground">
                    ℹ️ Configuration SMTP - Guide
                  </p>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium text-foreground">Mode actuel : Simulation (navigateur)</p>
                    <p>Cette application stocke vos paramètres SMTP mais fonctionne en mode simulation car les navigateurs ne peuvent pas envoyer d'emails directement.</p>
                    
                    <div className="pt-3 space-y-2">
                      <p className="font-medium text-foreground">✉️ Services SMTP recommandés :</p>
                      <ul className="space-y-1.5 pl-2">
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <div>
                            <strong className="text-foreground">Gmail SMTP</strong>
                            <div className="text-xs mt-0.5">Host: smtp.gmail.com | Port: 587 | Utilisez un mot de passe d'application</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <div>
                            <strong className="text-foreground">SendGrid</strong>
                            <div className="text-xs mt-0.5">Host: smtp.sendgrid.net | Port: 587 | Clé API comme mot de passe</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <div>
                            <strong className="text-foreground">Mailgun</strong>
                            <div className="text-xs mt-0.5">Host: smtp.mailgun.org | Port: 587 | Utilisez vos identifiants Mailgun</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <div>
                            <strong className="text-foreground">AWS SES</strong>
                            <div className="text-xs mt-0.5">Host: email-smtp.{'{'}region{'}'}.amazonaws.com | Port: 587</div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-3 space-y-1.5">
                      <p className="font-medium text-foreground">📧 Emails automatiques :</p>
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Confirmation de réservation envoyée au client</li>
                        <li>Notification de nouvelle réservation à l'administrateur</li>
                        <li>Mises à jour automatiques lors des changements de statut</li>
                        <li>Notifications pour trajets partagés</li>
                      </ul>
                    </div>

                    <div className="pt-3 bg-accent/10 -mx-4 -mb-4 px-4 py-3 border-t border-accent/20">
                      <p className="text-xs text-foreground/80">
                        <strong>Note :</strong> Pour activer l'envoi réel d'emails en production, vous devrez intégrer un service backend qui utilisera ces paramètres SMTP pour envoyer les emails via votre serveur.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>
      <Footer />
    </>
  )
}
