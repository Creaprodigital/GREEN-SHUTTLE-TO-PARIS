import { Button } from '@/components/ui/button'
import { CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'

interface EmbassyDelegationProps {
  onBackToHome?: () => void
  onNavigateToAirportTransfer?: () => void
  onNavigateToCorporateEvent?: () => void
  onNavigateToEmbassyDelegation?: () => void
}

export default function EmbassyDelegation({ onBackToHome, onNavigateToAirportTransfer, onNavigateToCorporateEvent, onNavigateToEmbassyDelegation }: EmbassyDelegationProps) {
  const benefits = [
    "Protocole diplomatique respecté à la lettre",
    "Chauffeurs habilités et formés aux standards diplomatiques",
    "Véhicules de prestige avec sécurité renforcée",
    "Confidentialité et discrétion absolues",
    "Service multilingue pour délégations internationales",
    "Coordination avec les services de sécurité et protocole"
  ]

  return (
    <>
      <Header 
        onNavigateToHome={onBackToHome}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
        onNavigateToCorporateEvent={onNavigateToCorporateEvent}
        onNavigateToEmbassyDelegation={onNavigateToEmbassyDelegation}
      />
      <div className="min-h-screen bg-background">
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?q=80&w=2074')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Ambassades &
              <br />
              Délégations
            </h1>
            <Button 
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 font-semibold uppercase tracking-wider"
            >
              Réserver maintenant
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Service de transport <span className="text-accent">diplomatique et protocole</span>, disponible 
              24 heures sur 24, 7 jours sur 7, pour accompagner vos délégations officielles.
            </h2>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p>
                Green Shuttle To Paris vous propose un service de transport premium spécialement conçu pour les ambassades, 
                consulats et délégations officielles. Nous comprenons les exigences uniques du monde diplomatique et nous 
                nous engageons à offrir un service irréprochable qui respecte le protocole international et garantit la 
                sécurité de vos délégations.
              </p>
              
              <p>
                Nos chauffeurs sont spécialement formés au protocole diplomatique et possèdent une parfaite connaissance 
                des usages en vigueur. Multilingues, discrets et professionnels, ils assurent un service de qualité supérieure 
                adapté aux plus hautes exigences. Chaque membre de notre équipe est soumis à une procédure de vérification 
                rigoureuse et est habilité à travailler avec les institutions diplomatiques.
              </p>
              
              <p>
                Notre flotte de véhicules haut de gamme comprend des berlines de prestige et des SUV blindés pour répondre 
                à tous vos besoins de sécurité. Équipés des dernières technologies de communication sécurisée et de confort, 
                nos véhicules offrent un environnement adapté aux déplacements officiels. Nous proposons également une 
                coordination complète avec vos services de sécurité pour garantir des transferts sans faille.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16"
          >
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074" 
                alt="Diplomatic service"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                Protocole diplomatique
              </h2>
              
              <p className="text-foreground/80 leading-relaxed mb-6">
                Le respect du protocole diplomatique est au cœur de notre service. Nous offrons une prestation 
                sur mesure adaptée aux standards internationaux :
              </p>

              <div className="flex justify-start mb-8">
                <Button 
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 font-semibold uppercase tracking-wider"
                >
                  En savoir plus
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-4"
            >
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border p-6 rounded-lg flex items-start gap-3"
                >
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} weight="fill" />
                  <p className="text-foreground/90 text-sm leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                Vous représentez{' '}
                <span className="text-accent">une ambassade</span>
                <br />
                ou une délégation officielle ?
              </h2>
              
              <p className="text-foreground/80 leading-relaxed mb-8">
                Veuillez nous contacter au
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button 
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 font-semibold uppercase tracking-wider"
                >
                  Demander un devis
                </Button>
                <a 
                  href="tel:+33184112034" 
                  className="text-foreground text-xl font-semibold hover:text-accent transition-colors"
                >
                  +33 1 84 11 20 34
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" 
                  alt="Official buildings"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076" 
                  alt="Professional chauffeur"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                Confidentialité
              </h2>
              
              <p className="text-foreground/80 leading-relaxed">
                La confidentialité est notre priorité absolue. Tous nos chauffeurs sont tenus à une obligation de 
                discrétion totale et sont formés pour garantir la sécurité des échanges diplomatiques. Nos véhicules 
                sont équipés de systèmes de sécurité avancés et nos protocoles internes respectent les plus hauts 
                standards de confidentialité internationale.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                Excellence
                <br />
                & prestige
              </h2>
              
              <p className="text-foreground/80 leading-relaxed">
                Notre engagement envers l'excellence se reflète dans chaque aspect de notre service. Des véhicules 
                de prestige impeccablement entretenus aux chauffeurs formés aux plus hautes exigences du protocole 
                diplomatique, nous garantissons un service à la hauteur de vos attentes. Notre expérience auprès des 
                institutions diplomatiques nous permet de comprendre et d'anticiper vos besoins spécifiques.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070" 
                  alt="Luxury diplomatic fleet"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
