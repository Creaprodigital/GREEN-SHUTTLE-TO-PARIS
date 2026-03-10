import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BookingForm from '@/components/BookingForm'
import ServiceCards from '@/components/ServiceCards'
import Footer from '@/components/Footer'

interface HomeProps {
  onNavigateToLogin: (isAdmin: boolean) => void
  onNavigateToAirportTransfer: () => void
}

export default function Home({ onNavigateToLogin, onNavigateToAirportTransfer }: HomeProps) {
  return (
    <>
      <Header 
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
      />
      <div id="accueil">
        <Hero />
      </div>
      <BookingForm />
      <div id="services">
        <ServiceCards />
      </div>
      <div id="contact">
        <Footer />
      </div>
    </>
  )
}
