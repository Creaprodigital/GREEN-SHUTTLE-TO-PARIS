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
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Excellence in Every Detail
          </h2>
          <div className="w-24 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Uncompromising standards that define our service
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
                className="text-center group"
              >
                <div className="w-16 h-16 border-2 border-accent flex items-center justify-center mb-4 mx-auto group-hover:bg-accent/10 transition-colors">
                  <Icon size={32} className="text-accent" weight="duotone" />
                </div>
                <h3 className="text-xl font-medium mb-2 uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-light text-sm">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
