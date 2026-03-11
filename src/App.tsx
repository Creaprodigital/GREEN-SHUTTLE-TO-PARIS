import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import Home from '@/components/Home'
import Login from '@/components/Login'
import ClientDashboard from '@/components/ClientDashboard'
import AdminDashboard from '@/components/AdminDashboard'
import Services from '@/components/Services'
import About from '@/components/About'
import Contact from '@/components/Contact'
import { useKV } from '@github/spark/hooks'
import { Booking } from '@/types/booking'
import { useSharedRideNotifications } from '@/hooks/useSharedRideNotifications'

type View = 'home' | 'login' | 'client' | 'admin' | 'services' | 'about' | 'contact'

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
    setCurrentUser({ email: 'client@example.fr', isAdmin: false })
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
        />
      )}
      {view === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onNavigateToHome={() => setView('home')}
          onNavigateToServices={() => setView('services')}
          onNavigateToAbout={() => setView('about')}
          onNavigateToContact={() => setView('contact')}
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
          userEmail={currentUser?.email}
          isAdmin={currentUser?.isAdmin}
          onLogout={handleLogout}
        />
      )}
      {view === 'about' && (
        <About
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToClient={handleNavigateToClient}
          onNavigateToHome={() => setView('home')}
          onNavigateToServices={() => setView('services')}
          onNavigateToAbout={() => setView('about')}
          onNavigateToContact={() => setView('contact')}
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
        />
      )}
    </div>
  )
}

export default App