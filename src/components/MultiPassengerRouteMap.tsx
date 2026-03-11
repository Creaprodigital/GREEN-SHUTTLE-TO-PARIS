import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, Clock, ArrowRight, User } from '@phosphor-icons/react'
import { Booking } from '@/types/booking'

interface Waypoint {
  id: string
  location: { lat: number; lng: number }
  address: string
  type: 'pickup' | 'dropoff'
  bookingId: string
  passengerName: string
  passengerCount: number
  order: number
}

interface MultiPassengerRouteMapProps {
  bookings: Booking[]
  sharedRideId?: string
  height?: string
  showDetails?: boolean
  onOptimize?: (optimizedWaypoints: Waypoint[]) => void
}

export default function MultiPassengerRouteMap({ 
  bookings, 
  sharedRideId,
  height = '500px',
  showDetails = true,
  onOptimize
}: MultiPassengerRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [optimizedWaypoints, setOptimizedWaypoints] = useState<Waypoint[]>([])
  const [routeInfo, setRouteInfo] = useState<{
    totalDistance: number
    totalDuration: number
    detourPercentage: number
  } | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)

  const relevantBookings = sharedRideId 
    ? bookings.filter(b => b.sharedRideId === sharedRideId)
    : bookings.filter(b => b.serviceType === 'shared')

  useEffect(() => {
    if (!mapRef.current || !window.google) return

    const newMap = new google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 48.8566, lng: 2.3522 },
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }]
        },
        {
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{ color: '#616161' }]
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#f5f5f5' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#ffffff' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#dadada' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#c9c9c9' }]
        }
      ]
    })

    const renderer = new google.maps.DirectionsRenderer({
      map: newMap,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#75E14B',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    })

    setMap(newMap)
    setDirectionsRenderer(renderer)
  }, [])

  useEffect(() => {
    if (!map || relevantBookings.length === 0) return

    const geocoder = new google.maps.Geocoder()
    const newWaypoints: Waypoint[] = []
    let geocodeCount = 0
    const totalGeocodes = relevantBookings.length * 2

    const geocodePromises = relevantBookings.flatMap((booking, idx) => {
      const promises = []

      if (booking.pickup) {
        promises.push(
          new Promise<void>((resolve) => {
            geocoder.geocode({ address: booking.pickup }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                newWaypoints.push({
                  id: `pickup-${booking.id}`,
                  location: {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                  },
                  address: booking.pickup,
                  type: 'pickup',
                  bookingId: booking.id,
                  passengerName: `${booking.firstName} ${booking.lastName}`,
                  passengerCount: parseInt(booking.passengers || '1'),
                  order: 0
                })
              }
              geocodeCount++
              if (geocodeCount === totalGeocodes) {
                setWaypoints(newWaypoints)
              }
              resolve()
            })
          })
        )
      }

      if (booking.destination) {
        promises.push(
          new Promise<void>((resolve) => {
            geocoder.geocode({ address: booking.destination || '' }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                newWaypoints.push({
                  id: `dropoff-${booking.id}`,
                  location: {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                  },
                  address: booking.destination || '',
                  type: 'dropoff',
                  bookingId: booking.id,
                  passengerName: `${booking.firstName} ${booking.lastName}`,
                  passengerCount: parseInt(booking.passengers || '1'),
                  order: 0
                })
              }
              geocodeCount++
              if (geocodeCount === totalGeocodes) {
                setWaypoints(newWaypoints)
              }
              resolve()
            })
          })
        )
      }

      return promises
    })

    Promise.all(geocodePromises)
  }, [relevantBookings, map])

  const optimizeRoute = async () => {
    if (!map || !directionsRenderer || waypoints.length < 2) return

    setIsOptimizing(true)

    try {
      const pickups = waypoints.filter(w => w.type === 'pickup')
      const dropoffs = waypoints.filter(w => w.type === 'dropoff')

      if (pickups.length === 0) {
        setIsOptimizing(false)
        return
      }

      const origin = pickups[0].location
      const destination = dropoffs[dropoffs.length - 1]?.location || pickups[pickups.length - 1].location

      const intermediateWaypoints = [
        ...pickups.slice(1),
        ...dropoffs.slice(0, -1)
      ].map(wp => ({
        location: new google.maps.LatLng(wp.location.lat, wp.location.lng),
        stopover: true
      }))

      const directionsService = new google.maps.DirectionsService()

      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: intermediateWaypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
      }

      directionsService.route(request, (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result)

          const route = result.routes[0]
          let totalDistance = 0
          let totalDuration = 0

          route.legs.forEach(leg => {
            if (leg.distance) totalDistance += leg.distance.value
            if (leg.duration) totalDuration += leg.duration.value
          })

          const optimizedOrder = result.routes[0].waypoint_order || []
          const reorderedWaypoints: Waypoint[] = []
          
          reorderedWaypoints.push({ ...pickups[0], order: 0 })
          
          optimizedOrder.forEach((index, newIndex) => {
            const waypoint = intermediateWaypoints[index]
            const originalWaypoint = [...pickups.slice(1), ...dropoffs.slice(0, -1)][index]
            reorderedWaypoints.push({ ...originalWaypoint, order: newIndex + 1 })
          })

          if (dropoffs.length > 0) {
            reorderedWaypoints.push({ 
              ...dropoffs[dropoffs.length - 1], 
              order: reorderedWaypoints.length 
            })
          }

          setOptimizedWaypoints(reorderedWaypoints)

          const directDistance = totalDistance / 1.3
          const detourPercentage = ((totalDistance - directDistance) / directDistance) * 100

          setRouteInfo({
            totalDistance: totalDistance / 1000,
            totalDuration: totalDuration / 60,
            detourPercentage: Math.max(0, detourPercentage)
          })

          createMarkers(reorderedWaypoints)

          if (onOptimize) {
            onOptimize(reorderedWaypoints)
          }

          const bounds = new google.maps.LatLngBounds()
          reorderedWaypoints.forEach(wp => {
            bounds.extend(new google.maps.LatLng(wp.location.lat, wp.location.lng))
          })
          map.fitBounds(bounds)
        }
        setIsOptimizing(false)
      })
    } catch (error) {
      console.error('Route optimization error:', error)
      setIsOptimizing(false)
    }
  }

  const createMarkers = (orderedWaypoints: Waypoint[]) => {
    markers.forEach(marker => marker.setMap(null))

    if (!map) return

    const newMarkers = orderedWaypoints.map((waypoint, index) => {
      const isPickup = waypoint.type === 'pickup'
      
      const marker = new google.maps.Marker({
        position: waypoint.location,
        map: map,
        label: {
          text: String(index + 1),
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: isPickup ? '#75E14B' : '#E8965A',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 3,
          scale: 18
        },
        title: `${index + 1}. ${waypoint.address}`
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: sans-serif;">
            <div style="font-weight: bold; margin-bottom: 4px; color: ${isPickup ? '#75E14B' : '#E8965A'}">
              ${isPickup ? '📍 Prise en charge' : '🎯 Dépose'}
            </div>
            <div style="margin-bottom: 4px;">
              <strong>${waypoint.passengerName}</strong>
            </div>
            <div style="font-size: 12px; color: #666;">
              ${waypoint.passengerCount} passager${waypoint.passengerCount > 1 ? 's' : ''}
            </div>
            <div style="font-size: 11px; color: #999; margin-top: 4px;">
              ${waypoint.address}
            </div>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      return marker
    })

    setMarkers(newMarkers)
  }

  useEffect(() => {
    if (waypoints.length >= 2) {
      optimizeRoute()
    }
  }, [waypoints])

  return (
    <div className="space-y-4">
      {showDetails && routeInfo && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Navigation size={20} className="text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{routeInfo.totalDistance.toFixed(1)} km</div>
                  <div className="text-xs text-muted-foreground">Distance totale</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Clock size={20} className="text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(routeInfo.totalDuration)} min</div>
                  <div className="text-xs text-muted-foreground">Durée estimée</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <ArrowRight size={20} className="text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">+{routeInfo.detourPercentage.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Détour</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} weight="fill" />
                Itinéraire Optimisé
              </CardTitle>
              <CardDescription>
                {optimizedWaypoints.length} point{optimizedWaypoints.length > 1 ? 's' : ''} d'arrêt pour {relevantBookings.length} réservation{relevantBookings.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Button 
              onClick={optimizeRoute} 
              disabled={isOptimizing || waypoints.length < 2}
              size="sm"
            >
              {isOptimizing ? 'Optimisation...' : 'Réoptimiser'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef} 
            style={{ height, width: '100%' }} 
            className="rounded-lg border border-border overflow-hidden"
          />
        </CardContent>
      </Card>

      {showDetails && optimizedWaypoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Séquence de Prise en Charge</CardTitle>
            <CardDescription>Ordre optimal des arrêts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizedWaypoints.map((waypoint, index) => (
                <div 
                  key={waypoint.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    waypoint.type === 'pickup' ? 'bg-[#75E14B]' : 'bg-[#E8965A]'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-xs ${
                        waypoint.type === 'pickup' 
                          ? 'bg-green-500/10 border-green-500/30 text-green-700' 
                          : 'bg-orange-500/10 border-orange-500/30 text-orange-700'
                      }`}>
                        {waypoint.type === 'pickup' ? 'Prise en charge' : 'Dépose'}
                      </Badge>
                      <span className="text-sm font-semibold">{waypoint.passengerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User size={12} />
                      <span>{waypoint.passengerCount} passager{waypoint.passengerCount > 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {waypoint.address}
                    </div>
                  </div>
                  {waypoint.type === 'pickup' ? (
                    <MapPin size={20} weight="fill" className="text-green-600 flex-shrink-0" />
                  ) : (
                    <MapPin size={20} weight="fill" className="text-orange-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
