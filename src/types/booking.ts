export interface Booking {
  id: string
  userId: string
  userEmail: string
  tripType: 'oneway' | 'roundtrip' | 'hourly'
  pickup: string
  destination: string
  date: string
  time: string
  returnDate?: string
  returnTime?: string
  passengers: string
  vehicleType: string
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
