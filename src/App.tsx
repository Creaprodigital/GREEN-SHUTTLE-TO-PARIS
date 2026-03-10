import { Toaster } from '@/components/ui/sonner'
import Hero from '@/components/Hero'
import BookingForm from '@/components/BookingForm'
import ServiceCards from '@/components/ServiceCards'
import Features from '@/components/Features'
import Footer from '@/components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Hero />
      <BookingForm />
      <ServiceCards />
      <Features />
      <Footer />
    </div>
  )
}

export default App