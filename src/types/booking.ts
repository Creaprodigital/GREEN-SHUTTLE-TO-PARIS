export interface Booking {
  id: string
  userId: string
  userEmail: string
  serviceType: 'transfer' | 'hourly' | 'tour' | 'shared'
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
  promoCode?: string
  discount?: number
  originalPrice?: number
  sharedRideId?: string
  isSharedRide?: boolean
  sharedPassengers?: number
  stripePaymentIntentId?: string
  stripeChargeId?: string
  refundStatus?: 'none' | 'partial' | 'full'
  refundAmount?: number
  refundReason?: string
  refundDate?: number
  disputeStatus?: 'none' | 'pending' | 'won' | 'lost'
  disputeReason?: string
  disputeDate?: number
  disputeEvidence?: string
}

export interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
}
