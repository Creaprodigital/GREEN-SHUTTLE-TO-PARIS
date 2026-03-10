import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'

const vehicles = [
  {
    id: 'business',
    title: 'Business Class',
    description: 'Sedan vehicles for professional transport'
  },
  {
    id: 'firstclass',
    title: 'First Class',
    description: 'Premium luxury sedans'
  },
  {
    id: 'suv',
    title: 'Business Van',
    description: 'Premium vans for groups'
  }
]

export default function Features() {
  const [vehicleImages] = useKV<Record<string, string>>('vehicle-images', {
    business: '',
    firstclass: '',
    suv: ''
  })

  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Our Fleet
          </h2>
          <div className="w-24 h-0.5 bg-accent mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Premium vehicles tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => {
            const hasImage = vehicleImages?.[vehicle.id] && vehicleImages[vehicle.id].length > 0
            return (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="aspect-video w-full bg-primary rounded-lg overflow-hidden border-2 border-border mb-4 group-hover:border-accent transition-colors">
                  {hasImage ? (
                    <img
                      src={vehicleImages[vehicle.id]}
                      alt={vehicle.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">No Image</p>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-medium mb-2 uppercase tracking-wide text-center" style={{ fontFamily: 'var(--font-body)' }}>
                  {vehicle.title}
                </h3>
                <p className="text-muted-foreground font-light text-sm text-center">{vehicle.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
