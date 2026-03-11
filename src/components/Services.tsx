import Header from './Header'
import Footer from './Footer'

interface ServicesProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToHome?: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
  onLogout?: () => void
  userEmail?: string
  isAdmin?: boolean
}

export default function Services({
  onNavigateToLogin,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  onLogout,
  userEmail,
  isAdmin
}: ServicesProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToHome={onNavigateToHome}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToContact={onNavigateToContact}
        onLogout={onLogout}
        userEmail={userEmail}
        isAdmin={isAdmin}
      />
      
      <main className="pt-32 pb-20">
      </main>

      <Footer />
    </div>
  )
}
