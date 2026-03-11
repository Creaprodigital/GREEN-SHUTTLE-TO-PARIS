import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader,
import { Trash, Plus, MapPin, Pencil } from '
import { useKV } from '@github/spark/hooks'

  id: string
  color: string
  description?: string

  id: string

  fixedPrice: number
}
interface Zone
}
export default function ZoneForfaitManage
  const [forfaits, set
 

  
  const [zon
  const [zonePolygon
  const [forfaitFr
  const [forfaitVeh
  
  const polygonRef 


    }

 

      setZonePolygon(editingZone.polygon)
  }, [editingZone])
  useEffect(() => {
  
      setForfaitVehicle(editingForfait.vehicleId)
    }

    const mapElement = document.getElementById('zone-map')

      center: { lat: 48.8566, lng: 2.3522 },
      mapTypeControl: false,
      styles: [
          elementType: "geometry",
  
          elementType: "labels.icon",
        },
          elementType: "labels.text.fill",
        },
  
        },
          featureType: "administrative",
          stylers: [{ visibility: "off" }]

          stylers: 
        {
          eleme
     
          featureType:

        {
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
      },

          stylers: [{ color: "#f5f5f5" }]
        },
        {
  const updatePolygonFromMap = (polyg
          stylers: [{ visibility: "off" }]
    for (l
        {
        lng: point.lng()
          stylers: [{ color: "#616161" }]
    setZon
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#f5f5f5" }]
    const 
        {
      strokeWeight: 2,
          elementType: "geometry",
    })
        },

          featureType: "poi",
          stylers: [{ visibility: "off" }]
        },
  }
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }]
        },
        (
          featureType: "road.highway",
        )
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
      toa
      ]
    if

    mapRef.current = map

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ],
        
      polygonOptions: {
              }
        fillOpacity: 0.35,
      toast.success('For
        strokeColor: zoneColor,
        fromZoneId: for
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
  const handleCloseForfait
        })
    set
      
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
   

  const updatePolygonFromMap = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath()
    const coordinates: { lat: number; lng: number }[] = []
    
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i)
      coordinates.push({
        lat: point.lat(),
                        
      })
     
    
    setZonePolygon(coordinates)
  }

  const displayExistingPolygon = (map: google.maps.Map, polygon: { lat: number; lng: number }[], color: string) => {
                          onC
      polygonRef.current.setMap(null)
     

    const poly = new google.maps.Polygon({
      paths: polygon,
      fillColor: color,
      fillOpacity: 0.35,
                <div c
      strokeColor: color,
              )}
      draggable: true,


    poly.setMap(map)
    polygonRef.current = poly

    const path = poly.getPath()
    google.maps.event.addListener(path, 'set_at', () => updatePolygonFromMap(poly))
    google.maps.event.addListener(path, 'insert_at', () => updatePolygonFromMap(poly))

    const bounds = new google.maps.LatLngBounds()
    polygon.forEach(point => bounds.extend(point))
    map.fitBounds(bounds)
   

  const handleSaveZone = () => {
    if (!zoneName || zonePolygon.length < 3) {
      toast.error('Veuillez nommer la zone et dessiner au moins 3 points sur la carte')
      return
     

    if (editingZone) {
      setZones((current) =>
        (current || []).map((zone) =>
          zone.id === editingZone.id
            ? { ...zone, name: zoneName, description: zoneDescription, color: zoneColor, polygon: zonePolygon }
            : zone
         
      )
      toast.success('Zone mise à jour avec succès')
    } else {
      const newZone: PricingZone = {
        id: `zone-${Date.now()}`,
        name: zoneName,
        description: zoneDescription,
          <DialogHeader>
        polygon: zonePolygon,
       
                <Label htmlFor="zone-name">Nom de la zone<
                  id="zone-name"
     

              <div classNam
   

                    value={zoneColor}
                    className="w-20 h-10"
    
                    onChange={(e) => 
                    className="flex-1"
            
     

                id="zone-description"
                onChange={(e) => setZoneDescription(e.target.value)}
              />
     
   

              {zonePolygon.length >
                  {zonePolygon.length} points dessinés
              )}
            
     

              </Button>
          </div>
      </Dialog>
      <Dialo
     

            <div classNam
              <Select value={f
                  <SelectValue placehold
                <SelectContent>
               
                    </Selec
                </SelectContent>
            </div>
              <Label htmlFor="to-zone">Zon
                <SelectTrigger id=
               
                  {zo
         
       
              </Select>
            
              <Select value={forfaitVeh
                  <SelectValue place
                <SelectContent>
                    <SelectItem 
                    </SelectItem>
                </SelectCo
            </div>
       
                id="price"
                step="0.01"
     

            </div>
   

                {editingForfait ? 'Mettre à jour' : 'C
            </div>
        </DialogContent>
    </div>
}


























































































































































































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
