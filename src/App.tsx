import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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
import LegalMentions from '@/components/LegalMentions'
import Privacy from '@/components/Privacy'
import CGV from '@/components/CGV'
import NotFound from '@/components/NotFound'
import { useKV } from '@github/spark/hooks'
import { Booking } from '@/types/booking'
import { useSharedRideNotifications } from '@/hooks/useSharedRideNotifications'
import { migrateOldDataToNewKeys } from '@/lib/migrate-data'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentUser, setCurrentUser] = useKV<{ email: string; isAdmin: boolean } | null>('current-user', null)
  const [bookings, setBookings] = useKV<Booking[]>('bookings', [])
  const [isAdminMode, setIsAdminMode] = useState(false)

  useSharedRideNotifications({
    bookings: bookings || [],
    userEmail: currentUser?.email,
    enabled: !!currentUser && !currentUser.isAdmin
  })

  useEffect(() => {
    migrateOldDataToNewKeys()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const handleNavigateToLogin = (isAdmin: boolean) => {
    if (isAdmin) {
      setCurrentUser({ email: 'admin@admin.fr', isAdmin: true })
      navigate('/admin')
    } else {
      setIsAdminMode(isAdmin)
      navigate('/login')
    }
  }

  const handleNavigateToClient = () => {
    setCurrentUser({ email: 'creaprodigital@gmail.com', isAdmin: false })
    navigate('/client')
  }

  const handleLogin = (email: string, isAdmin: boolean) => {
    setCurrentUser({ email, isAdmin })
    navigate(isAdmin ? '/admin' : '/client')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    navigate('/')
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
    navigate(`/services/${serviceId}`)
  }

  const commonServiceProps = {
    onNavigateToLogin: handleNavigateToLogin,
    onNavigateToClient: handleNavigateToClient,
    onNavigateToHome: () => navigate('/'),
    onNavigateToServices: () => navigate('/services'),
    onNavigateToAbout: () => navigate('/about'),
    onNavigateToContact: () => navigate('/contact'),
    onNavigateToService: handleNavigateToService,
    userEmail: currentUser?.email,
    isAdmin: currentUser?.isAdmin,
    onLogout: handleLogout,
    onNavigateToLegalMentions: () => navigate('/legal-mentions'),
    onNavigateToPrivacy: () => navigate('/privacy'),
    onNavigateToCGV: () => navigate('/cgv')
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Routes>
        <Route path="/" element={
          <Home 
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToClient={handleNavigateToClient}
            onNavigateToServices={() => navigate('/services')}
            onNavigateToAbout={() => navigate('/about')}
            onNavigateToContact={() => navigate('/contact')}
            onNavigateToService={handleNavigateToService}
            onNavigateToLegalMentions={() => navigate('/legal-mentions')}
            onNavigateToPrivacy={() => navigate('/privacy')}
            onNavigateToCGV={() => navigate('/cgv')}
          />
        } />
        <Route path="/login" element={
          <Login 
            onLogin={handleLogin} 
            onNavigateToHome={() => navigate('/')}
            onNavigateToServices={() => navigate('/services')}
            onNavigateToAbout={() => navigate('/about')}
            onNavigateToContact={() => navigate('/contact')}
            onNavigateToService={handleNavigateToService}
            isAdminMode={isAdminMode} 
          />
        } />
        <Route path="/services" element={
          <Services {...commonServiceProps} />
        } />
        <Route path="/services/cdg" element={<ServiceCDG {...commonServiceProps} />} />
        <Route path="/services/orly" element={<ServiceOrly {...commonServiceProps} />} />
        <Route path="/services/beauvais" element={<ServiceBeauvais {...commonServiceProps} />} />
        <Route path="/services/city-tour" element={<ServiceCityTour {...commonServiceProps} />} />
        <Route path="/services/events" element={<ServiceEvents {...commonServiceProps} />} />
        <Route path="/services/versailles" element={<ServiceVersailles {...commonServiceProps} />} />
        <Route path="/services/wine" element={<ServiceWineTour {...commonServiceProps} />} />
        <Route path="/services/normandy" element={<ServiceNormandy {...commonServiceProps} />} />
        <Route path="/services/mont-saint-michel" element={<ServiceMontStMichel {...commonServiceProps} />} />
        <Route path="/services/long-distance" element={<ServiceLongDistance {...commonServiceProps} />} />
        <Route path="/services/travel-agency" element={<ServiceTravelAgency {...commonServiceProps} />} />
        <Route path="/services/fashion-week" element={<ServiceFashionWeek {...commonServiceProps} />} />
        <Route path="/about" element={<About {...commonServiceProps} />} />
        <Route path="/contact" element={<Contact {...commonServiceProps} />} />
        <Route path="/client" element={
          currentUser ? (
            <ClientDashboard
              userEmail={currentUser.email}
              onLogout={handleLogout}
              onNavigateToHome={() => navigate('/')}
              onNavigateToServices={() => navigate('/services')}
              onNavigateToAbout={() => navigate('/about')}
              onNavigateToContact={() => navigate('/contact')}
              onNavigateToService={handleNavigateToService}
            />
          ) : (
            <Login 
              onLogin={handleLogin} 
              onNavigateToHome={() => navigate('/')}
              onNavigateToServices={() => navigate('/services')}
              onNavigateToAbout={() => navigate('/about')}
              onNavigateToContact={() => navigate('/contact')}
              onNavigateToService={handleNavigateToService}
              isAdminMode={false} 
            />
          )
        } />
        <Route path="/admin" element={
          currentUser?.isAdmin ? (
            <AdminDashboard
              userEmail={currentUser.email}
              onLogout={handleLogout}
              onUpdateBooking={handleUpdateBooking}
              onDeleteBooking={handleDeleteBooking}
              onNavigateToHome={() => navigate('/')}
              onNavigateToServices={() => navigate('/services')}
              onNavigateToAbout={() => navigate('/about')}
              onNavigateToContact={() => navigate('/contact')}
              onNavigateToService={handleNavigateToService}
            />
          ) : (
            <Login 
              onLogin={handleLogin} 
              onNavigateToHome={() => navigate('/')}
              onNavigateToServices={() => navigate('/services')}
              onNavigateToAbout={() => navigate('/about')}
              onNavigateToContact={() => navigate('/contact')}
              onNavigateToService={handleNavigateToService}
              isAdminMode={true} 
            />
          )
        } />
        <Route path="/legal-mentions" element={<LegalMentions {...commonServiceProps} />} />
        <Route path="/privacy" element={<Privacy {...commonServiceProps} />} />
        <Route path="/cgv" element={<CGV {...commonServiceProps} />} />
        <Route path="*" element={
          <NotFound
            onNavigateToHome={() => navigate('/')}
            onNavigateToServices={() => navigate('/services')}
            onNavigateToContact={() => navigate('/contact')}
          />
        } />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App