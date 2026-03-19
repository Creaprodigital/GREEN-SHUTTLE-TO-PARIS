import { motion } from 'framer-motion'
import { Check } from '@phosphor-icons/react'
import BookingForm from '@/components/BookingForm'

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.65)),
            url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=90&w=2400')
          `
        }}
      />

      <div className="absolute top-0 left-0 right-0 border-t-2 border-accent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Service de chauffeur privé premium à Paris et en Île-de-France
            </h1>
            <div className="w-16 sm:w-24 h-0.5 bg-accent mb-6" />
            <div className="space-y-4 text-base sm:text-lg text-white/90 font-light">
              <p>
                Voyagez avec <span className="text-accent font-medium">élégance</span>, <span className="text-accent font-medium">confort</span> et <span className="text-accent font-medium">ponctualité</span> grâce à ELGOH, votre service de chauffeur privé VTC à Paris et en Île-de-France.
              </p>
              <p>
                Depuis 2010, nous accompagnons particuliers et professionnels pour tous leurs déplacements avec un service de transport fiable, discret et haut de gamme.
              </p>
              <p>
                Nos chauffeurs expérimentés vous garantissent ponctualité, sécurité et confort, afin de transformer chacun de vos trajets en une expérience agréable.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-8 text-white/95">
              <div className="flex items-center gap-2">
                <Check size={20} className="text-accent flex-shrink-0" weight="bold" />
                <span className="text-sm sm:text-base">Service disponible 24h/24 – 7j/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={20} className="text-accent flex-shrink-0" weight="bold" />
                <span className="text-sm sm:text-base">Réservation simple et rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={20} className="text-accent flex-shrink-0" weight="bold" />
                <span className="text-sm sm:text-base">Prix fixe sans surprise</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <BookingForm />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
