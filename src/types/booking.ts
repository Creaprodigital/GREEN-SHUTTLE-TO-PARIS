export interface Booking {
  id: string
  userId: string
  userEmail: string
  serviceType: 'transfer' | 'hourly' | 'tour'
  transferType?: 'oneway' | 'roundtrip'
  hourlyDuration?: string
  circuitId?: string
  pickup: string
  destination?: string
  date: string
  time?: string
  returnDate?: string
  returnTime?: string
  passengers: string
  luggage?: string
  vehicleType: string
  selectedOptions?: string[]
  firstName: string
  lastName: string
  phone: string
  email: string
  notes?: string
  paymentMethod: 'card' | 'cash' | 'transfer'
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
