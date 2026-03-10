export interface Booking {
  id: string
  userId: string
  userEmail: string
  tripType: 'oneway' | 'roundtrip' | 'hourly'
  pickup: string
  destination: string
  date: string
  time: string
  passengers: string
  serviceType: 'business' | 'firstclass' | 'suv'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: number
  price?: number
}

export interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}
