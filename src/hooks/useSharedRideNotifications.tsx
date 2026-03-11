import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Booking } from '@/types/booking'
import { toast } from 'sonner'
import { Users, UserPlus, Route } from '@phosphor-icons/react'

interface SharedRideNotification {
  id: string
  sharedRideId: string
  timestamp: number
  type: 'passenger_joined' | 'ride_confirmed' | 'route_updated'
  message: string
  passengerName?: string
  totalPassengers?: number
  priceUpdate?: number
}

interface UseSharedRideNotificationsProps {
  bookings: Booking[]
  userEmail?: string
  enabled?: boolean
}

export function useSharedRideNotifications({ 
  bookings, 
  userEmail, 
  enabled = true 
}: UseSharedRideNotificationsProps) {
  const [notifications, setNotifications] = useKV<SharedRideNotification[]>('shared-ride-notifications', [])
  const previousBookingsRef = useRef<Booking[]>([])
  const notifiedRidesRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!enabled || !userEmail) return

    const previousBookings = previousBookingsRef.current
    const currentBookings = bookings.filter(b => 
      b.serviceType === 'shared' && 
      b.userEmail === userEmail &&
      b.status !== 'cancelled'
    )

    currentBookings.forEach(currentBooking => {
      if (!currentBooking.sharedRideId) return

      const previousBooking = previousBookings.find(b => b.id === currentBooking.id)
      
      if (previousBooking) {
        const prevSharedPassengers = previousBooking.sharedPassengers || 0
        const currSharedPassengers = currentBooking.sharedPassengers || 0

        if (currSharedPassengers > prevSharedPassengers) {
          const newPassengersCount = currSharedPassengers - prevSharedPassengers
          const notificationKey = `${currentBooking.sharedRideId}-${currSharedPassengers}`
          
          if (!notifiedRidesRef.current.has(notificationKey)) {
            notifiedRidesRef.current.add(notificationKey)

            const allRideBookings = bookings.filter(b => 
              b.sharedRideId === currentBooking.sharedRideId && 
              b.id !== currentBooking.id
            )
            
            const newPassengerNames = allRideBookings
              .slice(-newPassengersCount)
              .map(b => `${b.firstName} ${b.lastName}`)
              .join(', ')

            const totalPassengersInGroup = allRideBookings.reduce(
              (sum, b) => sum + parseInt(b.passengers || '1'), 
              parseInt(currentBooking.passengers || '1')
            )

            const message = newPassengersCount === 1
              ? `${newPassengerNames} a rejoint votre course partagée !`
              : `${newPassengersCount} nouveaux passagers ont rejoint votre course !`

            const notification: SharedRideNotification = {
              id: `${Date.now()}-${currentBooking.sharedRideId}`,
              sharedRideId: currentBooking.sharedRideId,
              timestamp: Date.now(),
              type: 'passenger_joined',
              message,
              passengerName: newPassengerNames,
              totalPassengers: totalPassengersInGroup,
              priceUpdate: currentBooking.price
            }

            setNotifications((current) => [...(current || []), notification])

            toast.success(
              <div className="flex flex-col gap-2">
                <div className="font-semibold flex items-center gap-2">
                  <UserPlus size={20} weight="fill" />
                  Nouveau passager !
                </div>
                <div className="text-sm">{message}</div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {totalPassengersInGroup} passager{totalPassengersInGroup > 1 ? 's' : ''} au total
                  </span>
                  {currentBooking.price && (
                    <span className="font-semibold text-accent">
                      {currentBooking.price.toFixed(2)}€
                    </span>
                  )}
                </div>
              </div>,
              {
                duration: 8000,
                className: 'bg-green-500/10 border-green-500/30'
              }
            )
          }
        }

        const prevPrice = previousBooking.price || 0
        const currPrice = currentBooking.price || 0
        if (currPrice < prevPrice && currSharedPassengers > 1) {
          const savings = prevPrice - currPrice
          toast.info(
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Prix mis à jour</div>
              <div className="text-sm">
                Vous économisez {savings.toFixed(2)}€ grâce au partage de course !
              </div>
              <div className="text-xs text-muted-foreground">
                Nouveau prix : {currPrice.toFixed(2)}€
              </div>
            </div>,
            {
              duration: 6000,
              className: 'bg-blue-500/10 border-blue-500/30'
            }
          )
        }
      } else {
        if (currentBooking.sharedPassengers && currentBooking.sharedPassengers > 1) {
          const allRideBookings = bookings.filter(b => 
            b.sharedRideId === currentBooking.sharedRideId
          )
          
          const totalPassengersInGroup = allRideBookings.reduce(
            (sum, b) => sum + parseInt(b.passengers || '1'), 
            0
          )

          toast.info(
            <div className="flex flex-col gap-2">
              <div className="font-semibold flex items-center gap-2">
                <Route size={20} weight="fill" />
                Course partagée confirmée
              </div>
              <div className="text-sm">
                Vous partagez votre course avec {currentBooking.sharedPassengers - 1} autre{currentBooking.sharedPassengers > 2 ? 's' : ''} passager{currentBooking.sharedPassengers > 2 ? 's' : ''}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {totalPassengersInGroup} passager{totalPassengersInGroup > 1 ? 's' : ''} au total
                </span>
                {currentBooking.price && (
                  <span className="font-semibold text-accent">
                    {currentBooking.price.toFixed(2)}€
                  </span>
                )}
              </div>
            </div>,
            {
              duration: 8000,
              className: 'bg-accent/10 border-accent/30'
            }
          )
        }
      }
    })

    previousBookingsRef.current = bookings
  }, [bookings, userEmail, enabled, setNotifications])

  const clearNotifications = () => {
    setNotifications([])
    notifiedRidesRef.current.clear()
  }

  const getNotificationsForRide = (sharedRideId: string) => {
    return (notifications || []).filter(n => n.sharedRideId === sharedRideId)
  }

  return {
    notifications: notifications || [],
    clearNotifications,
    getNotificationsForRide
  }
}
