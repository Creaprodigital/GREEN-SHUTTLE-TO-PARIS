import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden bg-primary pt-20">
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
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Green Shuttle
            <br />
            To Paris
          </h1>
          <div className="w-16 sm:w-24 h-0.5 bg-accent mx-auto mb-4 sm:mb-6" />
          <p className="text-base sm:text-lg lg:text-xl text-foreground/80 max-w-2xl mx-auto mb-6 sm:mb-8 font-light px-4">
            Experience luxury transportation with professional chauffeurs and 
            premium vehicles to Paris and beyond.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
