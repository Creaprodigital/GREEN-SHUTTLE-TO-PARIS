import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import Home from '@/components/Home'
import Login from '@/components/Login'
import ClientDashboard from '@/components/ClientDashboard'
import AdminDashboard from '@/components/AdminDashboard'
import { useKV } from '@github/spark/hooks'
import { Booking } from '@/types/booking'

type View = 'home' | 'login' | 'client' | 'admin'

function App() {
  const [view, setView] = useState<View>('home')
  const [currentUser, setCurrentUser] = useState<{ email: string; isAdmin: boolean } | null>(null)
  const [bookings, setBookings] = useKV<Booking[]>('bookings', [])

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
      {view === 'home' && <Home onNavigateToLogin={() => setView('login')} />}
      {view === 'login' && <Login onLogin={handleLogin} />}
      {view === 'client' && currentUser && (
        <ClientDashboard
          userEmail={currentUser.email}
          bookings={bookings || []}
          onLogout={handleLogout}
        />
      )}
      {view === 'admin' && currentUser && (
        <AdminDashboard
          userEmail={currentUser.email}
          bookings={bookings || []}
          onLogout={handleLogout}
          onUpdateBooking={handleUpdateBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      )}
    </div>
  )
}

export default App