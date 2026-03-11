import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MapPin, Plus, X, ArrowsClockwise, Lightning, Sparkle, CheckCircle, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import PlacesAutocomplete from '@/components/PlacesAutocomplete'
import { optimizeRoute, getRouteWithGoogleMaps } from '@/lib/routeOptimization'
import { motion, AnimatePresence } from 'framer-motion'

interface Stop {
  id: string
  address: string
  lat: number
  lng: number
  type: 'pickup' | 'destination' | 'intermediate'
  order?: number
}

interface MultiStopManagerProps {
  pickup: string
  pickupCoords: { lat: number; lng: number } | null
  destination: string
  destinationCoords: { lat: number; lng: number } | null
  onPickupChange: (address: string, coords: { lat: number; lng: number } | null) => void
  onDestinationChange: (address: string, coords: { lat: number; lng: number } | null) => void
  onStopsChange?: (stops: Stop[]) => void
  onRouteOptimized?: (result: { totalDistance: number; totalDuration: number; savings: number }) => void
}

export default function MultiStopManager({
  pickup,
  pickupCoords,
  destination,
  destinationCoords,
  onPickupChange,
  onDestinationChange,
  onStopsChange,
  onRouteOptimized
}: MultiStopManagerProps) {
  const [intermediateStops, setIntermediateStops] = useState<Stop[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)
  const [optimizationSavings, setOptimizationSavings] = useState<{
    distanceKm: number
    durationMinutes: number
    percentageImprovement: number
  } | null>(null)

  const addIntermediateStop = () => {
    const newStop: Stop = {
      id: `stop-${Date.now()}`,
      address: '',
      lat: 0,
      lng: 0,
      type: 'intermediate',
      order: intermediateStops.length
    }
    setIntermediateStops([...intermediateStops, newStop])
    setIsOptimized(false)
  }

  const removeIntermediateStop = (id: string) => {
    setIntermediateStops(intermediateStops.filter(stop => stop.id !== id))
    setIsOptimized(false)
  }

  const updateIntermediateStop = (id: string, address: string, coords: { lat: number; lng: number } | null) => {
    setIntermediateStops(intermediateStops.map(stop => 
      stop.id === id && coords
        ? { ...stop, address, lat: coords.lat, lng: coords.lng }
        : stop
    ))
    setIsOptimized(false)
  }

  const handleOptimizeRoute = async () => {
    if (!pickupCoords || !destinationCoords) {
      toast.error('Veuillez sélectionner une adresse de départ et d\'arrivée')
      return
    }

    const validStops = intermediateStops.filter(s => s.lat !== 0 && s.lng !== 0)
    if (validStops.length === 0) {
      toast.error('Ajoutez au moins un arrêt intermédiaire pour optimiser')
      return
    }

    setIsOptimizing(true)

    try {
      const stops: Stop[] = [
        { id: 'pickup', address: pickup, lat: pickupCoords.lat, lng: pickupCoords.lng, type: 'pickup' },
        ...validStops,
        { id: 'destination', address: destination, lat: destinationCoords.lat, lng: destinationCoords.lng, type: 'destination' }
      ]

      const result = await optimizeRoute(stops)
      
      const optimizedIntermediates = result.optimizedStops
        .filter(s => s.type === 'intermediate')
        .map((s, idx) => ({
          id: s.id || `stop-${idx}`,
          address: s.address,
          lat: s.lat,
          lng: s.lng,
          type: s.type,
          order: idx
        }) as Stop)

      setIntermediateStops(optimizedIntermediates)
      setIsOptimized(true)
      setOptimizationSavings(result.savings)

      const googleResult = await getRouteWithGoogleMaps(result.optimizedStops)
      
      if (onRouteOptimized) {
        onRouteOptimized({
          totalDistance: googleResult.totalDistance,
          totalDuration: googleResult.totalDuration,
          savings: result.savings.percentageImprovement
        })
      }

      if (onStopsChange) {
        onStopsChange(result.optimizedStops)
      }

      if (result.savings.percentageImprovement > 0) {
        toast.success('Itinéraire optimisé !', {
          description: `Économie de ${result.savings.distanceKm.toFixed(1)} km (${result.savings.percentageImprovement.toFixed(1)}%)`
        })
      } else {
        toast.success('Itinéraire déjà optimal !')
      }
    } catch (error) {
      console.error('Route optimization error:', error)
      toast.error('Erreur lors de l\'optimisation de l\'itinéraire')
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-accent" />
              Arrêts multiples
            </CardTitle>
            <CardDescription>
              Ajoutez des arrêts intermédiaires et optimisez automatiquement l'itinéraire
            </CardDescription>
          </div>
          {intermediateStops.length > 0 && (
            <Badge variant={isOptimized ? "default" : "secondary"} className="gap-1">
              {isOptimized ? (
                <>
                  <CheckCircle weight="fill" />
                  Optimisé
                </>
              ) : (
                'Non optimisé'
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pickup-stop">Départ</Label>
          <PlacesAutocomplete
            value={pickup}
            onChange={(address, coords) => onPickupChange(address, coords || null)}
            placeholder="Adresse de départ"
          />
        </div>

        <AnimatePresence mode="popLayout">
          {intermediateStops.map((stop, index) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm font-medium text-accent">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <PlacesAutocomplete
                    value={stop.address}
                    onChange={(address, coords) => updateIntermediateStop(stop.id, address, coords || null)}
                    placeholder={`Arrêt ${index + 1}`}
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeIntermediateStop(stop.id)}
                  className="flex-shrink-0"
                >
                  <X />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={addIntermediateStop}
        >
          <Plus />
          Ajouter un arrêt
        </Button>

        <div>
          <Label htmlFor="destination-stop">Destination</Label>
          <PlacesAutocomplete
            value={destination}
            onChange={(address, coords) => onDestinationChange(address, coords || null)}
            placeholder="Adresse d'arrivée"
          />
        </div>

        {intermediateStops.length > 0 && intermediateStops.filter(s => s.lat !== 0).length > 0 && (
          <div className="pt-4 border-t">
            <Button
              type="button"
              className="w-full gap-2"
              onClick={handleOptimizeRoute}
              disabled={isOptimizing}
            >
              {isOptimizing ? (
                <>
                  <ArrowsClockwise className="animate-spin" />
                  Optimisation en cours...
                </>
              ) : isOptimized ? (
                <>
                  <CheckCircle weight="fill" />
                  Ré-optimiser l'itinéraire
                </>
              ) : (
                <>
                  <Lightning />
                  Optimiser l'itinéraire
                </>
              )}
            </Button>

            {optimizationSavings && optimizationSavings.percentageImprovement > 0 && (
              <Alert className="mt-4 bg-accent/5 border-accent/20">
                <Sparkle className="text-accent" />
                <AlertTitle>Itinéraire optimisé !</AlertTitle>
                <AlertDescription>
                  Économie de <strong>{optimizationSavings.distanceKm.toFixed(1)} km</strong> et{' '}
                  <strong>{Math.round(optimizationSavings.durationMinutes)} minutes</strong>
                  {' '}({optimizationSavings.percentageImprovement.toFixed(1)}% d'amélioration)
                </AlertDescription>
              </Alert>
            )}

            {isOptimized && optimizationSavings && optimizationSavings.percentageImprovement === 0 && (
              <Alert className="mt-4">
                <Info />
                <AlertTitle>Itinéraire déjà optimal</AlertTitle>
                <AlertDescription>
                  L'ordre actuel des arrêts est déjà le plus efficace.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
