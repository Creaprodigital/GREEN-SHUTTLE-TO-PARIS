import { useKV } from '@github/spark/hooks'
import { VehicleClass, VehicleClassType, DEFAULT_FLEET } from '@/types/fleet'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { motion } from 'framer-motion'
import { Car } from '@phosphor-icons/react'

export default function OurFleet() {
  const [fleetData] = useKV<Record<VehicleClassType, VehicleClass>>('fleet-data', DEFAULT_FLEET)

  const vehicles = Object.values(fleetData || DEFAULT_FLEET).sort((a, b) => a.order - b.order)

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-5xl md:text-6xl font-bold text-foreground mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Notre Flotte
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Découvrez notre sélection de véhicules premium pour tous vos besoins
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {vehicles.map((vehicle, index) => (
              <CarouselItem key={vehicle.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="border-2 border-accent/20 overflow-hidden hover:border-accent/40 transition-all duration-300 h-full">
                    <div className="aspect-[4/3] bg-muted/50 relative overflow-hidden">
                      {vehicle.image ? (
                        <img
                          src={vehicle.image}
                          alt={vehicle.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car size={80} className="text-muted-foreground/30" weight="thin" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 
                        className="text-2xl font-bold text-foreground mb-3 uppercase tracking-wide"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {vehicle.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">
                        {vehicle.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex -left-12" />
          <CarouselNext className="hidden lg:flex -right-12" />
        </Carousel>
      </div>
    </section>
  )
}
