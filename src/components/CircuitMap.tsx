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

  useEffect(() => {
    if (!mapRef.current || !circuit.stops || circuit.stops.length === 0) return

    if (!googleMapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: circuit.stops[0].lat, lng: circuit.stops[0].lng },
        zoom: 12,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#242424' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#242424' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#746855' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
          }
        ]
      })

      googleMapRef.current = map
    }

    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

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
