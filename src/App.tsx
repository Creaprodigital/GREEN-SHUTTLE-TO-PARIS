import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import Home from '@/components/Home'
import Login from '@/components/Login'
import AdminDashboard from '@/components/AdminDashboard'
import ClientDashboard from '@/components/ClientDashboard'
import Services from '@/components/Services'
import About from '@/components/About'
import Contact from '@/components/Contact'
import ServicePage from '@/components/ServicePage'
import LegalMentions from '@/components/LegalMentions'
import Privacy from '@/components/Privacy'
import CGV from '@/components/CGV'
import NotFound from '@/components/NotFound'

type Page = 'home' | 'login' | 'admin' | 'client' | 'services' | 'about' | 'contact' | 'service' | 'legal' | 'privacy' | 'cgv'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentServiceId, setCurrentServiceId] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')

  const handleNavigateToLogin = (admin: boolean) => {
    setIsAdmin(admin)
    setCurrentPage('login')
  }

  const handleNavigateToService = (serviceId: string) => {
    setCurrentServiceId(serviceId)
    setCurrentPage('service')
  }

  const handleLogin = (email: string, admin: boolean) => {
    setUserEmail(email)
    setIsAdmin(admin)
    setCurrentPage(admin ? 'admin' : 'client')
  }

  const handleLogout = () => {
    setCurrentPage('home')
    setIsAdmin(false)
    setUserEmail('')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToClient={() => setCurrentPage('client')}
            onNavigateToServices={() => setCurrentPage('services')}
            onNavigateToAbout={() => setCurrentPage('about')}
            onNavigateToContact={() => setCurrentPage('contact')}
            onNavigateToService={handleNavigateToService}
            onNavigateToLegalMentions={() => setCurrentPage('legal')}
            onNavigateToPrivacy={() => setCurrentPage('privacy')}
            onNavigateToCGV={() => setCurrentPage('cgv')}
          />
        )
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToServices={() => setCurrentPage('services')}
            onNavigateToAbout={() => setCurrentPage('about')}
            onNavigateToContact={() => setCurrentPage('contact')}
            onNavigateToService={handleNavigateToService}
            isAdminMode={isAdmin}
          />
        )
      case 'admin':
        return (
          <AdminDashboard
            userEmail={userEmail}
            onLogout={handleLogout}
            onUpdateBooking={() => {}}
            onDeleteBooking={() => {}}
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToServices={() => setCurrentPage('services')}
            onNavigateToAbout={() => setCurrentPage('about')}
            onNavigateToContact={() => setCurrentPage('contact')}
            onNavigateToService={handleNavigateToService}
          />
        )
      case 'client':
        return (
          <ClientDashboard
            userEmail={userEmail}
            onLogout={handleLogout}
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToServices={() => setCurrentPage('services')}
            onNavigateToAbout={() => setCurrentPage('about')}
            onNavigateToContact={() => setCurrentPage('contact')}
            onNavigateToService={handleNavigateToService}
          />
        )
      case 'services':
        return (
          <Services
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToService={handleNavigateToService}
            onNavigateToAbout={() => setCurrentPage('about')}
            onNavigateToContact={() => setCurrentPage('contact')}
            userEmail={userEmail}
            isAdmin={isAdmin}
            onLogout={userEmail ? handleLogout : undefined}
          />
        )
      case 'about':
        return (
          <About
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToServices={() => setCurrentPage('services')}
            onNavigateToContact={() => setCurrentPage('contact')}
            userEmail={userEmail}
            isAdmin={isAdmin}
            onLogout={userEmail ? handleLogout : undefined}
          />
        )
      case 'contact':
        return (
          <Contact
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToServices={() => setCurrentPage('services')}
            onNavigateToAbout={() => setCurrentPage('about')}
            userEmail={userEmail}
            isAdmin={isAdmin}
            onLogout={userEmail ? handleLogout : undefined}
          />
        )
      case 'service':
        return (
          <ServicePage
            serviceId={currentServiceId}
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToServices={() => setCurrentPage('services')}
            onNavigateToAbout={() => setCurrentPage('about')}
            onNavigateToContact={() => setCurrentPage('contact')}
          />
        )
      case 'legal':
        return (
          <LegalMentions
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToLogin={handleNavigateToLogin}
          />
        )
      case 'privacy':
        return (
          <Privacy
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToLogin={handleNavigateToLogin}
          />
        )
      case 'cgv':
        return (
          <CGV
            onNavigateToHome={() => setCurrentPage('home')}
            onNavigateToLogin={handleNavigateToLogin}
          />
        )
      default:
        return <NotFound onNavigateToHome={() => setCurrentPage('home')} />
    }
  }

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  )
}
