import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BookingForm from '@/components/BookingForm'
import ServiceCards from '@/components/ServiceCards'
import Footer from '@/components/Footer'

interface HomeProps {
  onNavigateToLogin: (isAdmin: boolean) => void
  onNavigateToChauffeurPrive?: () => void
  onNavigateToAirportTransfer: () => void
  onNavigateToCorporateEvent?: () => void
}

export default function Home({ onNavigateToLogin, onNavigateToChauffeurPrive, onNavigateToAirportTransfer, onNavigateToCorporateEvent }: HomeProps) {
  return (
    <>
      <Header 
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToChauffeurPrive={onNavigateToChauffeurPrive}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
        onNavigateToCorporateEvent={onNavigateToCorporateEvent}
      />
      <div id="accueil">
        <Hero />
        <BookingForm />
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
