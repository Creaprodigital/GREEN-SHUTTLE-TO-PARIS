import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Plus, Trash, MapPin, Path, X, Check, ArrowUp, ArrowDown, Info } from '@phosphor-icons/react'
import { Circuit, CircuitStop } from '@/types/circuit'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

export default function CircuitManager() {
  const [circuits, setCircuits] = useKV<Circuit[]>('circuits', [])
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null)
  const [isCreatingCircuit, setIsCreatingCircuit] = useState(false)
  const [newCircuitName, setNewCircuitName] = useState('')
  const [newCircuitDescription, setNewCircuitDescription] = useState('')
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null)
  const [newStopTitle, setNewStopTitle] = useState('')
  const [newStopAddress, setNewStopAddress] = useState('')
  const [newStopDuration, setNewStopDuration] = useState('')
  const [newStopNotes, setNewStopNotes] = useState('')

  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const directionsRenderersRef = useRef<google.maps.DirectionsRenderer[]>([])
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingCircuit && mapRef.current && !googleMapRef.current) {
      initializeMap()
    }
  }, [editingCircuit])

  useEffect(() => {
    if (editingCircuit && googleMapRef.current) {
      updateMapMarkers()
    }
  }, [editingCircuit?.stops])

  const initializeMap = () => {
    if (!mapRef.current) return

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 48.8566, lng: 2.3522 },
      zoom: 12,
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      scaleControl: true,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'administrative',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { visibility: 'simplified' }]
        },
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.attraction',
          elementType: 'geometry',
          stylers: [{ visibility: 'on' }, { color: '#e8d5b7' }]
        },
        {
          featureType: 'poi.attraction',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'poi.attraction',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#8b7355' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ visibility: 'on' }, { color: '#d4e5c1' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ visibility: 'on' }, { color: '#ffffff' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#d9d9d9' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#ffeaa7' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#fdcb6e' }]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [{ color: '#ffffff' }]
        },
        {
          featureType: 'road',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#6b6b6b' }]
        },
        {
          featureType: 'transit',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#a8d8ea' }]
        },
        {
          featureType: 'water',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#5a8aa0' }]
        }
      ]
    })

    googleMapRef.current = map
      directionsServiceRef.current = new google.maps.DirectionsService()

    if (inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry', 'name']
      })
      autocomplete.bindTo('bounds', map)
      autocompleteRef.current = autocomplete
    }

    if (editingCircuit && editingCircuit.stops.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      editingCircuit.stops.forEach(stop => {
        bounds.extend({ lat: stop.lat, lng: stop.lng })
      })
      map.fitBounds(bounds)
    }
  }

  const updateMapMarkers = () => {
    if (!googleMapRef.current || !editingCircuit) return

    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    
    directionsRenderersRef.current.forEach(renderer => renderer.setMap(null))
    directionsRenderersRef.current = []

    const bounds = new google.maps.LatLngBounds()

    editingCircuit.stops.forEach((stop, index) => {
      const marker = new google.maps.Marker({
        position: { lat: stop.lat, lng: stop.lng },
        map: googleMapRef.current,
        label: {
          text: `${index + 1}`,
          color: '#0f0f0f',
          fontWeight: 'bold'
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 20,
          fillColor: '#b8d970',
          fillOpacity: 1,
          strokeColor: '#0f0f0f',
          strokeWeight: 2
        }
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #0f0f0f; font-weight: 600;">
            <strong>Étape ${index + 1}</strong><br/>
            ${stop.title ? `<strong style="font-size: 14px;">${stop.title}</strong><br/>` : ''}
            <span style="font-size: 12px; color: #666;">📍 ${stop.address}</span><br/>
            ${stop.duration ? `Durée: ${stop.duration} min<br/>` : ''}
            ${stop.notes ? `<em>${stop.notes}</em>` : ''}
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(googleMapRef.current, marker)
      })

      markersRef.current.push(marker)
      bounds.extend({ lat: stop.lat, lng: stop.lng })
    })

    if (editingCircuit.stops.length > 1 && directionsServiceRef.current && googleMapRef.current) {
      for (let i = 0; i < editingCircuit.stops.length - 1; i++) {
        const origin = { lat: editingCircuit.stops[i].lat, lng: editingCircuit.stops[i].lng }
        const destination = { lat: editingCircuit.stops[i + 1].lat, lng: editingCircuit.stops[i + 1].lng }

        directionsServiceRef.current.route(
          {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result && googleMapRef.current) {
              const directionsRenderer = new google.maps.DirectionsRenderer({
                map: googleMapRef.current,
                directions: result,
                suppressMarkers: true,
                preserveViewport: true,
                polylineOptions: {
                  strokeColor: '#b8d970',
                  strokeOpacity: 0.8,
                  strokeWeight: 4
                }
              })
              directionsRenderersRef.current.push(directionsRenderer)
            }
          }
        )
      }
    }

    if (editingCircuit.stops.length > 0) {
      googleMapRef.current.fitBounds(bounds)
    }
  }

  const handleCreateCircuit = () => {
    if (!newCircuitName) {
      toast.error('Veuillez entrer un nom pour le circuit')
      return
    }

    const newCircuit: Circuit = {
      id: `circuit-${Date.now()}`,
      name: newCircuitName,
      description: newCircuitDescription,
      stops: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setCircuits((current) => [...(current || []), newCircuit])
    setEditingCircuit(newCircuit)
    setIsCreatingCircuit(false)
    setNewCircuitName('')
    setNewCircuitDescription('')
    toast.success('Circuit créé avec succès')
  }

  const handleAddStop = async () => {
    if (!newStopAddress || !editingCircuit) {
      toast.error('Veuillez entrer une adresse')
      return
    }

    if (!newStopTitle) {
      toast.error('Veuillez entrer un titre pour cette étape')
      return
    }

    const geocoder = new google.maps.Geocoder()
    
    try {
      const result = await new Promise<google.maps.GeocoderResult>((resolve, reject) => {
        geocoder.geocode({ address: newStopAddress }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            resolve(results[0])
          } else {
            reject(new Error('Adresse non trouvée'))
          }
        })
      })

      const location = result.geometry.location
      const newStop: CircuitStop = {
        id: `stop-${Date.now()}`,
        title: newStopTitle,
        address: result.formatted_address || newStopAddress,
        lat: location.lat(),
        lng: location.lng(),
        order: editingCircuit.stops.length,
        duration: newStopDuration ? parseInt(newStopDuration) : undefined,
        notes: newStopNotes || undefined
      }

      const updatedCircuit = {
        ...editingCircuit,
        stops: [...editingCircuit.stops, newStop],
        updatedAt: new Date().toISOString()
      }

      setEditingCircuit(updatedCircuit)
      setCircuits((current) =>
        (current || []).map((c) => (c.id === editingCircuit.id ? updatedCircuit : c))
      )

      setNewStopTitle('')
      setNewStopAddress('')
      setNewStopDuration('')
      setNewStopNotes('')
      toast.success('Étape ajoutée au circuit')
    } catch (error) {
      toast.error('Impossible de trouver cette adresse')
    }
  }

  const handleDeleteStop = (stopId: string) => {
    if (!editingCircuit) return

    const updatedCircuit = {
      ...editingCircuit,
      stops: editingCircuit.stops
        .filter((s) => s.id !== stopId)
        .map((s, idx) => ({ ...s, order: idx })),
      updatedAt: new Date().toISOString()
    }

    setEditingCircuit(updatedCircuit)
    setCircuits((current) =>
      (current || []).map((c) => (c.id === editingCircuit.id ? updatedCircuit : c))
    )
    toast.success('Étape supprimée')
  }

  const handleMoveStop = (stopId: string, direction: 'up' | 'down') => {
    if (!editingCircuit) return

    const stops = [...editingCircuit.stops]
    const currentIndex = stops.findIndex((s) => s.id === stopId)

    if (
      currentIndex === -1 ||
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === stops.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const temp = stops[currentIndex]
    stops[currentIndex] = stops[newIndex]
    stops[newIndex] = temp

    const reorderedStops = stops.map((s, idx) => ({ ...s, order: idx }))

    const updatedCircuit = {
      ...editingCircuit,
      stops: reorderedStops,
      updatedAt: new Date().toISOString()
    }

    setEditingCircuit(updatedCircuit)
    setCircuits((current) =>
      (current || []).map((c) => (c.id === editingCircuit.id ? updatedCircuit : c))
    )
  }

  const handleDeleteCircuit = (circuitId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce circuit?')) {
      setCircuits((current) => (current || []).filter((c) => c.id !== circuitId))
      if (editingCircuit?.id === circuitId) {
        setEditingCircuit(null)
        googleMapRef.current = null
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []
        directionsRenderersRef.current.forEach(renderer => renderer.setMap(null))
        directionsRenderersRef.current = []
      }
      toast.success('Circuit supprimé')
    }
  }

  const handleUpdateCircuitInfo = () => {
    if (!editingCircuit) return

    const updatedCircuit = {
      ...editingCircuit,
      updatedAt: new Date().toISOString()
    }

    setCircuits((current) =>
      (current || []).map((c) => (c.id === editingCircuit.id ? updatedCircuit : c))
    )
    toast.success('Circuit mis à jour')
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Gestion des Circuits Touristiques
        </h2>
        <p className="text-foreground/70">
          Créez et gérez vos circuits touristiques avec des étapes personnalisées
        </p>
      </div>

      <Card className="border-2 border-accent/20">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl font-semibold uppercase tracking-wide flex items-center gap-2">
            <Plus size={24} className="text-accent" />
            Créer un nouveau circuit
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={() => setIsCreatingCircuit(true)}
            className="h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
          >
            <Plus className="mr-2" size={20} />
            Nouveau Circuit
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isCreatingCircuit} onOpenChange={setIsCreatingCircuit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase tracking-wide">
              Créer un Circuit
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="circuit-name" className="text-sm font-medium uppercase tracking-wide">
                Nom du Circuit
              </Label>
              <Input
                id="circuit-name"
                value={newCircuitName}
                onChange={(e) => setNewCircuitName(e.target.value)}
                placeholder="ex: Tour de Paris"
                className="h-12 bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="circuit-description" className="text-sm font-medium uppercase tracking-wide">
                Description
              </Label>
              <Textarea
                id="circuit-description"
                value={newCircuitDescription}
                onChange={(e) => setNewCircuitDescription(e.target.value)}
                placeholder="Description du circuit..."
                className="min-h-[100px] bg-secondary border-border"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateCircuit}
                className="flex-1 h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
              >
                <Check className="mr-2" size={20} />
                Créer
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreatingCircuit(false)}
                className="h-12 px-6"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {(circuits || []).map((circuit, index) => (
          <motion.div
            key={circuit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="border-2 border-accent/20">
              <CardContent className="py-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold uppercase tracking-wide text-foreground">
                      {circuit.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{circuit.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-xs text-muted-foreground">
                        {circuit.stops.length} étape{circuit.stops.length > 1 ? 's' : ''}
                      </p>
                      {circuit.price !== undefined && (
                        <p className="text-sm font-semibold text-accent">
                          Prix: {circuit.price.toFixed(2)} €
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingCircuit(circuit)
                        googleMapRef.current = null
                      }}
                      className="h-11 px-6 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
                    >
                      <Path className="mr-2" size={18} />
                      Modifier
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteCircuit(circuit.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </div>

                {circuit.stops.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {circuit.stops.map((stop, idx) => (
                      <div
                        key={stop.id}
                        className="flex items-center gap-3 p-3 bg-muted/30 border border-border"
                      >
                        <div className="w-8 h-8 bg-accent flex items-center justify-center text-accent-foreground font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{stop.title || stop.address}</p>
                          {stop.duration && (
                            <p className="text-xs text-muted-foreground">Durée: {stop.duration} min</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={editingCircuit !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCircuit(null)
            googleMapRef.current = null
            markersRef.current.forEach(marker => marker.setMap(null))
            markersRef.current = []
            directionsRenderersRef.current.forEach(renderer => renderer.setMap(null))
            directionsRenderersRef.current = []
          }
        }}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase tracking-wide">
              {editingCircuit?.name}
            </DialogTitle>
          </DialogHeader>

          {editingCircuit && (
            <div className="space-y-6 pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium uppercase tracking-wide">
                      Nom du Circuit
                    </Label>
                    <Input
                      value={editingCircuit.name}
                      onChange={(e) =>
                        setEditingCircuit({ ...editingCircuit, name: e.target.value })
                      }
                      onBlur={handleUpdateCircuitInfo}
                      className="h-11 bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium uppercase tracking-wide">
                      Description
                    </Label>
                    <Textarea
                      value={editingCircuit.description}
                      onChange={(e) =>
                        setEditingCircuit({ ...editingCircuit, description: e.target.value })
                      }
                      onBlur={handleUpdateCircuitInfo}
                      className="min-h-[100px] bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="circuit-price" className="text-sm font-medium uppercase tracking-wide flex items-center gap-2">
                      Prix du Circuit (€)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={16} className="text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">Prix fixe pour ce circuit touristique. Ce prix sera appliqué lors de la réservation.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="circuit-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingCircuit.price !== undefined && editingCircuit.price !== 0 ? editingCircuit.price : ''}
                      onChange={(e) =>
                        setEditingCircuit({ ...editingCircuit, price: e.target.value ? parseFloat(e.target.value) : undefined })
                      }
                      onBlur={handleUpdateCircuitInfo}
                      placeholder="150.00"
                      className="h-11 bg-secondary border-border"
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-lg font-semibold uppercase tracking-wide mb-3">
                      Ajouter une Étape
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="new-stop-title" className="text-sm font-medium uppercase tracking-wide">
                          Titre de l'Étape
                        </Label>
                        <Input
                          id="new-stop-title"
                          value={newStopTitle}
                          onChange={(e) => setNewStopTitle(e.target.value)}
                          placeholder="ex: Tour Eiffel, Arc de Triomphe..."
                          className="h-11 bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-stop-address" className="text-sm font-medium uppercase tracking-wide">
                          Adresse (pour la carte)
                        </Label>
                        <Input
                          id="new-stop-address"
                          ref={inputRef}
                          value={newStopAddress}
                          onChange={(e) => setNewStopAddress(e.target.value)}
                          placeholder="Entrez une adresse..."
                          className="h-11 bg-secondary border-border"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="new-stop-duration" className="text-sm font-medium uppercase tracking-wide">
                            Durée (min)
                          </Label>
                          <Input
                            id="new-stop-duration"
                            type="number"
                            value={newStopDuration}
                            onChange={(e) => setNewStopDuration(e.target.value)}
                            placeholder="30"
                            className="h-11 bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-stop-notes" className="text-sm font-medium uppercase tracking-wide">
                            Notes
                          </Label>
                          <Input
                            id="new-stop-notes"
                            value={newStopNotes}
                            onChange={(e) => setNewStopNotes(e.target.value)}
                            placeholder="Note..."
                            className="h-11 bg-secondary border-border"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleAddStop}
                        className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-medium uppercase tracking-widest"
                      >
                        <Plus className="mr-2" size={18} />
                        Ajouter l'Étape
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="text-lg font-semibold uppercase tracking-wide mb-3">
                      Étapes du Circuit ({editingCircuit.stops.length})
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {editingCircuit.stops.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Aucune étape ajoutée
                        </p>
                      ) : (
                        editingCircuit.stops.map((stop, idx) => (
                          <div
                            key={stop.id}
                            className="flex items-start gap-2 p-3 bg-muted/30 border border-border"
                          >
                            <div className="w-8 h-8 bg-accent flex items-center justify-center text-accent-foreground font-bold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{stop.title || stop.address}</p>
                              <p className="text-xs text-muted-foreground italic">📍 {stop.address}</p>
                              {stop.duration && (
                                <p className="text-xs text-muted-foreground">Durée: {stop.duration} min</p>
                              )}
                              {stop.notes && (
                                <p className="text-xs text-muted-foreground italic">{stop.notes}</p>
                              )}
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleMoveStop(stop.id, 'up')}
                                disabled={idx === 0}
                                className="h-8 w-8"
                              >
                                <ArrowUp size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleMoveStop(stop.id, 'down')}
                                disabled={idx === editingCircuit.stops.length - 1}
                                className="h-8 w-8"
                              >
                                <ArrowDown size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteStop(stop.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium uppercase tracking-wide">
                    Carte du Circuit
                  </Label>
                  <div
                    ref={mapRef}
                    className="w-full h-[600px] bg-muted/50 border-2 border-border"
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
