import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, NavigationArrow, TrendUp, Clock, X } from '@phosphor-icons/react'
import { optimizeRoute } from '@/lib/routeOptimization'

interface Stop {
  address: string
  lat: number
  lng: number
  type: 'pickup' | 'destination' | 'intermediate'
  order?: number
  passengerName?: string
}

interface RoutePreviewMapProps {
  stops: Stop[]
  className?: string
  onClose?: () => void
  showOptimizationStats?: boolean
}

const MAP_STYLES = [
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

export default function RoutePreviewMap({ 
  stops, 
  className = '', 
  onClose,
  showOptimizationStats = true
}: RoutePreviewMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [optimizedStops, setOptimizedStops] = useState<Stop[]>([])
  const [routeStats, setRouteStats] = useState<{
    totalDistance: number
    totalDuration: number
    savings: {
      distanceKm: number
      durationMinutes: number
      percentageImprovement: number
    }
  } | null>(null)

  useEffect(() => {
    if (!mapRef.current || !window.google) return

    const initMap = async () => {
      setIsLoading(true)
      
      const center = stops.length > 0 
        ? { lat: stops[0].lat, lng: stops[0].lng }
        : { lat: 48.8566, lng: 2.3522 }

      const map = new google.maps.Map(mapRef.current!, {
        center,
        zoom: 12,
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      })

      mapInstanceRef.current = map

      if (stops.length >= 2) {
        try {
          const optimizationResult = await optimizeRoute(stops)
          setOptimizedStops(optimizationResult.optimizedStops)
          setRouteStats({
            totalDistance: optimizationResult.totalDistance,
            totalDuration: optimizationResult.totalDuration,
            savings: optimizationResult.savings
          })

          const directionsService = new google.maps.DirectionsService()
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#75B814',
              strokeWeight: 4,
              strokeOpacity: 0.8
            }
          })
          
          directionsRendererRef.current = directionsRenderer

          const origin = { 
            lat: optimizationResult.optimizedStops[0].lat, 
            lng: optimizationResult.optimizedStops[0].lng 
          }
          const destination = { 
            lat: optimizationResult.optimizedStops[optimizationResult.optimizedStops.length - 1].lat, 
            lng: optimizationResult.optimizedStops[optimizationResult.optimizedStops.length - 1].lng 
          }
          const waypoints = optimizationResult.optimizedStops.slice(1, -1).map(stop => ({
            location: { lat: stop.lat, lng: stop.lng },
            stopover: true
          }))

          directionsService.route(
            {
              origin,
              destination,
              waypoints,
              optimizeWaypoints: false,
              travelMode: google.maps.TravelMode.DRIVING
            },
            (result, status) => {
              if (status === 'OK' && result) {
                directionsRenderer.setDirections(result)
                
                markersRef.current.forEach(marker => marker.setMap(null))
                markersRef.current = []

                optimizationResult.optimizedStops.forEach((stop, index) => {
                  const isPickup = stop.type === 'pickup'
                  const isDestination = stop.type === 'destination'
                  const isIntermediate = stop.type === 'intermediate'

                  let markerColor = '#75B814'
                  let markerLabel = `${index + 1}`
                  let zIndex = 100 + index

                  if (isPickup) {
                    markerColor = '#2563EB'
                    markerLabel = 'A'
                    zIndex = 1000
                  } else if (isDestination) {
                    markerColor = '#DC2626'
                    markerLabel = 'B'
                    zIndex = 999
                  }

                  const marker = new google.maps.Marker({
                    position: { lat: stop.lat, lng: stop.lng },
                    map,
                    label: {
                      text: markerLabel,
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    },
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 18,
                      fillColor: markerColor,
                      fillOpacity: 1,
                      strokeColor: '#FFFFFF',
                      strokeWeight: 3
                    },
                    zIndex,
                    title: stop.address
                  })

                  const infoWindow = new google.maps.InfoWindow({
                    content: `
                      <div style="padding: 8px; font-family: sans-serif;">
                        <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px; color: #1f2937;">
                          ${isPickup ? '🚗 Départ' : isDestination ? '🏁 Arrivée' : `📍 Arrêt ${index}`}
                        </div>
                        <div style="font-size: 12px; color: #6b7280;">
                          ${stop.address}
                        </div>
                        ${stop.passengerName ? `
                          <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">
                            Passager: ${stop.passengerName}
                          </div>
                        ` : ''}
                      </div>
                    `
                  })

                  marker.addListener('click', () => {
                    infoWindow.open(map, marker)
                  })

                  markersRef.current.push(marker)
                })

                const bounds = new google.maps.LatLngBounds()
                optimizationResult.optimizedStops.forEach(stop => {
                  bounds.extend({ lat: stop.lat, lng: stop.lng })
                })
                map.fitBounds(bounds, { padding: 60 })
              }
              setIsLoading(false)
            }
          )
        } catch (error) {
          console.error('Error optimizing route:', error)
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null)
      }
    }
  }, [stops])

  return (
    <Card className={`overflow-hidden relative ${className}`}>
      {onClose && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white shadow-lg"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
      )}
      
      {showOptimizationStats && routeStats && !isLoading && (
        <div className="absolute top-4 left-4 z-10 space-y-2 max-w-xs">
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-accent/20">
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <NavigationArrow size={18} className="text-accent" weight="fill" />
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                  Itinéraire Optimisé
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Distance</div>
                  <div className="text-sm font-bold text-foreground">
                    {routeStats.totalDistance.toFixed(1)} km
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Durée</div>
                  <div className="text-sm font-bold text-foreground flex items-center gap-1">
                    <Clock size={14} weight="fill" />
                    {Math.round(routeStats.totalDuration)} min
                  </div>
                </div>
              </div>

              {routeStats.savings.percentageImprovement > 0 && (
                <div className="pt-2 border-t border-accent/20">
                  <div className="flex items-center gap-2 text-xs">
                    <TrendUp size={14} className="text-green-600" weight="bold" />
                    <span className="font-medium text-green-700">
                      {routeStats.savings.percentageImprovement.toFixed(1)}% plus efficace
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Économie: {routeStats.savings.distanceKm.toFixed(1)} km
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-accent/20">
            <div className="p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-foreground mb-2">
                {optimizedStops.length} Arrêts
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {optimizedStops.map((stop, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs">
                    <Badge 
                      variant={stop.type === 'pickup' ? 'default' : stop.type === 'destination' ? 'destructive' : 'secondary'}
                      className="flex-shrink-0 w-5 h-5 p-0 flex items-center justify-center text-[10px] font-bold"
                    >
                      {stop.type === 'pickup' ? 'A' : stop.type === 'destination' ? 'B' : index}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-foreground/80">
                        {stop.address.split(',')[0]}
                      </div>
                      {stop.passengerName && (
                        <div className="text-[10px] text-muted-foreground">
                          {stop.passengerName}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent/30 border-t-accent mx-auto" />
              <div className="text-sm font-medium text-foreground">
                Optimisation de l'itinéraire...
              </div>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      </div>
    </Card>
  )
}
