import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MapPin, Plus, Trash, Pencil, CurrencyCircleDollar, Lightning, Copy, Download, Circle, Square, Polygon as PolygonIcon } from '@phosphor-icons/react'
import { PricingZone, ZonePricing, PREDEFINED_ZONES, PREDEFINED_ZONE_PRICINGS } from '@/types/pricing'
import { DEFAULT_FLEET } from '@/types/fleet'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

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
  const [isEditingZone, setIsEditingZone] = useState(false)
  
  const [newZoneName, setNewZoneName] = useState('')
  const [newZoneDescription, setNewZoneDescription] = useState('')
  const [newZoneColor, setNewZoneColor] = useState(ZONE_COLORS[0])
  const [drawingPoints, setDrawingPoints] = useState<{ lat: number; lng: number }[]>([])
  const [drawingMode, setDrawingMode] = useState<'manual' | 'circle' | 'rectangle'>('manual')
  const [circleRadius, setCircleRadius] = useState(2)
  const [rectangleWidth, setRectangleWidth] = useState(3)
  const [rectangleHeight, setRectangleHeight] = useState(2)
  
  const [newPricingFromZone, setNewPricingFromZone] = useState('')
  const [newPricingToZone, setNewPricingToZone] = useState('')
  const [newPricingVehicle, setNewPricingVehicle] = useState('')
  const [newPricingPrice, setNewPricingPrice] = useState('')
  const [isBulkPricingDialogOpen, setIsBulkPricingDialogOpen] = useState(false)
  const [bulkFromZone, setBulkFromZone] = useState('')
  const [bulkToZones, setBulkToZones] = useState<string[]>([])
  const [bulkPrices, setBulkPrices] = useState<Record<string, Record<string, string>>>({})
  const [isLoadPredefinedDialogOpen, setIsLoadPredefinedDialogOpen] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const polygonsRef = useRef<google.maps.Polygon[]>([])
  const drawingPolygonRef = useRef<google.maps.Polygon | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const draggingMarkerIndex = useRef<number | null>(null)

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

    return () => {
      polygonsRef.current.forEach(p => p.setMap(null))
      markersRef.current.forEach(m => m.setMap(null))
      if (drawingPolygonRef.current) {
        drawingPolygonRef.current.setMap(null)
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    const clickListener = mapInstanceRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!isCreatingZone || !e.latLng) return
      
      if (drawingMode === 'manual') {
        const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() }
        
        const marker = new google.maps.Marker({
          position: newPoint,
          map: mapInstanceRef.current,
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

        setDrawingPoints(prev => {
          const updatedPoints = [...prev, newPoint]
          
          if (drawingPolygonRef.current) {
            drawingPolygonRef.current.setMap(null)
          }

          if (updatedPoints.length >= 3) {
            drawingPolygonRef.current = new google.maps.Polygon({
              paths: updatedPoints,
              strokeColor: newZoneColor,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: newZoneColor,
              fillOpacity: 0.35,
              map: mapInstanceRef.current,
            })
          }

          return updatedPoints
        })
      } else if (drawingMode === 'circle') {
        handleDrawCircle(e.latLng)
      } else if (drawingMode === 'rectangle') {
        handleDrawRectangle(e.latLng)
      }
    })

    return () => {
      google.maps.event.removeListener(clickListener)
    }
  }, [isCreatingZone, newZoneColor, drawingMode])

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
    setIsEditingZone(false)
    setEditingZone(null)
    setDrawingPoints([])
    setDrawingMode('manual')
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
    if (drawingPolygonRef.current) {
      drawingPolygonRef.current.setMap(null)
      drawingPolygonRef.current = null
    }
    setNewZoneName('')
    setNewZoneDescription('')
    setNewZoneColor(ZONE_COLORS[(zones || []).length % ZONE_COLORS.length])
  }

  const handleDrawCircle = (center: google.maps.LatLng) => {
    const radiusInKm = circleRadius
    const radiusInDegrees = radiusInKm / 111
    
    const centerPoint = { lat: center.lat(), lng: center.lng() }
    
    const controlPoints = [
      { lat: center.lat() + radiusInDegrees, lng: center.lng() },
      { lat: center.lat(), lng: center.lng() + radiusInDegrees / Math.cos(center.lat() * Math.PI / 180) },
      { lat: center.lat() - radiusInDegrees, lng: center.lng() },
      { lat: center.lat(), lng: center.lng() - radiusInDegrees / Math.cos(center.lat() * Math.PI / 180) },
    ]
    
    const generateCircleFromRadius = (center: { lat: number; lng: number }, radius: number) => {
      const numPoints = 36
      const circlePoints: { lat: number; lng: number }[] = []
      
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI
        const lat = center.lat + radius * Math.cos(angle)
        const lng = center.lng + (radius * Math.sin(angle)) / Math.cos(center.lat * Math.PI / 180)
        circlePoints.push({ lat, lng })
      }
      
      return circlePoints
    }
    
    const circlePoints = generateCircleFromRadius(centerPoint, radiusInDegrees)
    
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
    
    controlPoints.forEach((point, index) => {
      const marker = new google.maps.Marker({
        position: point,
        map: mapInstanceRef.current,
        draggable: true,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FF0000',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      })
      
      marker.addListener('drag', () => {
        const newPos = marker.getPosition()
        if (newPos) {
          const dx = newPos.lat() - centerPoint.lat
          const dy = (newPos.lng() - centerPoint.lng) * Math.cos(centerPoint.lat * Math.PI / 180)
          const newRadius = Math.sqrt(dx * dx + dy * dy)
          
          const newCirclePoints = generateCircleFromRadius(centerPoint, newRadius)
          
          const newControlPoints = [
            { lat: centerPoint.lat + newRadius, lng: centerPoint.lng },
            { lat: centerPoint.lat, lng: centerPoint.lng + newRadius / Math.cos(centerPoint.lat * Math.PI / 180) },
            { lat: centerPoint.lat - newRadius, lng: centerPoint.lng },
            { lat: centerPoint.lat, lng: centerPoint.lng - newRadius / Math.cos(centerPoint.lat * Math.PI / 180) },
          ]
          
          markersRef.current.forEach((m, i) => {
            if (i !== index) {
              m.setPosition(newControlPoints[i])
            }
          })
          
          setDrawingPoints(newCirclePoints)
          
          if (drawingPolygonRef.current) {
            drawingPolygonRef.current.setPath(newCirclePoints)
          }
        }
      })
      
      markersRef.current.push(marker)
    })
    
    setDrawingPoints(circlePoints)
    
    if (drawingPolygonRef.current) {
      drawingPolygonRef.current.setMap(null)
    }
    
    drawingPolygonRef.current = new google.maps.Polygon({
      paths: circlePoints,
      strokeColor: newZoneColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: newZoneColor,
      fillOpacity: 0.35,
      map: mapInstanceRef.current,
    })
    
    toast.success('Cercle créé - Déplacez les 4 points rouges pour ajuster le rayon')
  }

  const handleDrawRectangle = (center: google.maps.LatLng) => {
    const widthInKm = rectangleWidth
    const heightInKm = rectangleHeight
    const widthInDegrees = widthInKm / 111
    const heightInDegrees = heightInKm / 111
    
    const centerPoint = { lat: center.lat(), lng: center.lng() }
    
    const halfWidth = widthInDegrees / 2
    const halfHeight = heightInDegrees / 2
    
    const controlPoints = [
      { lat: centerPoint.lat + halfHeight, lng: centerPoint.lng },
      { lat: centerPoint.lat, lng: centerPoint.lng + halfWidth / Math.cos(centerPoint.lat * Math.PI / 180) },
      { lat: centerPoint.lat - halfHeight, lng: centerPoint.lng },
      { lat: centerPoint.lat, lng: centerPoint.lng - halfWidth / Math.cos(centerPoint.lat * Math.PI / 180) },
    ]
    
    const generateRectangleFromDimensions = (center: { lat: number; lng: number }, width: number, height: number) => {
      const halfW = width / 2
      const halfH = height / 2
      
      return [
        { lat: center.lat - halfH, lng: center.lng - halfW / Math.cos(center.lat * Math.PI / 180) },
        { lat: center.lat - halfH, lng: center.lng + halfW / Math.cos(center.lat * Math.PI / 180) },
        { lat: center.lat + halfH, lng: center.lng + halfW / Math.cos(center.lat * Math.PI / 180) },
        { lat: center.lat + halfH, lng: center.lng - halfW / Math.cos(center.lat * Math.PI / 180) },
      ]
    }
    
    const rectanglePoints = generateRectangleFromDimensions(centerPoint, widthInDegrees, heightInDegrees)
    
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
    
    controlPoints.forEach((point, index) => {
      const marker = new google.maps.Marker({
        position: point,
        map: mapInstanceRef.current,
        draggable: true,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FF0000',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      })
      
      marker.addListener('drag', () => {
        const newPos = marker.getPosition()
        if (newPos) {
          let newWidth = widthInDegrees
          let newHeight = heightInDegrees
          
          if (index === 0 || index === 2) {
            newHeight = Math.abs(newPos.lat() - centerPoint.lat) * 2
          } else {
            newWidth = Math.abs((newPos.lng() - centerPoint.lng) * Math.cos(centerPoint.lat * Math.PI / 180)) * 2
          }
          
          const newRectanglePoints = generateRectangleFromDimensions(centerPoint, newWidth, newHeight)
          
          const newControlPoints = [
            { lat: centerPoint.lat + newHeight / 2, lng: centerPoint.lng },
            { lat: centerPoint.lat, lng: centerPoint.lng + newWidth / 2 / Math.cos(centerPoint.lat * Math.PI / 180) },
            { lat: centerPoint.lat - newHeight / 2, lng: centerPoint.lng },
            { lat: centerPoint.lat, lng: centerPoint.lng - newWidth / 2 / Math.cos(centerPoint.lat * Math.PI / 180) },
          ]
          
          markersRef.current.forEach((m, i) => {
            if (i !== index) {
              m.setPosition(newControlPoints[i])
            }
          })
          
          setDrawingPoints(newRectanglePoints)
          
          if (drawingPolygonRef.current) {
            drawingPolygonRef.current.setPath(newRectanglePoints)
          }
        }
      })
      
      markersRef.current.push(marker)
    })
    
    setDrawingPoints(rectanglePoints)
    
    if (drawingPolygonRef.current) {
      drawingPolygonRef.current.setMap(null)
    }
    
    drawingPolygonRef.current = new google.maps.Polygon({
      paths: rectanglePoints,
      strokeColor: newZoneColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: newZoneColor,
      fillOpacity: 0.35,
      map: mapInstanceRef.current,
    })
    
    toast.success('Rectangle créé - Déplacez les 4 points rouges pour ajuster les dimensions')
  }

  const handleStartEditingZone = (zone: PricingZone) => {
    setIsEditingZone(true)
    setIsCreatingZone(true)
    setEditingZone(zone)
    setNewZoneName(zone.name)
    setNewZoneDescription(zone.description || '')
    setNewZoneColor(zone.color)
    setDrawingPoints(zone.polygon)
    
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
    
    if (mapInstanceRef.current) {
      zone.polygon.forEach((point, index) => {
        const marker = new google.maps.Marker({
          position: point,
          map: mapInstanceRef.current,
          draggable: true,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: zone.color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        })
        
        marker.addListener('drag', () => {
          const newPos = marker.getPosition()
          if (newPos) {
            setDrawingPoints(prev => {
              const updated = [...prev]
              updated[index] = { lat: newPos.lat(), lng: newPos.lng() }
              
              if (drawingPolygonRef.current) {
                drawingPolygonRef.current.setPath(updated)
              }
              
              return updated
            })
          }
        })
        
        marker.addListener('dragend', () => {
          const newPos = marker.getPosition()
          if (newPos) {
            setDrawingPoints(prev => {
              const updated = [...prev]
              updated[index] = { lat: newPos.lat(), lng: newPos.lng() }
              return updated
            })
            toast.success('Point déplacé')
          }
        })
        
        markersRef.current.push(marker)
      })
      
      if (drawingPolygonRef.current) {
        drawingPolygonRef.current.setMap(null)
      }
      
      drawingPolygonRef.current = new google.maps.Polygon({
        paths: zone.polygon,
        strokeColor: zone.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: zone.color,
        fillOpacity: 0.35,
        map: mapInstanceRef.current,
        editable: false,
      })
    }
    
    toast.info(`Modification de la zone "${zone.name}" - Déplacez les points pour modifier la zone`)
  }

  const handleCancelDrawing = () => {
    setIsCreatingZone(false)
    setIsEditingZone(false)
    setEditingZone(null)
    setDrawingPoints([])
    setDrawingMode('manual')
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

    if (isEditingZone && editingZone) {
      const updatedZone: PricingZone = {
        ...editingZone,
        name: newZoneName,
        description: newZoneDescription,
        color: newZoneColor,
        polygon: drawingPoints,
      }

      setZones(current => (current || []).map(z => z.id === editingZone.id ? updatedZone : z))
      toast.success(`Zone "${newZoneName}" modifiée avec succès`)
    } else {
      const newZone: PricingZone = {
        id: `zone-${Date.now()}`,
        name: newZoneName,
        description: newZoneDescription,
        color: newZoneColor,
        polygon: drawingPoints,
      }

      setZones(current => [...(current || []), newZone])
      toast.success(`Zone "${newZoneName}" créée avec succès`)
    }
    
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

  const handleOpenBulkPricing = () => {
    setBulkFromZone('')
    setBulkToZones([])
    setBulkPrices({})
    setIsBulkPricingDialogOpen(true)
  }

  const handleBulkZoneToggle = (zoneId: string) => {
    setBulkToZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    )
  }

  const handleBulkPriceChange = (toZoneId: string, vehicleId: string, price: string) => {
    setBulkPrices(prev => ({
      ...prev,
      [toZoneId]: {
        ...(prev[toZoneId] || {}),
        [vehicleId]: price
      }
    }))
  }

  const handleCreateBulkPricings = () => {
    if (!bulkFromZone) {
      toast.error('Veuillez sélectionner une zone de départ')
      return
    }

    if (bulkToZones.length === 0) {
      toast.error('Veuillez sélectionner au moins une zone d\'arrivée')
      return
    }

    let createdCount = 0
    const newPricings: ZonePricing[] = []

    bulkToZones.forEach(toZoneId => {
      DEFAULT_FLEET.forEach(vehicle => {
        const price = bulkPrices[toZoneId]?.[vehicle.id]
        if (price && parseFloat(price) > 0) {
          newPricings.push({
            id: `pricing-${Date.now()}-${createdCount}`,
            fromZoneId: bulkFromZone,
            toZoneId: toZoneId,
            vehicleId: vehicle.id,
            fixedPrice: parseFloat(price),
            createdAt: new Date().toISOString(),
          })
          createdCount++
        }
      })
    })

    if (createdCount === 0) {
      toast.error('Veuillez entrer au moins un prix valide')
      return
    }

    setZonePricings(current => [...(current || []), ...newPricings])
    toast.success(`${createdCount} forfait(s) créé(s) avec succès`)
    setIsBulkPricingDialogOpen(false)
  }

  const handleDuplicatePricing = (pricing: ZonePricing) => {
    const newPricing: ZonePricing = {
      ...pricing,
      id: `pricing-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setZonePricings(current => [...(current || []), newPricing])
    toast.success('Forfait dupliqué')
  }

  const handleLoadPredefinedZones = () => {
    const existingZones = zones || []
    const existingPricings = zonePricings || []
    
    const newZones = PREDEFINED_ZONES.filter(
      predefinedZone => !existingZones.some(zone => zone.id === predefinedZone.id)
    )
    
    const newPricings = PREDEFINED_ZONE_PRICINGS.map((pricing, index) => ({
      ...pricing,
      id: `pricing-predefined-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
    })).filter(
      predefinedPricing => !existingPricings.some(
        pricing => 
          pricing.fromZoneId === predefinedPricing.fromZoneId &&
          pricing.toZoneId === predefinedPricing.toZoneId &&
          pricing.vehicleId === predefinedPricing.vehicleId
      )
    )

    if (newZones.length === 0 && newPricings.length === 0) {
      toast.info('Tous les forfaits prédéfinis sont déjà chargés')
      setIsLoadPredefinedDialogOpen(false)
      return
    }

    setZones(current => [...(current || []), ...newZones])
    setZonePricings(current => [...(current || []), ...newPricings])
    
    toast.success(
      `${newZones.length} zone(s) et ${newPricings.length} forfait(s) prédéfini(s) chargé(s)`
    )
    setIsLoadPredefinedDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Forfaits Prédéfinis</h3>
              <p className="text-sm text-muted-foreground">
                Chargez rapidement les zones principales (aéroports CDG, Orly, Beauvais, gares, centres-villes) avec leurs forfaits
              </p>
            </div>
            <Button
              onClick={() => setIsLoadPredefinedDialogOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <Download />
              Charger les Forfaits Prédéfinis
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-accent" />
              Carte des Zones
            </CardTitle>
            <CardDescription>
              {isCreatingZone 
                ? (isEditingZone 
                    ? 'Déplacez les points existants en les faisant glisser ou cliquez sur la carte pour ajouter de nouveaux points'
                    : drawingMode === 'manual'
                      ? 'Cliquez sur la carte pour dessiner les points de la zone manuellement'
                      : drawingMode === 'circle'
                        ? 'Cliquez sur la carte pour placer le centre du cercle'
                        : 'Cliquez sur la carte pour placer le coin du rectangle')
                : 'Cliquez sur "Nouvelle Zone" pour commencer à dessiner'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              ref={mapRef} 
              className="w-full h-[500px] rounded-lg border border-border/50"
            />
            
            {isCreatingZone && !isEditingZone && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 p-3 bg-secondary/30 rounded-lg border border-border/50"
              >
                <div className="space-y-1">
                  <Label className="text-xs">Mode de dessin</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={drawingMode === 'manual' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDrawingMode('manual')}
                      className="flex-1 gap-2"
                    >
                      <PolygonIcon />
                      Manuel
                    </Button>
                    <Button
                      variant={drawingMode === 'circle' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDrawingMode('circle')}
                      className="flex-1 gap-2"
                    >
                      <Circle />
                      Cercle
                    </Button>
                    <Button
                      variant={drawingMode === 'rectangle' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDrawingMode('rectangle')}
                      className="flex-1 gap-2"
                    >
                      <Square />
                      Rectangle
                    </Button>
                  </div>
                </div>

                {drawingMode === 'circle' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <Label htmlFor="circle-radius" className="text-xs">Rayon du cercle (km)</Label>
                    <Input
                      id="circle-radius"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={circleRadius}
                      onChange={(e) => setCircleRadius(parseFloat(e.target.value) || 2)}
                      placeholder="2"
                      className="w-full"
                    />
                  </motion.div>
                )}

                {drawingMode === 'rectangle' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="rectangle-width" className="text-xs">Largeur (km)</Label>
                      <Input
                        id="rectangle-width"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={rectangleWidth}
                        onChange={(e) => setRectangleWidth(parseFloat(e.target.value) || 3)}
                        placeholder="3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rectangle-height" className="text-xs">Hauteur (km)</Label>
                      <Input
                        id="rectangle-height"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={rectangleHeight}
                        onChange={(e) => setRectangleHeight(parseFloat(e.target.value) || 2)}
                        placeholder="2"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
            
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
                    {isEditingZone ? 'Enregistrer les Modifications' : 'Enregistrer la Zone'}
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
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEditingZone(zone)}
                          disabled={isCreatingZone}
                          title="Modifier cette zone"
                        >
                          <Pencil className="text-accent" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteZone(zone.id)}
                          disabled={isCreatingZone}
                        >
                          <Trash className="text-destructive" />
                        </Button>
                      </div>
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
              <div className="flex gap-2">
                {!isCreatingPricing ? (
                  <>
                    <Button 
                      onClick={() => setIsCreatingPricing(true)} 
                      className="flex-1"
                      disabled={zones.length < 2}
                    >
                      <Plus className="mr-2" />
                      Nouveau Forfait
                    </Button>
                    <Button
                      onClick={handleOpenBulkPricing}
                      variant="outline"
                      className="flex-1"
                      disabled={zones.length < 2}
                    >
                      <Lightning className="mr-2" />
                      Création en Masse
                    </Button>
                  </>
                ) : null}
              </div>

              {isCreatingPricing && (
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
                  <TableHead className="w-[100px]"></TableHead>
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
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicatePricing(pricing)}
                            title="Dupliquer ce forfait"
                          >
                            <Copy size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePricing(pricing.id)}
                          >
                            <Trash className="text-destructive" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isLoadPredefinedDialogOpen} onOpenChange={setIsLoadPredefinedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Charger les Forfaits Prédéfinis</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Cette action va charger les zones et forfaits suivants :
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <strong className="text-foreground">Zones (10) :</strong>
                  <ul className="list-disc list-inside ml-2 mt-1 text-muted-foreground">
                    <li>Aéroports : CDG, Orly, Beauvais</li>
                    <li>Gares : Gare du Nord, Gare de Lyon, Gare Montparnasse</li>
                    <li>Zones : Paris Centre, La Défense, Disneyland, Versailles</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">Forfaits ({PREDEFINED_ZONE_PRICINGS.length}) :</strong>
                  <ul className="list-disc list-inside ml-2 mt-1 text-muted-foreground">
                    <li>Tous les trajets entre aéroports et Paris Centre</li>
                    <li>Trajets entre gares et Paris Centre</li>
                    <li>Trajets vers Disneyland et Versailles</li>
                    <li>Prix pour tous les types de véhicules (Eco, Business, Van, First Class)</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Note : Les zones et forfaits déjà existants ne seront pas dupliqués.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoadPredefinedZones}>
              Charger
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isBulkPricingDialogOpen} onOpenChange={setIsBulkPricingDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Création en Masse de Forfaits</DialogTitle>
            <DialogDescription>
              Créez plusieurs forfaits simultanément pour une zone de départ vers plusieurs zones d'arrivée
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Zone de Départ *</Label>
              <Select value={bulkFromZone} onValueChange={setBulkFromZone}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la zone de départ..." />
                </SelectTrigger>
                <SelectContent>
                  {(zones || []).map(zone => (
                    <SelectItem key={zone.id} value={zone.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        />
                        {zone.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Zones d'Arrivée *</Label>
              <div className="grid grid-cols-2 gap-2">
                {(zones || [])
                  .filter(zone => zone.id !== bulkFromZone)
                  .map(zone => (
                    <div
                      key={zone.id}
                      onClick={() => handleBulkZoneToggle(zone.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        bulkToZones.includes(zone.id)
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        />
                        <span className="font-medium">{zone.name}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {bulkToZones.length > 0 && (
              <div className="space-y-4">
                <Label>Prix par Véhicule (€)</Label>
                {bulkToZones.map(toZoneId => {
                  const toZone = zones?.find(z => z.id === toZoneId)
                  if (!toZone) return null

                  return (
                    <div key={toZoneId} className="p-4 bg-secondary/30 rounded-lg space-y-3">
                      <div className="flex items-center gap-2 font-medium">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: toZone.color }}
                        />
                        Vers {toZone.name}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {DEFAULT_FLEET.map(vehicle => (
                          <div key={vehicle.id} className="space-y-1">
                            <Label className="text-xs">{vehicle.title}</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Prix..."
                              value={bulkPrices[toZoneId]?.[vehicle.id] || ''}
                              onChange={(e) =>
                                handleBulkPriceChange(toZoneId, vehicle.id, e.target.value)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateBulkPricings} className="flex-1">
                <Plus className="mr-2" />
                Créer les Forfaits
              </Button>
              <Button
                onClick={() => setIsBulkPricingDialogOpen(false)}
                variant="outline"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
