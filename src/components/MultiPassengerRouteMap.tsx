import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Navigation, Clock, ArrowRigh
import { Button } from '@/components/ui/button'
  id: string
  address: string

  passengerCount: nu
  id: string
  location: { lat: number; lng: number }
  address: string
  type: 'pickup' | 'dropoff'
  bookingId: string
  passengerName: string
  passengerCount: number
  order: number
}

  const [optimizedWaypoints, setOptimiz
  bookings: Booking[]
  sharedRideId?: string
  height?: string
  const [isOptimizing, 
  onOptimize?: (optimizedWaypoints: Waypoint[]) => void
 

export default function MultiPassengerRouteMap({ 
  bookings, 
      mapTypeCo
  height = '500px',
  showDetails = true,
  onOptimize
        {
          stylers: [{ visibility: 'off' }]
        {
          stylers: [{ color: '#616161' }]
        {
          stylers: [{ color: '#f5f5f5' }]
        {
          elementType: 'g
        },
          feature
          stylers: [{ color: '#dadada' }]
        {
          elementType: 'geometry',

    })
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,

        strokeOpaci
    })

  }, [])
  useEffect(() 

    const newWaypoints: Wayp
    const totalGeocodes = relev
    const geocodePromises = rel

        {
            geocoder.geocode({ add
                newWaypoints.push({
          
        {
                  address: booking.pi
          stylers: [{ visibility: 'off' }]
          
        {
              geocodeCount++
          stylers: [{ color: '#616161' }]
          
        {
      }
          stylers: [{ color: '#f5f5f5' }]
          
        {
                  id: `dropoff
                    lat: results[0
                  },
        },
         
                  order: 0
              }
          stylers: [{ color: '#dadada' }]
          
        {
        )
          elementType: 'geometry',
    })
    Promi

    })

    const renderer = new google.maps.DirectionsRenderer({
      const dropof
      suppressMarkers: true,
        return

      const destination 
      const intermediateWa
       
    })

      const direct
      const request: google.maps.Di
  }, [])

      }
      directionsService.route(request, (result, statu

          const route = result.routes[0]
          let totalDuration = 0
          route.legs.for
            if (leg.duration) totalDuration += leg.du

          const reorderedWaypoints: Waypoint[] = []
          reorderedWaypoi

            const originalW
          })
          if (dropoffs.length > 0) {
              ...dropoffs[dropoffs.length - 1], 
            })
                newWaypoints.push({

          const detourPercent
          setRouteInfo({
            totalDuration: totalDuration / 60,
          })
          createMarkers(reorderedWaypoints
          if (onOptimize) {
                  bookingId: booking.id,
          const bounds = new google.maps.LatLngBounds()
            bounds.extend(new google.maps.LatLng(wp.location.lat, wp.l
          map.fitBounds(bo
        setIsOptim
    } catch (er
              geocodeCount++
  }
  const createMarkers = (orderedWaypoints:


      const is
      const 
        m
      }

      if (booking.destination) {
          path: google
          fillOpacity: 1,
          strokeWeight: 3,
        },
      })
      const infoWindow = new google.maps.InfoW
          <div style="padding
              ${isPickup ? '📍 Prise en charge' : '🎯 Dépose
            <div style="margin-bottom: 4px;">
                  },
              ${waypoint.passengerCount} passager${wa
            <div style="font-size:
            </div>
        `

                  order: 0

              }
    setMarkers(newMarkers)

    if (waypoints.length >= 2) {
    }

    <div class
        <div
        )
       

                  <di
    })


            <CardContent clas

                </div>
                  <div className="text-2xl font-bold">{Math.round(r

            </CardContent

    try {
                <div className="p-2 rounded-lg bg-accent/20">
                </div>

                </div>
            </CardContent>
        return
      }

            <div>
                <MapPin size={20} weight="fill" />

                {optimizedWaypoints.l
            </div>
              onClick={optimizeR
              size="
              {isOptimizing ? 'Optimisation...' : 'Réoptimiser'}
          </div>
        <

            className="rounded-lg border border-border overflow-hid


        <Card>
            <CardTitle className="text-base">Séquence de Prise en Charge</Card
          </CardHeader>
            <div className="spac
                <div 
       

                  }`}>
                  </div>
                    <div className="flex items-cen

          const route = result.routes[0]
                        {waypoi
          let totalDuration = 0

                      <span>{waypoint
                    <div className="text-xs text-muted-foreground
                    </div>
            

                  )}
          const reorderedWaypoints: Waypoint[] = []
          
      )}
  )




          })

          if (dropoffs.length > 0) {

              ...dropoffs[dropoffs.length - 1], 

            })







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
