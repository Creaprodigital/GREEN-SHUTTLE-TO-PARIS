export interface UserProfile {
  email: string
  firstName: string
  lastName: string
  phone: string
  billingAddress?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  createdAt: number
  updatedAt: number
}
