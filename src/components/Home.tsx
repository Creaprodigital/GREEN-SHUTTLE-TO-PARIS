import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BookingForm from '@/components/BookingForm'
import ServiceCards from '@/components/ServiceCards'
import Footer from '@/components/Footer'

interface HomeProps {
  onNavigateToLogin: (isAdmin: boolean) => void
  onNavigateToClient?: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
}

export default function Home({ onNavigateToLogin, onNavigateToClient, onNavigateToServices, onNavigateToAbout, onNavigateToContact }: HomeProps) {
  return (
    <>
      <Header 
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToClient={onNavigateToClient}
        onNavigateToHome={() => {}}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToContact={onNavigateToContact}
      />
      <div id="accueil">
        <Hero />
        <BookingForm />
        <div className="h-[150px]" />
      </div>
      <div id="services">
        <ServiceCards />
      </div>
      <div id="contact">
        <Footer />
      </div>
    </>
  )
}
