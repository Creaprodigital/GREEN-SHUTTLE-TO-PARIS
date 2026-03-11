import Header from './Header'
import Footer from './Footer'

interface ContactProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToClient?: () => void
  onNavigateToHome?: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
  onLogout?: () => void
  userEmail?: string
  isAdmin?: boolean
}

export default function Contact({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  onLogout,
  userEmail,
  isAdmin
}: ContactProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToClient={onNavigateToClient}
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
