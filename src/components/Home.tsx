import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BookingForm from '@/components/BookingForm'
import ServiceCards from '@/components/ServiceCards'
import OurFleet from '@/components/OurFleet'
import Footer from '@/components/Footer'

interface HomeProps {
  onNavigateToLogin: (isAdmin: boolean) => void
  onNavigateToAirportTransfer: () => void
  onNavigateToCorporateEvent?: () => void
}

export default function Home({ onNavigateToLogin, onNavigateToAirportTransfer, onNavigateToCorporateEvent }: HomeProps) {
  return (
    <>
      <Header 
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
        onNavigateToCorporateEvent={onNavigateToCorporateEvent}
      />
      <div id="accueil">
        <Hero />
      </div>
      <BookingForm />
      <div id="services">
        <ServiceCards />
      </div>
      <div id="fleet">
        <OurFleet />
      </div>
      <div id="contact">
        <Footer />
      </div>
    </>
  )
}
