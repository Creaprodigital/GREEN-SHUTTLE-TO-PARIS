import { Shield, Clock, Globe, Star } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'All drivers are professionally vetted, licensed, and insured for your peace of mind'
  },
  {
    icon: Clock,
    title: 'Always On Time',
    description: 'Real-time flight tracking and traffic monitoring ensure punctual arrivals'
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Available in over 300 cities worldwide with consistent quality service'
  },
  {
    icon: Star,
    title: 'Premium Service',
    description: 'Immaculately maintained vehicles and highly-rated professional chauffeurs'
  }
]

export default function Features() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Why Choose LuxeRide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the difference of a truly premium chauffeur service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                  <Icon size={32} className="text-accent" weight="duotone" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
