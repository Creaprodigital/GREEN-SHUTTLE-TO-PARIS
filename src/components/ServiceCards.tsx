import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Car, Crown, Van } from '@phosphor-icons/react'

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
    icon: Crown,
    features: ['Luxury sedans', 'Top-rated drivers', 'Complimentary refreshments', 'Priority support'],
    popular: true
  },
  {
    id: 'businessvan',
    name: 'Business Van',
    description: 'Spacious luxury for groups or extra luggage',
    icon: Van,
    features: ['Premium vans', 'Extra space', 'Perfect for groups', 'Premium amenities'],
    popular: false
  }
]

export default function ServiceCards() {
  const [vehicleImages] = useKV<Record<string, string>>('vehicle-images', {
    business: '',
    firstclass: '',
    suv: ''
  })

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Our Fleet
          </h2>
          <div className="w-24 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Select from our premium collection of luxury vehicles tailored to your requirements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const imageUrl = service.id === 'businessvan' 
              ? (vehicleImages?.suv || '')
              : (vehicleImages?.[service.id] || '')
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group border-2 border-border bg-card">
                  {service.popular && (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-6 py-2 z-10">
                      <span className="text-xs uppercase tracking-widest font-medium">Premium Choice</span>
                    </div>
                  )}
                  <div className="relative w-full h-64 overflow-hidden bg-primary flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <service.icon size={120} weight="thin" className="text-accent opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-2xl uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-base font-light">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <div className="w-1 h-1 bg-accent mt-2 flex-shrink-0" />
                          <span className="font-light">{feature}</span>
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
