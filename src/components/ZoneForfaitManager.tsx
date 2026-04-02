import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash, Plus, MapPin, Pencil } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { VehicleClass, DEFAULT_FLEET } from '@/types/fleet'

export interface PricingZone {
  id: string
  name: string
  color: string
  description?: string
  polygon: { lat: number; lng: number }[]
}

export interface ZoneForfait {
  id: string
  fromZoneId: string
  toZoneId: string
  vehicleId: string
  fixedPrice: number
  lowSeasonPrice?: number
  highDemandPrice?: number
}

export default function ZoneForfaitManager() {
  const [zones, setZones] = useKV<PricingZone[]>('pricing-zones', [])
  const [forfaits, setForfaits] = useKV<ZoneForfait[]>('zone-forfaits', [])
  const [fleetData] = useKV<VehicleClass[]>('fleet', DEFAULT_FLEET)
  
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
  const [forfaitLowSeasonPrice, setForfaitLowSeasonPrice] = useState('')
  const [forfaitHighDemandPrice, setForfaitHighDemandPrice] = useState('')
  
  const mapRef = useRef<google.maps.Map | null>(null)
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null)
  const polygonRef = useRef<google.maps.Polygon | null>(null)

  const fleet = Array.isArray(fleetData) && fleetData.length > 0 ? fleetData : DEFAULT_FLEET

  useEffect(() => {
    if (showZoneDialog && mapRef.current === null) {
      let attempts = 0
      const maxAttempts = 10
      const tryInitMap = () => {
        attempts++
        if (window.google && window.google.maps && window.google.maps.drawing) {
          initMap()
        } else if (attempts < maxAttempts) {
          setTimeout(tryInitMap, 200)
        } else {
          toast.error('Impossible de charger Google Maps. Veuillez rafraîchir la page.')
        }
      }
      setTimeout(tryInitMap, 100)
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
      setForfaitLowSeasonPrice(editingForfait.lowSeasonPrice?.toString() || '')
      setForfaitHighDemandPrice(editingForfait.highDemandPrice?.toString() || '')
    }
  }, [editingForfait])

  const initMap = () => {
    const mapElement = document.getElementById('zone-map')
    if (!mapElement) return

    if (!window.google || !window.google.maps || !window.google.maps.drawing) {
      toast.error('Google Maps n\'est pas encore chargé. Veuillez réessayer.')
      return
    }

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
    const relatedForfaits = (forfaits || []).filter(f => f.fromZoneId === zoneId || f.toZoneId === zoneId)
    if (relatedForfaits.length > 0) {
      toast.error('Impossible de supprimer cette zone car elle est utilisée dans des forfaits')
      return
    }
    setZones((current) => (current || []).filter((zone) => zone.id !== zoneId))
    toast.success('Zone supprimée')
  }

  const handleEditZone = (zone: PricingZone) => {
    setEditingZone(zone)
    setShowZoneDialog(true)
  }

  const handleCloseZoneDialog = () => {
    setShowZoneDialog(false)
    setEditingZone(null)
    setZoneName('')
    setZoneDescription('')
    setZoneColor('#4ECDC4')
    setZonePolygon([])
    mapRef.current = null
    drawingManagerRef.current = null
    polygonRef.current = null
  }

  const handleSaveForfait = () => {
    if (!forfaitFromZone || !forfaitToZone || !forfaitVehicle || !forfaitPrice) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    const price = parseFloat(forfaitPrice)
    if (isNaN(price) || price <= 0) {
      toast.error('Le prix doit être un nombre positif')
      return
    }

    const lowSeasonPrice = forfaitLowSeasonPrice ? parseFloat(forfaitLowSeasonPrice) : undefined
    if (lowSeasonPrice !== undefined && (isNaN(lowSeasonPrice) || lowSeasonPrice <= 0)) {
      toast.error('Le prix basse saison doit être un nombre positif')
      return
    }

    const highDemandPrice = forfaitHighDemandPrice ? parseFloat(forfaitHighDemandPrice) : undefined
    if (highDemandPrice !== undefined && (isNaN(highDemandPrice) || highDemandPrice <= 0)) {
      toast.error('Le prix forte demande doit être un nombre positif')
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
                lowSeasonPrice: lowSeasonPrice,
                highDemandPrice: highDemandPrice
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
        lowSeasonPrice: lowSeasonPrice,
        highDemandPrice: highDemandPrice
      }
      setForfaits((current) => [...(current || []), newForfait])
      toast.success('Forfait créé avec succès')
    }

    handleCloseForfaitDialog()
  }

  const handleDeleteForfait = (forfaitId: string) => {
    setForfaits((current) => (current || []).filter((forfait) => forfait.id !== forfaitId))
    toast.success('Forfait supprimé')
  }

  const handleEditForfait = (forfait: ZoneForfait) => {
    setEditingForfait(forfait)
    setShowForfaitDialog(true)
  }

  const handleCloseForfaitDialog = () => {
    setShowForfaitDialog(false)
    setEditingForfait(null)
    setForfaitFromZone('')
    setForfaitToZone('')
    setForfaitVehicle('')
    setForfaitPrice('')
    setForfaitLowSeasonPrice('')
    setForfaitHighDemandPrice('')
  }

  const getZoneName = (zoneId: string) => {
    const zone = (zones || []).find((z) => z.id === zoneId)
    return zone?.name || 'Zone inconnue'
  }

  const getVehicleName = (vehicleId: string) => {
    const vehicle = fleet.find((v) => v.id === vehicleId)
    return vehicle?.title || 'Véhicule inconnu'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Gestion des Zones
          </CardTitle>
          <CardDescription>
            Créez et gérez les zones géographiques pour les forfaits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setShowZoneDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Créer une zone
          </Button>

          {(Array.isArray(zones) && zones.length > 0) ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Couleur</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(zones || []).map((zone) => (
                  <TableRow key={zone.id}>
                    <TableCell className="font-medium">{zone.name}</TableCell>
                    <TableCell>{zone.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: zone.color }}
                        />
                        <span className="text-xs text-muted-foreground">{zone.color}</span>
                      </div>
                    </TableCell>
                    <TableCell>{zone.polygon.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditZone(zone)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteZone(zone.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucune zone créée. Commencez par créer une zone géographique.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forfaits Zone à Zone</CardTitle>
          <CardDescription>
            Définissez des prix fixes pour les trajets entre zones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setShowForfaitDialog(true)}
            disabled={!zones || zones.length < 2}
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un forfait
          </Button>

          {!zones || zones.length < 2 ? (
            <p className="text-sm text-muted-foreground">
              Vous devez créer au moins 2 zones pour définir des forfaits.
            </p>
          ) : (Array.isArray(forfaits) && forfaits.length > 0) ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone départ</TableHead>
                  <TableHead>Zone arrivée</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Prix standard</TableHead>
                  <TableHead>Basse saison</TableHead>
                  <TableHead>Forte demande</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(forfaits || []).map((forfait) => (
                  <TableRow key={forfait.id}>
                    <TableCell className="font-medium">{getZoneName(forfait.fromZoneId)}</TableCell>
                    <TableCell>{getZoneName(forfait.toZoneId)}</TableCell>
                    <TableCell>{getVehicleName(forfait.vehicleId)}</TableCell>
                    <TableCell>{forfait.fixedPrice.toFixed(2)} €</TableCell>
                    <TableCell>{forfait.lowSeasonPrice ? `${forfait.lowSeasonPrice.toFixed(2)} €` : '-'}</TableCell>
                    <TableCell>{forfait.highDemandPrice ? `${forfait.highDemandPrice.toFixed(2)} €` : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditForfait(forfait)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteForfait(forfait.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucun forfait créé.
            </p>
          )}
        </CardContent>
      </Card>

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
                  {(zones || []).map((zone) => (
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
                  {(zones || []).map((zone) => (
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
                  {(fleet || []).map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Prix standard (€) *</Label>
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
            <div className="space-y-2">
              <Label htmlFor="low-season-price">Prix basse saison (€)</Label>
              <Input
                id="low-season-price"
                type="number"
                step="0.01"
                min="0"
                value={forfaitLowSeasonPrice}
                onChange={(e) => setForfaitLowSeasonPrice(e.target.value)}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Optionnel - Prix réduit pendant les périodes creuses</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="high-demand-price">Prix forte demande (€)</Label>
              <Input
                id="high-demand-price"
                type="number"
                step="0.01"
                min="0"
                value={forfaitHighDemandPrice}
                onChange={(e) => setForfaitHighDemandPrice(e.target.value)}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Optionnel - Prix majoré pendant les périodes de forte demande</p>
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
