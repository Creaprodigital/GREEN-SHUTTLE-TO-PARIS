import { motion } from 'framer-motion'
import { Car, Users, ShieldCheck, Sparkle } from '@phosphor-icons/react'

export default function FleetShowcase() {
  const vehicles = [
    {
      name: 'Berline Premium',
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&q=80&w=800',
      capacity: '1-3 passagers',
      description: 'Véhicules haut de gamme pour vos déplacements en toute élégance'
    },
    {
      name: 'SUV Luxe',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800',
      capacity: '1-4 passagers',
      description: 'Espace et confort pour vos trajets en famille ou entre amis'
    },
    {
      name: 'Van Premium',
      image: 'https://images.unsplash.com/photo-1527027746999-4243c27bcbb0?auto=format&fit=crop&q=80&w=800',
      capacity: '4-7 passagers',
      description: 'Idéal pour les groupes et les trajets avec bagages'
    }
  ]

  const features = [
    {
      icon: Car,
      title: 'Flotte récente',
      description: 'Véhicules de moins de 3 ans, régulièrement entretenus'
    },
    {
      icon: ShieldCheck,
      title: 'Sécurité garantie',
      description: 'Chauffeurs professionnels avec licence VTC'
    },
    {
      icon: Users,
      title: 'Service personnalisé',
      description: 'Adaptable à tous vos besoins de transport'
    },
    {
      icon: Sparkle,
      title: 'Confort premium',
      description: 'Climatisation, Wi-Fi et boissons à bord'
    }
  ]

  return (
    <div className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Notre Flotte de Véhicules
          </h2>
          <div className="w-16 sm:w-24 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
            Des véhicules haut de gamme parfaitement entretenus pour vous garantir confort, sécurité et élégance lors de tous vos déplacements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card border border-border overflow-hidden hover:border-accent/50 transition-all duration-300 group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                    {vehicle.name}
                  </h3>
                  <p className="text-accent text-sm font-medium">{vehicle.capacity}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-foreground/70 leading-relaxed">{vehicle.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-accent mx-auto mb-4 flex items-center justify-center">
                  <Icon size={32} className="text-accent-foreground" weight="bold" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {feature.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
