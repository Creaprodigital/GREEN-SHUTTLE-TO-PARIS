import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, UserPlus, Route, X } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ScrollArea } from '@/components/ui/scroll-area'

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

interface NotificationCenterProps {
  userEmail: string
}

export default function NotificationCenter({ userEmail }: NotificationCenterProps) {
  const [notifications, setNotifications] = useKV<SharedRideNotification[]>('shared-ride-notifications', [])

  const userNotifications = (notifications || [])
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20)

  const clearNotification = (id: string) => {
    setNotifications((current) => 
      (current || []).filter(n => n.id !== id)
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getIcon = (type: SharedRideNotification['type']) => {
    switch (type) {
      case 'passenger_joined':
        return <UserPlus size={20} weight="fill" className="text-green-500" />
      case 'ride_confirmed':
        return <Route size={20} weight="fill" className="text-blue-500" />
      case 'route_updated':
        return <Route size={20} weight="fill" className="text-accent" />
      default:
        return <Bell size={20} weight="fill" className="text-foreground" />
    }
  }

  const getTypeLabel = (type: SharedRideNotification['type']) => {
    switch (type) {
      case 'passenger_joined':
        return 'Nouveau passager'
      case 'ride_confirmed':
        return 'Course confirmée'
      case 'route_updated':
        return 'Itinéraire mis à jour'
      default:
        return 'Notification'
    }
  }

  if (!userNotifications.length) {
    return (
      <Card className="border-2 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={24} weight="fill" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Bell size={48} weight="thin" className="mx-auto mb-3 opacity-30 text-muted-foreground" />
          <p className="text-muted-foreground">Aucune notification</p>
          <p className="text-sm text-muted-foreground mt-1">
            Vous serez notifié lorsque d'autres passagers rejoindront vos courses partagées
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-accent/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bell size={24} weight="fill" />
          Notifications
          <Badge variant="outline" className="ml-2">
            {userNotifications.length}
          </Badge>
        </CardTitle>
        {userNotifications.length > 0 && (
          <Button 
            onClick={clearAllNotifications}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Tout effacer
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4 pt-0">
            {userNotifications.map((notification) => (
              <Card 
                key={notification.id}
                className="border border-border/50 hover:border-accent/30 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(notification.type)}
                        </Badge>
                        <Button
                          onClick={() => clearNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                      <p className="text-sm text-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {formatDistance(notification.timestamp, new Date(), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </span>
                        {notification.totalPassengers && (
                          <>
                            <span>•</span>
                            <span>
                              {notification.totalPassengers} passager{notification.totalPassengers > 1 ? 's' : ''} total
                            </span>
                          </>
                        )}
                        {notification.priceUpdate && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-accent">
                              {notification.priceUpdate.toFixed(2)}€
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
