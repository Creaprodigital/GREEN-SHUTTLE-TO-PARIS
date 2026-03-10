import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <div className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 60px,
              oklch(0.28 0.05 250 / 0.03) 60px,
              oklch(0.28 0.05 250 / 0.03) 120px
            )
          `
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Arrive in Style,
            <br />
            Every Time
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Premium chauffeur service with professional drivers and luxury vehicles. 
            Book your ride in minutes.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
