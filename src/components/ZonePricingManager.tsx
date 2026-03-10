import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MapPin, Plus, Trash, Pencil, CurrencyCircleDollar } from '@phosphor-icons/react'
import { PricingZone, ZonePricing } from '@/types/pricing'
import { DEFAULT_FLEET } from '@/types/fleet'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const ZONE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
]

interface ZonePricingManagerProps {
  onClose?: () => void
}

export default function ZonePricingManager({ onClose }: ZonePricingManagerProps) {
  const [zones, setZones] = useKV<PricingZone[]>('pricing-zones', [])
  const [zonePricings, setZonePricings] = useKV<ZonePricing[]>('zone-pricings', [])
  const [isCreatingZone, setIsCreatingZone] = useState(false)
  const [isCreatingPricing, setIsCreatingPricing] = useState(false)
  const [editingZone, setEditingZone] = useState<PricingZone | null>(null)
  
  const [newZoneName, setNewZoneName] = useState('')
  const [newZoneDescription, setNewZoneDescription] = useState('')
  const [newZoneColor, setNewZoneColor] = useState(ZONE_COLORS[0])
  const [drawingPoints, setDrawingPoints] = useState<{ lat: number; lng: number }[]>([])
  
  const [newPricingFromZone, setNewPricingFromZone] = useState('')
  const [newPricingToZone, setNewPricingToZone] = useState('')
  const [newPricingVehicle, setNewPricingVehicle] = useState('')
  const [newPricingPrice, setNewPricingPrice] = useState('')

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const polygonsRef = useRef<google.maps.Polygon[]>([])
  const drawingPolygonRef = useRef<google.maps.Polygon | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 48.8566, lng: 2.3522 },
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    mapInstanceRef.current = map

    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!isCreatingZone || !e.latLng) return
      
      const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() }
      setDrawingPoints(prev => [...prev, newPoint])
      
      const marker = new google.maps.Marker({
        position: newPoint,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: newZoneColor,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      })
      markersRef.current.push(marker)

      if (drawingPolygonRef.current) {
        drawingPolygonRef.current.setMap(null)
      }

      const updatedPoints = [...drawingPoints, newPoint]
      if (updatedPoints.length >= 3) {
        drawingPolygonRef.current = new google.maps.Polygon({
          paths: updatedPoints,
          strokeColor: newZoneColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: newZoneColor,
          fillOpacity: 0.35,
          map: map,
        })
      }
    })

    return () => {
      polygonsRef.current.forEach(p => p.setMap(null))
      markersRef.current.forEach(m => m.setMap(null))
      if (drawingPolygonRef.current) {
        drawingPolygonRef.current.setMap(null)
      }
    }
  }, [isCreatingZone, newZoneColor, drawingPoints])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    polygonsRef.current.forEach(p => p.setMap(null))
    polygonsRef.current = []

    zones.forEach(zone => {
      const polygon = new google.maps.Polygon({
        paths: zone.polygon,
        strokeColor: zone.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: zone.color,
        fillOpacity: 0.35,
        map: mapInstanceRef.current,
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="color: #000; padding: 8px;"><strong>${zone.name}</strong>${zone.description ? `<br/>${zone.description}` : ''}</div>`,
      })

      polygon.addListener('click', (e: google.maps.PolyMouseEvent) => {
        if (e.latLng) {
          infoWindow.setPosition(e.latLng)
          infoWindow.open(mapInstanceRef.current)
        }
      })

      polygonsRef.current.push(polygon)
    })
  }, [zones])

  const handleStartCreatingZone = () => {
    setIsCreatingZone(true)
    setDrawingPoints([])
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
    if (drawingPolygonRef.current) {
      drawingPolygonRef.current.setMap(null)
      drawingPolygonRef.current = null
    }
    setNewZoneName('')
    setNewZoneDescription('')
    setNewZoneColor(ZONE_COLORS[zones.length % ZONE_COLORS.length])
  }

  const handleCancelDrawing = () => {
    setIsCreatingZone(false)
    setDrawingPoints([])
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
    if (drawingPolygonRef.current) {
      drawingPolygonRef.current.setMap(null)
      drawingPolygonRef.current = null
    }
  }

  const handleSaveZone = () => {
    if (!newZoneName.trim()) {
      toast.error('Veuillez entrer un nom pour la zone')
      return
    }

    if (drawingPoints.length < 3) {
      toast.error('Veuillez dessiner au moins 3 points pour créer une zone')
      return
    }

    const newZone: PricingZone = {
      id: `zone-${Date.now()}`,
      name: newZoneName,
      description: newZoneDescription,
      color: newZoneColor,
      polygon: drawingPoints,
    }

    setZones(current => [...(current || []), newZone])
    toast.success(`Zone "${newZoneName}" créée avec succès`)
    handleCancelDrawing()
  }

  const handleDeleteZone = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId)
    if (!zone) return

    if (confirm(`Êtes-vous sûr de vouloir supprimer la zone "${zone.name}" ?`)) {
      setZones(current => (current || []).filter(z => z.id !== zoneId))
      setZonePricings(current => (current || []).filter(p => p.fromZoneId !== zoneId && p.toZoneId !== zoneId))
      toast.success('Zone supprimée')
    }
  }

  const handleCreatePricing = () => {
    if (!newPricingFromZone || !newPricingToZone || !newPricingVehicle || !newPricingPrice) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    const price = parseFloat(newPricingPrice)
    if (isNaN(price) || price <= 0) {
      toast.error('Veuillez entrer un prix valide')
      return
    }

    const newPricing: ZonePricing = {
      id: `pricing-${Date.now()}`,
      fromZoneId: newPricingFromZone,
      toZoneId: newPricingToZone,
      vehicleId: newPricingVehicle,
      fixedPrice: price,
      createdAt: new Date().toISOString(),
    }

    setZonePricings(current => [...(current || []), newPricing])
    
    const fromZone = zones?.find(z => z.id === newPricingFromZone)
    const toZone = zones?.find(z => z.id === newPricingToZone)
    const vehicle = DEFAULT_FLEET.find(v => v.id === newPricingVehicle)
    
    toast.success(`Forfait créé: ${fromZone?.name} → ${toZone?.name} (${vehicle?.title}) - ${price}€`)
    
    setNewPricingFromZone('')
    setNewPricingToZone('')
    setNewPricingVehicle('')
    setNewPricingPrice('')
    setIsCreatingPricing(false)
  }

  const handleDeletePricing = (pricingId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce forfait ?')) {
      setZonePricings(current => (current || []).filter(p => p.id !== pricingId))
      toast.success('Forfait supprimé')
    }
  }

  const getZoneName = (zoneId: string) => {
    return (zones || []).find(z => z.id === zoneId)?.name || 'Zone inconnue'
  }

  const getVehicleName = (vehicleId: string) => {
    return DEFAULT_FLEET.find(v => v.id === vehicleId)?.title || 'Véhicule inconnu'
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-accent" />
              Carte des Zones
            </CardTitle>
            <CardDescription>
              {isCreatingZone 
                ? 'Cliquez sur la carte pour dessiner les points de la zone'
                : 'Cliquez sur "Nouvelle Zone" pour commencer à dessiner'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              ref={mapRef} 
              className="w-full h-[500px] rounded-lg border border-border/50"
            />
            
            {isCreatingZone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-secondary/30 rounded-lg border border-border/50 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom de la zone *</Label>
                    <Input
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                      placeholder="Ex: Paris Centre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Couleur</Label>
                    <div className="flex gap-2">
                      {ZONE_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewZoneColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            color === newZoneColor ? 'border-foreground' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description (optionnel)</Label>
                  <Textarea
                    value={newZoneDescription}
                    onChange={(e) => setNewZoneDescription(e.target.value)}
                    placeholder="Description de la zone..."
                    rows={2}
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  Points dessinés: {drawingPoints.length}
                  {drawingPoints.length > 0 && drawingPoints.length < 3 && (
                    <span className="text-yellow-500 ml-2">
                      (Minimum 3 points requis)
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveZone}
                    disabled={drawingPoints.length < 3 || !newZoneName.trim()}
                    className="flex-1"
                  >
                    Enregistrer la Zone
                  </Button>
                  <Button
                    onClick={handleCancelDrawing}
                    variant="outline"
                  >
                    Annuler
                  </Button>
                </div>
              </motion.div>
            )}

            {!isCreatingZone && (
              <Button onClick={handleStartCreatingZone} className="w-full">
                <Plus className="mr-2" />
                Nouvelle Zone
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="text-accent" />
                Zones Créées ({zones.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {zones.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucune zone créée. Commencez par créer une zone sur la carte.
                </p>
              ) : (
                <div className="space-y-2">
                  {zones.map(zone => (
                    <motion.div
                      key={zone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        />
                        <div>
                          <div className="font-medium">{zone.name}</div>
                          {zone.description && (
                            <div className="text-sm text-muted-foreground">{zone.description}</div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {zone.polygon.length} points
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteZone(zone.id)}
                      >
                        <Trash className="text-destructive" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CurrencyCircleDollar className="text-accent" />
                Forfaits Zone à Zone
              </CardTitle>
              <CardDescription>
                Définissez des prix fixes pour chaque trajet entre deux zones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isCreatingPricing ? (
                <Button 
                  onClick={() => setIsCreatingPricing(true)} 
                  className="w-full"
                  disabled={zones.length < 2}
                >
                  <Plus className="mr-2" />
                  Nouveau Forfait
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-border/50"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Zone de départ *</Label>
                      <Select value={newPricingFromZone} onValueChange={setNewPricingFromZone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(zones || []).map(zone => (
                            <SelectItem key={zone.id} value={zone.id}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Zone d'arrivée *</Label>
                      <Select value={newPricingToZone} onValueChange={setNewPricingToZone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(zones || []).map(zone => (
                            <SelectItem key={zone.id} value={zone.id}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Véhicule *</Label>
                      <Select value={newPricingVehicle} onValueChange={setNewPricingVehicle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                          {DEFAULT_FLEET.map(vehicle => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Prix Fixe (€) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newPricingPrice}
                        onChange={(e) => setNewPricingPrice(e.target.value)}
                        placeholder="Ex: 45.00"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreatePricing} className="flex-1">
                      Créer le Forfait
                    </Button>
                    <Button
                      onClick={() => {
                        setIsCreatingPricing(false)
                        setNewPricingFromZone('')
                        setNewPricingToZone('')
                        setNewPricingVehicle('')
                        setNewPricingPrice('')
                      }}
                      variant="outline"
                    >
                      Annuler
                    </Button>
                  </div>
                </motion.div>
              )}

              {zones.length < 2 && !isCreatingPricing && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Créez au moins 2 zones pour définir des forfaits
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Liste des Forfaits ({zonePricings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {zonePricings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucun forfait défini. Créez votre premier forfait zone à zone.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone Départ</TableHead>
                  <TableHead>Zone Arrivée</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead className="text-right">Prix Fixe</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zonePricings.map(pricing => {
                  const fromZone = zones.find(z => z.id === pricing.fromZoneId)
                  const toZone = zones.find(z => z.id === pricing.toZoneId)
                  
                  return (
                    <TableRow key={pricing.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {fromZone && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: fromZone.color }}
                            />
                          )}
                          {getZoneName(pricing.fromZoneId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {toZone && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: toZone.color }}
                            />
                          )}
                          {getZoneName(pricing.toZoneId)}
                        </div>
                      </TableCell>
                      <TableCell>{getVehicleName(pricing.vehicleId)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {pricing.fixedPrice.toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePricing(pricing.id)}
                        >
                          <Trash className="text-destructive" size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
