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
            stylers: [{ color: '#1a1a1a' }, { visibility: 'simplified' }]
          },
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.attraction',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }, { color: '#2a2a2a' }]
          },
          {
            featureType: 'poi.attraction',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'poi.attraction',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#b8d970' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }, { color: '#252525' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }, { color: '#333333' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#2a2a2a' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#404040' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#353535' }]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{ color: '#333333' }]
          },
          {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9a9a9a' }]
          },
          {
            featureType: 'transit',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0a0a0a' }]
          },
          {
            featureType: 'water',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6a6a6a' }]
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
