export interface CircuitStop {
  id: string
  address: string
  lat: number
  lng: number
  order: number
  duration?: number
  notes?: string
}

export interface Circuit {
  id: string
  name: string
  description: string
  stops: CircuitStop[]
  totalDistance?: number
  totalDuration?: number
  createdAt: string
  updatedAt: string
}
