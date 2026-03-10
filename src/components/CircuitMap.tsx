import { useEffect, useRef } from 'react'
import { Circuit } from '@/types/circuit'

interface CircuitMapProps {
  circuit: Circuit
  className?: string
}

export default function CircuitMap({ circuit, className = '' }: CircuitMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const directionsRenderersRef = useRef<google.maps.DirectionsRenderer[]>([])
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null)

  useEffect(() => {
    if (!mapRef.current || !circuit.stops || circuit.stops.length === 0) return

    if (!googleMapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: circuit.stops[0].lat, lng: circuit.stops[0].lng },
        zoom: 12,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        scaleControl: true,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ]
      })

      googleMapRef.current = map
      directionsServiceRef.current = new google.maps.DirectionsService()
    }

    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    
    directionsRenderersRef.current.forEach(renderer => renderer.setMap(null))
    directionsRenderersRef.current = []

    const bounds = new google.maps.LatLngBounds()

    circuit.stops.forEach((stop, index) => {
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
            ${stop.address}<br/>
            ${stop.duration ? `Durée: ${stop.duration} min` : ''}
            ${stop.notes ? `<br/><em>${stop.notes}</em>` : ''}
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(googleMapRef.current, marker)
      })

      markersRef.current.push(marker)
      bounds.extend({ lat: stop.lat, lng: stop.lng })
    })

    if (circuit.stops.length > 1 && directionsServiceRef.current && googleMapRef.current) {
      for (let i = 0; i < circuit.stops.length - 1; i++) {
        const origin = { lat: circuit.stops[i].lat, lng: circuit.stops[i].lng }
        const destination = { lat: circuit.stops[i + 1].lat, lng: circuit.stops[i + 1].lng }

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

    if (circuit.stops.length > 0 && googleMapRef.current) {
      googleMapRef.current.fitBounds(bounds)
    }
  }, [circuit])

  if (!circuit.stops || circuit.stops.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  )
}
