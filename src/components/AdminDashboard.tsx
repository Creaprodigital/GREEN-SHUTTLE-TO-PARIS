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
import { Car, MapPin, Calendar, Clock, User as UserIcon, Trash, ShieldCheck, Plus, Key, Upload, Image as ImageIcon, Check, MagnifyingGlassPlus, ArrowsOutSimple, X, CurrencyCircleDollar, Sparkle, Info } from '@phosphor-icons/react'
import { Booking } from '@/types/booking'
import { VehicleClass, DEFAULT_FLEET } from '@/types/fleet'
import { VehiclePricing, DEFAULT_PRICING, ServiceOption, DEFAULT_OPTIONS, PricingSettings } from '@/types/pricing'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CircuitManager from '@/components/CircuitManager'
import { useKV } from '@github/spark/hooks'

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
  onNavigateToChauffeurPrive?: () => void
  onNavigateToAirportTransfer: () => void
  onNavigateToCorporateEvent?: () => void
}

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  confirmed: 'bg-green-500/20 text-green-500 border-green-500/30',
  completed: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  cancelled: 'bg-red-500/20 text-red-500 border-red-500/30'
}



export default function AdminDashboard({ userEmail, bookings, onLogout, onUpdateBooking, onDeleteBooking, onNavigateToHome, onNavigateToChauffeurPrive, onNavigateToAirportTransfer, onNavigateToCorporateEvent }: AdminDashboardProps) {
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
            pricePerKm: 1.5,
            pricePerMinute: 0.5,
            pricePerHour: 30,
            tourBasePrice: 150,
            minimumTransferPrice: 40,
            minimumHourlyPrice: 60,
            lowSeasonPricePerKm: 1.2,
            lowSeasonPricePerMinute: 0.4,
            lowSeasonPricePerHour: 25,
            lowSeasonTourBasePrice: 120,
            lowSeasonMinimumTransferPrice: 35,
            lowSeasonMinimumHourlyPrice: 50
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
          pricePerKm: 1.5,
          pricePerMinute: 0.5,
          pricePerHour: 30,
          tourBasePrice: 150,
          minimumTransferPrice: 40,
          lowSeasonPricePerKm: 1.2,
          lowSeasonPricePerMinute: 0.4,
          lowSeasonPricePerHour: 25,
          lowSeasonTourBasePrice: 120,
          lowSeasonMinimumTransferPrice: 35
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
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full max-w-6xl mx-auto grid-cols-6 mb-8">
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="fleet">Véhicules</TabsTrigger>
            <TabsTrigger value="pricing">Tarifs KM/Min/H</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="circuits">Circuits</TabsTrigger>
            <TabsTrigger value="admins">Comptes Admin</TabsTrigger>
          </TabsList>

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
                      pricePerHour: 0,
                      tourBasePrice: 0,
                      minimumTransferPrice: 0,
                      minimumHourlyPrice: 0,
                      lowSeasonPricePerKm: 0,
                      lowSeasonPricePerMinute: 0,
                      lowSeasonPricePerHour: 0,
                      lowSeasonTourBasePrice: 0,
                      lowSeasonMinimumTransferPrice: 0,
                      lowSeasonMinimumHourlyPrice: 0
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
                                  <Label htmlFor={`minimum-transfer-${vehicle.id}`} className="text-sm font-medium uppercase tracking-wide leading-tight">
                                    Prix Min. Transfert (€)
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info size={16} className="text-muted-foreground cursor-help flex-shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="font-semibold mb-1">Prix Minimum pour Transferts</p>
                                      <p className="text-sm">Prix minimum facturé pour un transfert. Si le calcul (distance × prix/km) + (durée × prix/minute) donne un montant inférieur à ce minimum, c'est ce prix minimum qui sera appliqué. Indépendant du tarif MAD.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <Input
                                  id={`minimum-transfer-${vehicle.id}`}
                                  type="number"
                                  step="1"
                                  min="0"
                                  value={isHighDemand ? (pricing.minimumTransferPrice || 0) : (pricing.lowSeasonMinimumTransferPrice || 0)}
                                  onChange={(e) => handleUpdatePricing(
                                    vehicle.id, 
                                    isHighDemand ? 'minimumTransferPrice' : 'lowSeasonMinimumTransferPrice', 
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="h-12 bg-secondary border-border"
                                />
                              </div>

                              <div className="space-y-2 flex flex-col">
                                <div className="flex items-center gap-2 min-h-[48px]">
                                  <Label htmlFor={`price-hour-${vehicle.id}`} className="text-sm font-medium uppercase tracking-wide leading-tight">
                                    Prix/Heure - MAD (€)
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info size={16} className="text-muted-foreground cursor-help flex-shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="font-semibold mb-1">Prix par Heure - Mise à Disposition</p>
                                      <p className="text-sm">Utilisé UNIQUEMENT pour le service "Mise à Disposition". Le client choisit le nombre d'heures et le prix est calculé : nombre d'heures × prix/heure. Ce tarif ne s'applique pas aux autres services.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <Input
                                  id={`price-hour-${vehicle.id}`}
                                  type="number"
                                  step="1"
                                  min="0"
                                  value={isHighDemand ? pricing.pricePerHour : (pricing.lowSeasonPricePerHour || 0)}
                                  onChange={(e) => handleUpdatePricing(
                                    vehicle.id, 
                                    isHighDemand ? 'pricePerHour' : 'lowSeasonPricePerHour', 
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="h-12 bg-secondary border-border"
                                />
                              </div>

                              <div className="space-y-2 flex flex-col">
                                <div className="flex items-center gap-2 min-h-[48px]">
                                  <Label htmlFor={`minimum-hourly-${vehicle.id}`} className="text-sm font-medium uppercase tracking-wide leading-tight">
                                    Prix Min. MAD (€)
                                  </Label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info size={16} className="text-muted-foreground cursor-help flex-shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="font-semibold mb-1">Prix Minimum pour Mise à Disposition</p>
                                      <p className="text-sm">Prix minimum facturé pour une mise à disposition. Si le calcul (nombre d'heures × prix/heure MAD) donne un montant inférieur à ce minimum, c'est ce prix minimum qui sera appliqué.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <Input
                                  id={`minimum-hourly-${vehicle.id}`}
                                  type="number"
                                  step="1"
                                  min="0"
                                  value={isHighDemand ? (pricing.minimumHourlyPrice || 0) : (pricing.lowSeasonMinimumHourlyPrice || 0)}
                                  onChange={(e) => handleUpdatePricing(
                                    vehicle.id, 
                                    isHighDemand ? 'minimumHourlyPrice' : 'lowSeasonMinimumHourlyPrice', 
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
                          {fleetData?.find(v => v.id === booking.vehicleType)?.title || booking.vehicleType || 'Réservation'}
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
          </TabsContent>
        </Tabs>
      </div>
      </div>
      <Footer />
    </>
  )
}
