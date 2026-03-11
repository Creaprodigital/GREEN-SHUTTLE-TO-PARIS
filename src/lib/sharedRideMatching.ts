import { Booking } from '@/types/booking'
import { SharedRideSettings } from '@/components/SharedRideManager'

export interface MatchResult {
  bookingId: string
  matchedBookingIds: string[]
  matchScore: number
  sharedRideId: string
  estimatedPricePerPassenger: number
  totalPassengers: number
  reason: string
}

export interface RouteCompatibility {
  isCompatible: boolean
  detourPercentage: number
  pickupDistanceKm: number
  destinationDistanceKm: number
  timeDifferenceMinutes: number
}

const EARTH_RADIUS_KM = 6371

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = degreesToRadians(lat2 - lat1)
  const dLng = degreesToRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

async function getCoordinatesFromAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (typeof google === 'undefined' || !google.maps) {
    return null
  }

  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location
        resolve({
          lat: location.lat(),
          lng: location.lng()
        })
      } else {
        resolve(null)
      }
    })
  })
}

function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

function getTimeDifferenceMinutes(time1: string, time2: string): number {
  const minutes1 = parseTime(time1)
  const minutes2 = parseTime(time2)
  return Math.abs(minutes1 - minutes2)
}

export async function checkRouteCompatibility(
  booking1: Booking,
  booking2: Booking,
  settings: SharedRideSettings
): Promise<RouteCompatibility> {
  const pickup1 = await getCoordinatesFromAddress(booking1.pickup)
  const pickup2 = await getCoordinatesFromAddress(booking2.pickup)
  const dest1 = booking1.destination ? await getCoordinatesFromAddress(booking1.destination) : null
  const dest2 = booking2.destination ? await getCoordinatesFromAddress(booking2.destination) : null

  if (!pickup1 || !pickup2 || !dest1 || !dest2) {
    return {
      isCompatible: false,
      detourPercentage: 100,
      pickupDistanceKm: 0,
      destinationDistanceKm: 0,
      timeDifferenceMinutes: 0
    }
  }

  const pickupDistanceKm = calculateDistance(pickup1.lat, pickup1.lng, pickup2.lat, pickup2.lng)
  const destinationDistanceKm = calculateDistance(dest1.lat, dest1.lng, dest2.lat, dest2.lng)

  if (pickupDistanceKm > settings.searchRadiusKm) {
    return {
      isCompatible: false,
      detourPercentage: 100,
      pickupDistanceKm,
      destinationDistanceKm,
      timeDifferenceMinutes: 0
    }
  }

  const directDistance1 = calculateDistance(pickup1.lat, pickup1.lng, dest1.lat, dest1.lng)
  const sharedRouteDistance = pickupDistanceKm + destinationDistanceKm + directDistance1
  const detourPercentage = ((sharedRouteDistance - directDistance1) / directDistance1) * 100

  const timeDifferenceMinutes = booking1.time && booking2.time 
    ? getTimeDifferenceMinutes(booking1.time, booking2.time)
    : 0

  const isCompatible =
    detourPercentage <= settings.maxDetourPercentage &&
    pickupDistanceKm <= settings.searchRadiusKm &&
    destinationDistanceKm <= settings.searchRadiusKm &&
    timeDifferenceMinutes <= settings.maxWaitTimeMinutes

  return {
    isCompatible,
    detourPercentage,
    pickupDistanceKm,
    destinationDistanceKm,
    timeDifferenceMinutes
  }
}

export function calculateMatchScore(
  compatibility: RouteCompatibility,
  booking1: Booking,
  booking2: Booking,
  settings: SharedRideSettings
): number {
  if (!compatibility.isCompatible) {
    return 0
  }

  let score = 100

  const pickupProximityScore = Math.max(0, 100 - (compatibility.pickupDistanceKm / settings.searchRadiusKm) * 100)
  const destProximityScore = Math.max(0, 100 - (compatibility.destinationDistanceKm / settings.searchRadiusKm) * 100)
  const detourScore = Math.max(0, 100 - (compatibility.detourPercentage / settings.maxDetourPercentage) * 100)
  const timeScore = Math.max(0, 100 - (compatibility.timeDifferenceMinutes / settings.maxWaitTimeMinutes) * 100)

  score = (pickupProximityScore * 0.3) + (destProximityScore * 0.3) + (detourScore * 0.2) + (timeScore * 0.2)

  if (booking1.vehicleType === booking2.vehicleType) {
    score += 10
  }

  if (booking1.date === booking2.date) {
    score += 5
  }

  const totalPassengers = parseInt(booking1.passengers || '1') + parseInt(booking2.passengers || '1')
  if (totalPassengers <= settings.maxPassengersPerRide) {
    score += 5
  }

  return Math.min(100, score)
}

export function calculateSharedPrice(
  originalPrice: number,
  numberOfPassengers: number,
  settings: SharedRideSettings
): number {
  let discount = settings.minDiscountPercentage + 
    ((numberOfPassengers - 1) * settings.discountPerPassenger)
  
  discount = Math.min(discount, settings.maxDiscountPercentage)
  discount = Math.max(discount, settings.minDiscountPercentage)

  const discountedPrice = originalPrice * (1 - discount / 100)
  return Math.max(discountedPrice / numberOfPassengers, 0)
}

export async function findCompatibleRides(
  booking: Booking,
  allBookings: Booking[],
  settings: SharedRideSettings
): Promise<MatchResult[]> {
  if (!settings.enabled || !settings.autoMatchEnabled) {
    return []
  }

  const pendingSharedRides = allBookings.filter(b => 
    b.id !== booking.id &&
    b.serviceType === 'shared' &&
    b.status === 'pending' &&
    !b.sharedRideId &&
    b.date === booking.date &&
    (!settings.requireSameVehicleClass || b.vehicleType === booking.vehicleType)
  )

  const matches: MatchResult[] = []

  for (const candidate of pendingSharedRides) {
    const compatibility = await checkRouteCompatibility(booking, candidate, settings)
    
    if (compatibility.isCompatible) {
      const matchScore = calculateMatchScore(compatibility, booking, candidate, settings)
      
      if (matchScore > 50) {
        const totalPassengers = parseInt(booking.passengers || '1') + parseInt(candidate.passengers || '1')
        
        if (totalPassengers <= settings.maxPassengersPerRide) {
          const sharedRideId = `shared-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          const avgPrice = ((booking.price || 0) + (candidate.price || 0)) / 2
          const pricePerPassenger = calculateSharedPrice(avgPrice, totalPassengers, settings)

          matches.push({
            bookingId: booking.id,
            matchedBookingIds: [candidate.id],
            matchScore,
            sharedRideId,
            estimatedPricePerPassenger: pricePerPassenger,
            totalPassengers,
            reason: `Compatible: ${compatibility.pickupDistanceKm.toFixed(1)}km de différence au départ, ${compatibility.destinationDistanceKm.toFixed(1)}km à l'arrivée, ${compatibility.detourPercentage.toFixed(0)}% de détour`
          })
        }
      }
    }
  }

  matches.sort((a, b) => b.matchScore - a.matchScore)
  return matches
}

export async function autoMatchSharedRides(
  bookings: Booking[],
  settings: SharedRideSettings
): Promise<{ updatedBookings: Booking[], matchesMade: number }> {
  if (!settings.enabled || !settings.autoMatchEnabled) {
    return { updatedBookings: bookings, matchesMade: 0 }
  }

  const updatedBookings = [...bookings]
  let matchesMade = 0

  const pendingSharedRides = updatedBookings.filter(b => 
    b.serviceType === 'shared' &&
    b.status === 'pending' &&
    !b.sharedRideId
  )

  const processed = new Set<string>()

  for (const booking of pendingSharedRides) {
    if (processed.has(booking.id)) continue

    const matches = await findCompatibleRides(booking, updatedBookings, settings)
    
    if (matches.length > 0) {
      const bestMatch = matches[0]
      const sharedRideId = bestMatch.sharedRideId

      const bookingIndex = updatedBookings.findIndex(b => b.id === booking.id)
      if (bookingIndex !== -1) {
        updatedBookings[bookingIndex] = {
          ...updatedBookings[bookingIndex],
          sharedRideId,
          isSharedRide: true,
          sharedPassengers: bestMatch.totalPassengers,
          price: bestMatch.estimatedPricePerPassenger
        }
        processed.add(booking.id)
      }

      for (const matchedId of bestMatch.matchedBookingIds) {
        const matchedIndex = updatedBookings.findIndex(b => b.id === matchedId)
        if (matchedIndex !== -1) {
          updatedBookings[matchedIndex] = {
            ...updatedBookings[matchedIndex],
            sharedRideId,
            isSharedRide: true,
            sharedPassengers: bestMatch.totalPassengers,
            price: bestMatch.estimatedPricePerPassenger
          }
          processed.add(matchedId)
        }
      }

      matchesMade++
    }
  }

  return { updatedBookings, matchesMade }
}

export async function findPotentialMatches(
  booking: Booking,
  allBookings: Booking[],
  settings: SharedRideSettings,
  limit: number = 5
): Promise<Array<{
  booking: Booking
  compatibility: RouteCompatibility
  matchScore: number
  estimatedSavings: number
}>> {
  const matches = await findCompatibleRides(booking, allBookings, settings)
  
  const detailedMatches = []
  
  for (const match of matches.slice(0, limit)) {
    const matchedBooking = allBookings.find(b => b.id === match.matchedBookingIds[0])
    if (matchedBooking) {
      const compatibility = await checkRouteCompatibility(booking, matchedBooking, settings)
      const originalPrice = booking.price || 0
      const estimatedSavings = originalPrice - match.estimatedPricePerPassenger
      
      detailedMatches.push({
        booking: matchedBooking,
        compatibility,
        matchScore: match.matchScore,
        estimatedSavings
      })
    }
  }
  
  return detailedMatches
}
