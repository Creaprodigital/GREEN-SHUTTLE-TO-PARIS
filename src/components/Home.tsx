import Hero from '@/components/Hero'
import BookingForm from '@/components/BookingForm'
import ServiceCards from '@/components/ServiceCards'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { User } from '@phosphor-icons/react'

interface HomeProps {
  onNavigateToLogin: () => void
}

export default function Home({ onNavigateToLogin }: HomeProps) {
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={onNavigateToLogin}
          variant="outline"
          className="border-accent text-foreground hover:bg-accent hover:text-accent-foreground bg-primary/90 backdrop-blur"
        >
          <User className="mr-2" size={18} />
          Client / Admin
        </Button>
      </div>
      <Hero />
      <BookingForm />
      <ServiceCards />
      <Features />
      <Footer />
    </>
  )
}
