import { useState, useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import Home from '@/components/Home'
import Login from '@/components/Login'
import ClientDashboard from '@/components/ClientDashboard'
import AdminDashboard from '@/components/AdminDashboard'
import Services from '@/components/Services'
import About from '@/components/About'
import Contact from '@/components/Contact'
import ServiceCDG from '@/components/ServiceCDG'
import ServiceOrly from '@/components/ServiceOrly'
import ServiceBeauvais from '@/components/ServiceBeauvais'
import ServiceCityTour from '@/components/ServiceCityTour'
import ServiceVersailles from '@/components/ServiceVersailles'
import ServiceWineTour from '@/components/ServiceWineTour'
import ServiceNormandy from '@/components/ServiceNormandy'
import ServiceMontStMichel from '@/components/ServiceMontStMichel'
import ServiceLongDistance from '@/components/ServiceLongDistance'
import ServiceTravelAgency from '@/components/ServiceTravelAgency'
import ServiceFashionWeek from '@/components/ServiceFashionWeek'
import ServiceEvents from '@/components/ServiceEvents'
import { useKV } from '@github/spark/hooks'
import { Booking } from '@/types/booking'
import { useSharedRideNotifications } from '@/hooks/useSharedRideNotifications'

type View = 
  | 'home' 
  | 'login' 
  | 'client' 
  | 'admin' 
  | 'services' 
  | 'about' 
  | 'contact'
  | 'service-cdg'
  | 'service-orly'
  | 'service-beauvais'
  | 'service-city-tour'
  | 'service-events'
  | 'service-versailles'
  | 'service-wine'
  | 'service-normandy'
  | 'service-mont-saint-michel'
  | 'service-long-distance'
  | 'service-travel-agency'
  | 'service-fashion-week'

function App() {
  const [view, setView] = useState<View>('home')
  const [currentUser, setCurrentUser] = useState<{ email: string; isAdmin: boolean } | null>(null)
  const [bookings, setBookings] = useKV<Booking[]>('bookings', [])
  const [isAdminMode, setIsAdminMode] = useState(false)

  useSharedRideNotifications({
    bookings: bookings || [],
    userEmail: currentUser?.email,
    enabled: !!currentUser && !currentUser.isAdmin
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  const handleNavigateToLogin = (isAdmin: boolean) => {
    if (isAdmin) {
      setCurrentUser({ email: 'admin@admin.fr', isAdmin: true })
      setView('admin')
    } else {
      setIsAdminMode(isAdmin)
      setView('login')
    }
  }

  const handleNavigateToClient = () => {
    setCurrentUser({ email: 'creaprodigital@gmail.com', isAdmin: false })
    setView('client')
  }

  const handleLogin = (email: string, isAdmin: boolean) => {
    setCurrentUser({ email, isAdmin })
    setView(isAdmin ? 'admin' : 'client')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setView('home')
  }

  const handleUpdateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((current) =>
      (current || []).map((booking) =>
        booking.id === id ? { ...booking, ...updates } : booking
      )
    )
  }

  const handleDeleteBooking = (id: string) => {
    setBookings((current) => (current || []).filter((booking) => booking.id !== id))
  }

  const handleNavigateToService = (serviceId: string) => {
    setView(`service-${serviceId}` as View)
  }

  const commonServiceProps = {
    onNavigateToLogin: handleNavigateToLogin,
    onNavigateToClient: handleNavigateToClient,
    onNavigateToHome: () => setView('home'),
    onNavigateToServices: () => setView('services'),
    onNavigateToAbout: () => setView('about'),
    onNavigateToContact: () => setView('contact'),
    onNavigateToService: handleNavigateToService,
    userEmail: currentUser?.email,
    isAdmin: currentUser?.isAdmin,
    onLogout: handleLogout
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {view === 'home' && (
        <Home 
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToClient={handleNavigateToClient}
          onNavigateToServices={() => setView('services')}
          onNavigateToAbout={() => setView('about')}
          onNavigateToContact={() => setView('contact')}
          onNavigateToService={handleNavigateToService}
        />
      )}
      {view === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onNavigateToHome={() => setView('home')}
          onNavigateToServices={() => setView('services')}
          onNavigateToAbout={() => setView('about')}
          onNavigateToContact={() => setView('contact')}
          onNavigateToService={handleNavigateToService}
          isAdminMode={isAdminMode} 
        />
      )}
      {view === 'services' && (
        <Services
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToClient={handleNavigateToClient}
          onNavigateToHome={() => setView('home')}
          onNavigateToServices={() => setView('services')}
          onNavigateToAbout={() => setView('about')}
          onNavigateToContact={() => setView('contact')}
          onNavigateToService={handleNavigateToService}
          userEmail={currentUser?.email}
          isAdmin={currentUser?.isAdmin}
          onLogout={handleLogout}
        />
      )}
      {view === 'service-cdg' && <ServiceCDG {...commonServiceProps} />}
      {view === 'service-orly' && <ServiceOrly {...commonServiceProps} />}
      {view === 'service-beauvais' && <ServiceBeauvais {...commonServiceProps} />}
      {view === 'service-city-tour' && <ServiceCityTour {...commonServiceProps} />}
      {view === 'service-events' && <ServiceEvents {...commonServiceProps} />}
      {view === 'service-versailles' && <ServiceVersailles {...commonServiceProps} />}
      {view === 'service-wine' && <ServiceWineTour {...commonServiceProps} />}
      {view === 'service-normandy' && <ServiceNormandy {...commonServiceProps} />}
      {view === 'service-mont-saint-michel' && <ServiceMontStMichel {...commonServiceProps} />}
      {view === 'service-long-distance' && <ServiceLongDistance {...commonServiceProps} />}
      {view === 'service-travel-agency' && <ServiceTravelAgency {...commonServiceProps} />}
      {view === 'service-fashion-week' && <ServiceFashionWeek {...commonServiceProps} />}
      {view === 'about' && (
        <About
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToClient={handleNavigateToClient}
          onNavigateToHome={() => setView('home')}
          onNavigateToServices={() => setView('services')}
          onNavigateToAbout={() => setView('about')}
          onNavigateToContact={() => setView('contact')}
          onNavigateToService={handleNavigateToService}
          userEmail={currentUser?.email}
          isAdmin={currentUser?.isAdmin}
          onLogout={handleLogout}
        />
      )}
      {view === 'contact' && (
        <Contact
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToClient={handleNavigateToClient}
          onNavigateToHome={() => setView('home')}
          onNavigateToServices={() => setView('services')}
          onNavigateToAbout={() => setView('about')}
          onNavigateToContact={() => setView('contact')}
          onNavigateToService={handleNavigateToService}
          userEmail={currentUser?.email}
          isAdmin={currentUser?.isAdmin}
          onLogout={handleLogout}
        />
      )}
      {view === 'client' && currentUser && (
        <ClientDashboard
          userEmail={currentUser.email}
          onLogout={handleLogout}
          onNavigateToHome={() => setView('home')}
          onNavigateToServices={() => setView('services')}
          onNavigateToAbout={() => setView('about')}
          onNavigateToContact={() => setView('contact')}
          onNavigateToService={handleNavigateToService}
        />
      )}
      {view === 'admin' && currentUser && (
        <AdminDashboard
          userEmail={currentUser.email}
          onLogout={handleLogout}
          onUpdateBooking={handleUpdateBooking}
          onDeleteBooking={handleDeleteBooking}
          onNavigateToHome={() => setView('home')}
          onNavigateToServices={() => setView('services')}
          onNavigateToAbout={() => setView('about')}
          onNavigateToContact={() => setView('contact')}
          onNavigateToService={handleNavigateToService}
        />
      )}
    </div>
  )
}

export default App