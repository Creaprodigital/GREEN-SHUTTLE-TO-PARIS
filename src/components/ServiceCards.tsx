import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Car, Jeep, Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const services = [
  {
    id: 'business',
    name: 'Business Class',
    description: 'Professional transportation for everyday business needs',
    icon: Car,
    features: ['Sedan vehicles', 'Professional drivers', 'Real-time tracking', 'Wi-Fi available'],
    popular: false
  },
  {
    id: 'firstclass',
    name: 'First Class',
    description: 'Premium comfort for those who demand excellence',
    icon: Sparkle,
    features: ['Luxury sedans', 'Top-rated drivers', 'Complimentary refreshments', 'Priority support'],
    popular: true
  },
  {
    id: 'suv',
    name: 'Premium SUV',
    description: 'Spacious luxury for groups or extra luggage',
    icon: Jeep,
    features: ['High-end SUVs', 'Extra space', 'Perfect for groups', 'Premium amenities'],
    popular: false
  }
]

export default function ServiceCards() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Choose Your Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From business essentials to first-class luxury, we offer the perfect ride for every occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  {service.popular && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <Icon size={28} className="text-primary group-hover:text-accent transition-colors" weight="duotone" />
                    </div>
                    <CardTitle className="text-2xl">{service.name}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
