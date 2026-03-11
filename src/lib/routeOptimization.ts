interface Stop {
  address: string
  lat: number
  lng: number
  type: 'pickup' | 'destination' | 'intermediate'
  order?: number
}

interface OptimizationResult {
  optimizedStops: Stop[]
  totalDistance: number
  totalDuration: number
  savings: {
    distanceKm: number
    durationMinutes: number
    percentageImprovement: number
  }
}

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const getTotalRouteDistance = (stops: Stop[]): number => {
  let total = 0
  for (let i = 0; i < stops.length - 1; i++) {
    total += calculateDistance(stops[i].lat, stops[i].lng, stops[i + 1].lat, stops[i + 1].lng)
  }
  return total
}

const permute = <T,>(arr: T[]): T[][] => {
  if (arr.length <= 1) return [arr]
  const result: T[][] = []
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
    const perms = permute(rest)
    for (const perm of perms) {
      result.push([arr[i], ...perm])
    }
  }
  return result
}

const nearestNeighbor = (stops: Stop[]): Stop[] => {
  if (stops.length === 0) return []
  
  const result: Stop[] = [stops[0]]
  const remaining = [...stops.slice(1)]
  
  while (remaining.length > 0) {
    const current = result[result.length - 1]
    let nearestIndex = 0
    let nearestDistance = Infinity
    
    for (let i = 0; i < remaining.length; i++) {
      const distance = calculateDistance(
        current.lat, current.lng,
        remaining[i].lat, remaining[i].lng
      )
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    }
    
    result.push(remaining[nearestIndex])
    remaining.splice(nearestIndex, 1)
  }
  
  return result
}

const twoOptOptimization = (stops: Stop[]): Stop[] => {
  if (stops.length < 4) return stops
  
  let route = [...stops]
  let improved = true
  
  while (improved) {
    improved = false
    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length - 1; j++) {
        const newRoute = [...route]
        const segment = newRoute.slice(i, j + 1).reverse()
        newRoute.splice(i, j - i + 1, ...segment)
        
        if (getTotalRouteDistance(newRoute) < getTotalRouteDistance(route)) {
          route = newRoute
          improved = true
        }
      }
    }
  }
  
  return route
}

export const optimizeRoute = async (stops: Stop[]): Promise<OptimizationResult> => {
  console.log('🚀 Starting route optimization with', stops.length, 'stops')
  
  if (stops.length <= 2) {
    const distance = stops.length === 2 
      ? calculateDistance(stops[0].lat, stops[0].lng, stops[1].lat, stops[1].lng)
      : 0
    
    return {
      optimizedStops: stops,
      totalDistance: distance,
      totalDuration: distance * 1.5,
      savings: {
        distanceKm: 0,
        durationMinutes: 0,
        percentageImprovement: 0
      }
    }
  }
  
  const pickup = stops.find(s => s.type === 'pickup')
  const destination = stops.find(s => s.type === 'destination')
  const intermediateStops = stops.filter(s => s.type === 'intermediate')
  
  if (!pickup || !destination) {
    throw new Error('Route must have pickup and destination')
  }
  
  let optimizedIntermediates: Stop[]
  
  if (intermediateStops.length <= 8) {
    const permutations = permute(intermediateStops)
    let bestPermutation = intermediateStops
    let bestDistance = Infinity
    
    for (const perm of permutations) {
      const testRoute = [pickup, ...perm, destination]
      const distance = getTotalRouteDistance(testRoute)
      if (distance < bestDistance) {
        bestDistance = distance
        bestPermutation = perm
      }
    }
    
    optimizedIntermediates = bestPermutation
    console.log('✅ Used exhaustive permutation search for', intermediateStops.length, 'stops')
  } else {
    const nnRoute = nearestNeighbor(intermediateStops)
    optimizedIntermediates = twoOptOptimization(nnRoute)
    console.log('✅ Used nearest neighbor + 2-opt for', intermediateStops.length, 'stops')
  }
  
  const optimizedStops = [
    pickup,
    ...optimizedIntermediates.map((stop, idx) => ({ ...stop, order: idx + 1 })),
    destination
  ]
  
  const originalRoute = [pickup, ...intermediateStops, destination]
  const originalDistance = getTotalRouteDistance(originalRoute)
  const optimizedDistance = getTotalRouteDistance(optimizedStops)
  
  const distanceSaved = originalDistance - optimizedDistance
  const percentageImprovement = originalDistance > 0 
    ? (distanceSaved / originalDistance) * 100 
    : 0
  
  console.log('📊 Optimization results:')
  console.log('  Original distance:', originalDistance.toFixed(2), 'km')
  console.log('  Optimized distance:', optimizedDistance.toFixed(2), 'km')
  console.log('  Savings:', distanceSaved.toFixed(2), 'km', `(${percentageImprovement.toFixed(1)}%)`)
  
  return {
    optimizedStops,
    totalDistance: optimizedDistance,
    totalDuration: optimizedDistance * 1.5,
    savings: {
      distanceKm: distanceSaved,
      durationMinutes: distanceSaved * 1.5,
      percentageImprovement
    }
  }
}

export const getRouteWithGoogleMaps = async (stops: Stop[]): Promise<{
  totalDistance: number
  totalDuration: number
  legs: google.maps.DirectionsLeg[]
}> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error('Google Maps not loaded'))
      return
    }

    const directionsService = new google.maps.DirectionsService()
    
    if (stops.length < 2) {
      reject(new Error('Need at least 2 stops'))
      return
    }

    const origin = { lat: stops[0].lat, lng: stops[0].lng }
    const destination = { lat: stops[stops.length - 1].lat, lng: stops[stops.length - 1].lng }
    const waypoints = stops.slice(1, -1).map(stop => ({
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
          const route = result.routes[0]
          let totalDistance = 0
          let totalDuration = 0

          route.legs.forEach(leg => {
            if (leg.distance) totalDistance += leg.distance.value / 1000
            if (leg.duration) totalDuration += leg.duration.value / 60
          })

          resolve({
            totalDistance,
            totalDuration,
            legs: route.legs
          })
        } else {
          reject(new Error(`Directions request failed: ${status}`))
        }
      }
    )
  })
}
