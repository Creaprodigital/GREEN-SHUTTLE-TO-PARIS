import { motion } from 'framer-motion'
import { Check } from '@phosphor-icons/react'

export default function Hero() {
  return (
    <div className="relative min-h-[600px] sm:min-h-[700px] flex items-center justify-center overflow-hidden bg-primary pt-20">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(135deg, oklch(0.15 0 0) 0%, oklch(0.18 0 0) 50%, oklch(0.15 0 0) 100%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              oklch(0.75 0.14 75 / 0.02) 2px,
              oklch(0.75 0.14 75 / 0.02) 4px
            )
          `
        }}
      />

      <div className="absolute top-0 left-0 right-0 border-t-2 border-accent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Service de chauffeur privé premium
            <br />
            à Paris et en Île-de-France
          </h1>
          <div className="w-16 sm:w-24 h-0.5 bg-accent mx-auto mb-6" />
          <div className="max-w-4xl mx-auto space-y-4 text-base sm:text-lg text-foreground/80 font-light px-4">
            <p>
              Voyagez avec <span className="text-accent font-medium">élégance</span>, <span className="text-accent font-medium">confort</span> et <span className="text-accent font-medium">ponctualité</span> grâce à Véloce Express, votre service de chauffeur privé VTC à Paris et en Île-de-France.
            </p>
            <p>
              Depuis 2010, nous accompagnons particuliers et professionnels pour tous leurs déplacements avec un service de transport fiable, discret et haut de gamme.
            </p>
            <p>
              Nos chauffeurs expérimentés vous garantissent ponctualité, sécurité et confort, afin de transformer chacun de vos trajets en une expérience agréable.
            </p>
            <p>
              Nous proposons des transferts aéroports, gares, déplacements professionnels et mises à disposition de chauffeur, au départ de Paris et dans toute la région.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8 mb-8 text-foreground/90">
            <div className="flex items-center gap-2">
              <Check size={20} className="text-accent" weight="bold" />
              <span className="text-sm sm:text-base">Service disponible 24h/24 – 7j/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={20} className="text-accent" weight="bold" />
              <span className="text-sm sm:text-base">Réservation simple et rapide</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={20} className="text-accent" weight="bold" />
              <span className="text-sm sm:text-base">Prix fixe sans surprise</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
