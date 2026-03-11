import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash, Plus, MapPin, Pencil } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { VehicleClass } from '@/types/fleet'

export interface PricingZone {
  id: string
  name: string
  color: string
  polygon: { lat: number; lng: number }[]
  description?: string
}

export interface ZoneForfait {
  id: string
  fromZoneId: string
  toZoneId: string
  vehicleId: string
  fixedPrice: number
  createdAt: string
}

interface ZoneForfaitManagerProps {
  fleetData: VehicleClass[]
}

export default function ZoneForfaitManager({ fleetData }: ZoneForfaitManagerProps) {
  const [zones, setZones] = useKV<PricingZone[]>('pricing-zones', [])
  const [forfaits, setForfaits] = useKV<ZoneForfait[]>('zone-forfaits', [])
  
  const [showZoneDialog, setShowZoneDialog] = useState(false)
  const [showForfaitDialog, setShowForfaitDialog] = useState(false)
  const [editingZone, setEditingZone] = useState<PricingZone | null>(null)
  const [editingForfait, setEditingForfait] = useState<ZoneForfait | null>(null)
  
  const [zoneName, setZoneName] = useState('')
  const [zoneDescription, setZoneDescription] = useState('')
  const [zoneColor, setZoneColor] = useState('#4ECDC4')
  const [zonePolygon, setZonePolygon] = useState<{ lat: number; lng: number }[]>([])
  
  const [forfaitFromZone, setForfaitFromZone] = useState('')
  const [forfaitToZone, setForfaitToZone] = useState('')
  const [forfaitVehicle, setForfaitVehicle] = useState('')
  const [forfaitPrice, setForfaitPrice] = useState('')
  
  const mapRef = useRef<google.maps.Map | null>(null)
  const polygonRef = useRef<google.maps.Polygon | null>(null)
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null)

  useEffect(() => {
    if (showZoneDialog && !mapRef.current) {
      initMap()
    }
  }, [showZoneDialog])

  useEffect(() => {
    if (editingZone) {
      setZoneName(editingZone.name)
      setZoneDescription(editingZone.description || '')
      setZoneColor(editingZone.color)
      setZonePolygon(editingZone.polygon)
    }
  }, [editingZone])

  useEffect(() => {
    if (editingForfait) {
      setForfaitFromZone(editingForfait.fromZoneId)
      setForfaitToZone(editingForfait.toZoneId)
      setForfaitVehicle(editingForfait.vehicleId)
      setForfaitPrice(editingForfait.fixedPrice.toString())
    }
  }, [editingForfait])

  const initMap = () => {
    const mapElement = document.getElementById('zone-map')
    if (!mapElement) return

    const map = new google.maps.Map(mapElement, {
      center: { lat: 48.8566, lng: 2.3522 },
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [
        {
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }]
        },
        {
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }]
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#616161" }]
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#f5f5f5" }]
        },
        {
          featureType: "administrative",
          elementType: "geometry",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#dadada" }]
        },
        {
          featureType: "transit",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#c9c9c9" }]
        }
      ]
    })

    mapRef.current = map

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      polygonOptions: {
        fillColor: zoneColor,
        fillOpacity: 0.35,
        strokeWeight: 2,
        strokeColor: zoneColor,
        editable: true,
        draggable: true,
      },
    })

    drawingManager.setMap(map)
    drawingManagerRef.current = drawingManager

    google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon: google.maps.Polygon) => {
      const path = polygon.getPath()
      const coordinates: { lat: number; lng: number }[] = []
      
      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i)
        coordinates.push({
          lat: point.lat(),
          lng: point.lng()
        })
      }
      
      setZonePolygon(coordinates)
      
      if (polygonRef.current) {
        polygonRef.current.setMap(null)
      }
      polygonRef.current = polygon

      google.maps.event.addListener(path, 'set_at', () => updatePolygonFromMap(polygon))
      google.maps.event.addListener(path, 'insert_at', () => updatePolygonFromMap(polygon))
      
      drawingManager.setDrawingMode(null)
    })

    if (editingZone && editingZone.polygon.length > 0) {
      displayExistingPolygon(map, editingZone.polygon, editingZone.color)
    }
  }

  const updatePolygonFromMap = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath()
    const coordinates: { lat: number; lng: number }[] = []
    
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i)
      coordinates.push({
        lat: point.lat(),
        lng: point.lng()
      })
    }
    
    setZonePolygon(coordinates)
  }

  const displayExistingPolygon = (map: google.maps.Map, polygon: { lat: number; lng: number }[], color: string) => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null)
    }

    const poly = new google.maps.Polygon({
      paths: polygon,
      fillColor: color,
      fillOpacity: 0.35,
      strokeWeight: 2,
      strokeColor: color,
      editable: true,
      draggable: true,
    })

    poly.setMap(map)
    polygonRef.current = poly

    const path = poly.getPath()
    google.maps.event.addListener(path, 'set_at', () => updatePolygonFromMap(poly))
    google.maps.event.addListener(path, 'insert_at', () => updatePolygonFromMap(poly))

    const bounds = new google.maps.LatLngBounds()
    polygon.forEach(point => bounds.extend(point))
    map.fitBounds(bounds)
  }

  const handleSaveZone = () => {
    if (!zoneName || zonePolygon.length < 3) {
      toast.error('Veuillez nommer la zone et dessiner au moins 3 points sur la carte')
      return
    }

    if (editingZone) {
      setZones((current) =>
        (current || []).map((zone) =>
          zone.id === editingZone.id
            ? { ...zone, name: zoneName, description: zoneDescription, color: zoneColor, polygon: zonePolygon }
            : zone
        )
      )
      toast.success('Zone mise à jour avec succès')
    } else {
      const newZone: PricingZone = {
        id: `zone-${Date.now()}`,
        name: zoneName,
        description: zoneDescription,
        color: zoneColor,
        polygon: zonePolygon,
      }
      setZones((current) => [...(current || []), newZone])
      toast.success('Zone créée avec succès')
    }

    handleCloseZoneDialog()
  }

  const handleDeleteZone = (zoneId: string) => {
    const relatedForfaits = forfaits?.filter(f => f.fromZoneId === zoneId || f.toZoneId === zoneId) || []
    
    if (relatedForfaits.length > 0) {
      toast.error(`Impossible de supprimer cette zone car ${relatedForfaits.length} forfait(s) l'utilisent`)
      return
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) {
      setZones((current) => (current || []).filter((zone) => zone.id !== zoneId))
      toast.success('Zone supprimée')
    }
  }

  const handleSaveForfait = () => {
    if (!forfaitFromZone || !forfaitToZone || !forfaitVehicle || !forfaitPrice) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    const price = parseFloat(forfaitPrice)
    if (isNaN(price) || price < 0) {
      toast.error('Prix invalide')
      return
    }

    if (editingForfait) {
      setForfaits((current) =>
        (current || []).map((forfait) =>
          forfait.id === editingForfait.id
            ? {
                ...forfait,
                fromZoneId: forfaitFromZone,
                toZoneId: forfaitToZone,
                vehicleId: forfaitVehicle,
                fixedPrice: price,
              }
            : forfait
        )
      )
      toast.success('Forfait mis à jour avec succès')
    } else {
      const newForfait: ZoneForfait = {
        id: `forfait-${Date.now()}`,
        fromZoneId: forfaitFromZone,
        toZoneId: forfaitToZone,
        vehicleId: forfaitVehicle,
        fixedPrice: price,
        createdAt: new Date().toISOString(),
      }
      setForfaits((current) => [...(current || []), newForfait])
      toast.success('Forfait créé avec succès')
    }

    handleCloseForfaitDialog()
  }

  const handleDeleteForfait = (forfaitId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce forfait ?')) {
      setForfaits((current) => (current || []).filter((forfait) => forfait.id !== forfaitId))
      toast.success('Forfait supprimé')
    }
  }

  const handleCloseZoneDialog = () => {
    setShowZoneDialog(false)
    setEditingZone(null)
    setZoneName('')
    setZoneDescription('')
    setZoneColor('#4ECDC4')
    setZonePolygon([])
    mapRef.current = null
    polygonRef.current = null
    drawingManagerRef.current = null
  }

  const handleCloseForfaitDialog = () => {
    setShowForfaitDialog(false)
    setEditingForfait(null)
    setForfaitFromZone('')
    setForfaitToZone('')
    setForfaitVehicle('')
    setForfaitPrice('')
  }

  const handleEditZone = (zone: PricingZone) => {
    setEditingZone(zone)
    setShowZoneDialog(true)
  }

  const handleEditForfait = (forfait: ZoneForfait) => {
    setEditingForfait(forfait)
    setShowForfaitDialog(true)
  }

  const getZoneName = (zoneId: string) => {
    return zones?.find((z) => z.id === zoneId)?.name || zoneId
  }

  const getVehicleName = (vehicleId: string) => {
    return fleetData?.find((v) => v.id === vehicleId)?.title || vehicleId
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="zones" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="forfaits">Forfaits Zone à Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des Zones</CardTitle>
                  <CardDescription>Créez et gérez les zones géographiques pour les forfaits</CardDescription>
                </div>
                <Button onClick={() => setShowZoneDialog(true)}>
                  <Plus className="mr-2" />
                  Nouvelle Zone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {zones && zones.length > 0 ? (
                <div className="space-y-2">
                  {zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: zone.color }}
                        />
                        <div>
                          <div className="font-medium">{zone.name}</div>
                          {zone.description && (
                            <div className="text-sm text-muted-foreground">{zone.description}</div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            {zone.polygon.length} points
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditZone(zone)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteZone(zone.id)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="mx-auto mb-2 opacity-50" size={48} />
                  <p>Aucune zone créée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forfaits" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Forfaits Zone à Zone</CardTitle>
                  <CardDescription>Définissez des tarifs fixes entre deux zones</CardDescription>
                </div>
                <Button
                  onClick={() => setShowForfaitDialog(true)}
                  disabled={!zones || zones.length < 2}
                >
                  <Plus className="mr-2" />
                  Nouveau Forfait
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {forfaits && forfaits.length > 0 ? (
                <div className="space-y-2">
                  {forfaits.map((forfait) => (
                    <div
                      key={forfait.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          {getZoneName(forfait.fromZoneId)} → {getZoneName(forfait.toZoneId)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getVehicleName(forfait.vehicleId)} - {forfait.fixedPrice}€
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditForfait(forfait)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteForfait(forfait.id)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aucun forfait créé</p>
                  {(!zones || zones.length < 2) && (
                    <p className="text-xs mt-2">Créez au moins 2 zones pour pouvoir créer des forfaits</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showZoneDialog} onOpenChange={setShowZoneDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingZone ? 'Modifier la Zone' : 'Nouvelle Zone'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zone-name">Nom de la zone</Label>
                <Input
                  id="zone-name"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="Ex: Aéroport CDG"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone-color">Couleur</Label>
                <div className="flex gap-2">
                  <Input
                    id="zone-color"
                    type="color"
                    value={zoneColor}
                    onChange={(e) => setZoneColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    value={zoneColor}
                    onChange={(e) => setZoneColor(e.target.value)}
                    placeholder="#4ECDC4"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone-description">Description (optionnelle)</Label>
              <Input
                id="zone-description"
                value={zoneDescription}
                onChange={(e) => setZoneDescription(e.target.value)}
                placeholder="Ex: Tous les terminaux de l'aéroport"
              />
            </div>
            <div className="space-y-2">
              <Label>Dessiner la zone sur la carte</Label>
              <div
                id="zone-map"
                className="w-full h-[400px] rounded-lg border border-border"
              />
              {zonePolygon.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {zonePolygon.length} points dessinés
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseZoneDialog}>
                Annuler
              </Button>
              <Button onClick={handleSaveZone}>
                {editingZone ? 'Mettre à jour' : 'Créer la zone'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showForfaitDialog} onOpenChange={setShowForfaitDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingForfait ? 'Modifier le Forfait' : 'Nouveau Forfait'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from-zone">Zone de départ</Label>
              <Select value={forfaitFromZone} onValueChange={setForfaitFromZone}>
                <SelectTrigger id="from-zone">
                  <SelectValue placeholder="Sélectionner une zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones?.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-zone">Zone d'arrivée</Label>
              <Select value={forfaitToZone} onValueChange={setForfaitToZone}>
                <SelectTrigger id="to-zone">
                  <SelectValue placeholder="Sélectionner une zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones?.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle">Véhicule</Label>
              <Select value={forfaitVehicle} onValueChange={setForfaitVehicle}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {fleetData?.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Prix fixe (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={forfaitPrice}
                onChange={(e) => setForfaitPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseForfaitDialog}>
                Annuler
              </Button>
              <Button onClick={handleSaveForfait}>
                {editingForfait ? 'Mettre à jour' : 'Créer le forfait'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
