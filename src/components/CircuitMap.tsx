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
  const polylinesRef = useRef<google.maps.Polyline[]>([])

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
    }

    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    
    polylinesRef.current.forEach(polyline => polyline.setMap(null))
    polylinesRef.current = []

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
      
      if (index < circuit.stops.length - 1) {
        const nextStop = circuit.stops[index + 1]
        const polyline = new google.maps.Polyline({
          path: [
            { lat: stop.lat, lng: stop.lng },
            { lat: nextStop.lat, lng: nextStop.lng }
          ],
          geodesic: true,
          strokeColor: '#b8d970',
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map: googleMapRef.current
        })
        polylinesRef.current.push(polyline)
      }
    })

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
