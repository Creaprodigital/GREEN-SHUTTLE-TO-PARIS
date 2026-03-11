import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import Home from '@/components/Home'
import Login from '@/components/Login'
import ClientDashboard from '@/components/ClientDashboard'
import AdminDashboard from '@/components/AdminDashboard'
import ChauffeurPrive from '@/components/ChauffeurPrive'
import { useKV } from '@github/spark/hooks'
import { Booking } from '@/types/booking'

type View = 'home' | 'login' | 'client' | 'admin' | 'chauffeur-prive'

function App() {
  const [view, setView] = useState<View>('home')
  const [currentUser, setCurrentUser] = useState<{ email: string; isAdmin: boolean } | null>(null)
  const [bookings, setBookings] = useKV<Booking[]>('bookings', [])
  const [isAdminMode, setIsAdminMode] = useState(false)

  const handleNavigateToLogin = (isAdmin: boolean) => {
    if (isAdmin) {
      setCurrentUser({ email: 'admin@admin.fr', isAdmin: true })
      setView('admin')
    } else {
      setIsAdminMode(isAdmin)
      setView('login')
    }
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
          onNavigateToChauffeurPrive={() => setView('chauffeur-prive')}
          onNavigateToAirportTransfer={() => {}}
          onNavigateToCorporateEvent={() => {}}
        />
      )}
      {view === 'login' && <Login onLogin={handleLogin} onNavigateToHome={() => setView('home')} onNavigateToChauffeurPrive={() => setView('chauffeur-prive')} onNavigateToAirportTransfer={() => {}} onNavigateToCorporateEvent={() => {}} isAdminMode={isAdminMode} />}
      {view === 'chauffeur-prive' && <ChauffeurPrive onBackToHome={() => setView('home')} onNavigateToAirportTransfer={() => {}} onNavigateToCorporateEvent={() => {}} onNavigateToEmbassyDelegation={() => {}} />}
      {view === 'client' && currentUser && (
        <ClientDashboard
          userEmail={currentUser.email}
          bookings={bookings || []}
          onLogout={handleLogout}
          onNavigateToHome={() => setView('home')}
          onNavigateToChauffeurPrive={() => setView('chauffeur-prive')}
          onNavigateToAirportTransfer={() => {}}
          onNavigateToCorporateEvent={() => {}}
        />
      )}
      {view === 'admin' && currentUser && (
        <AdminDashboard
          userEmail={currentUser.email}
          bookings={bookings || []}
          onLogout={handleLogout}
          onUpdateBooking={handleUpdateBooking}
          onDeleteBooking={handleDeleteBooking}
          onNavigateToHome={() => setView('home')}
          onNavigateToChauffeurPrive={() => setView('chauffeur-prive')}
          onNavigateToAirportTransfer={() => {}}
          onNavigateToCorporateEvent={() => {}}
        />
      )}
    </div>
  )
}

export default App