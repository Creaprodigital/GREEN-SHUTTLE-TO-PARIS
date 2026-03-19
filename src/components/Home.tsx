import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BookingForm from '@/components/BookingForm'
import ServiceCards from '@/components/ServiceCards'
import FleetShowcase from '@/components/FleetShowcase'
import Footer from '@/components/Footer'

interface HomeProps {
  onNavigateToLogin: (isAdmin: boolean) => void
  onNavigateToClient?: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
  onNavigateToService?: (serviceId: string) => void
}

export default function Home({ onNavigateToLogin, onNavigateToClient, onNavigateToServices, onNavigateToAbout, onNavigateToContact, onNavigateToService }: HomeProps) {
  return (
    <>
      <Header 
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToClient={onNavigateToClient}
        onNavigateToHome={() => {}}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToContact={onNavigateToContact}
        onNavigateToService={onNavigateToService}
      />
      <div id="accueil">
        <Hero />
        <BookingForm />
        <div className="h-[150px]" />
      </div>
      <FleetShowcase />
      <div id="services">
        <ServiceCards />
      </div>
      <div id="contact">
        <Footer />
      </div>
    </>
  )
}
