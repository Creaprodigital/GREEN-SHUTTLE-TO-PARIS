import { Button } from '@/components/ui/button'
import { CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'

interface AirportTransferProps {
  onBackToHome?: () => void
  onNavigateToAirportTransfer?: () => void
  onNavigateToCorporateEvent?: () => void
  onNavigateToEmbassyDelegation?: () => void
}

export default function AirportTransfer({ onBackToHome, onNavigateToAirportTransfer, onNavigateToCorporateEvent, onNavigateToEmbassyDelegation }: AirportTransferProps) {
  const benefits = [
    "Votre accueil dès votre arrivée à l'aéroport",
    "Votre relève à n'importe quel bagage",
    "Votre arrivée jusqu'à votre second vol",
    "Organiser un transport VIP jusqu'à votre hôtel ou chez vous, un chauffeur privé",
    "Votre aide dans les procédures douanières et les contrôles de sécurité obligatoires",
    "Récupérer vos bagages à l'arrivée et les ré-enregistrer pour votre vol de correspondance"
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
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Transfert Aéroports/
              <br />
              Gares avec chauffeur privé
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
              Service de transfert <span className="text-accent">aéroports & gares avec chauffeur privé</span>, service proposé 
              24 heures sur 24, 7 jours sur 7, pour vous accompagner de ou vers les aéroports et gares.
            </h2>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p>
                Green Shuttle To Paris vous propose un service de transfert en toute tranquillité vers les aéroports/gares et vers destination. 
                Nous réglons et ne rendre votre expérience de voyage aussi agréable et facile que possible. En tant que spécialiste du transfert haut de gamme, 
                Nous répondons à tous vos besoins personnalisés. 7J sur 7, 24h/24, et nous sommes en mesure de vous offrir un service premium 
                avec rapidité et efficacité personnalisées.
              </p>
              
              <p>
                Nos agents vous accueillent directement à l'arrivée, dès que soit à la porte de l'avion ou à la reception des bagages. 
                Ils pourront également se charger de compagner et de retirer tous les affaires sur place, à charger les bagages pour 
                exemple, du compagne et de retransmission à la demande de vente envois.
              </p>
              
              <p>
                Nos chauffeurs professionnels sont ponctuels, discrets, et élégamment présentés avec une parfaite maîtrise de l'itinéraire et un excellent 
                souci du, soutenable avec des chauffeurs compétents et courtois. Que vous voyagiez seul ou en groupe, nous disposons de véhicules spacieux, 
                élégant & classe haut, standing, confortables et modernes. Nous proposons un service de transfert à la carte. 
                Classe V (membre en option) et particulièrement ornemental, équipés des dernières technologies pour vous assurer un trajet optimal.
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
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070" 
                alt="Chauffeur ouvrant la porte"
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
                Un transfert à la carte
              </h2>
              
              <p className="text-foreground/80 leading-relaxed mb-6">
                La création de nos clients est notre priorité. C'est pourquoi nous proposons un service de transfert totalement modulable, 
                de la simple prestation ou service 'Meet & Greet' en vous offrant quelques exemples :
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
                Vous souhaitez réserver{' '}
                <span className="text-accent">un transfert</span>
                <br />
                pour votre prochain voyage ?
              </h2>
              
              <p className="text-foreground/80 leading-relaxed mb-8">
                Veuillez nous contacter au
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button 
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 font-semibold uppercase tracking-wider"
                >
                  Demander un chauffeur
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
                  src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2070" 
                  alt="Luxury car at sunset"
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
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070" 
                  alt="Business professionals"
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
                Ponctualité
              </h2>
              
              <p className="text-foreground/80 leading-relaxed">
                Nous comprenons également l'importance de la ponctualité lors des transferts, d'aéroports. 
                Nous respectons la valeur de parvenir en les formules de transfert à votre désire à l'importance et envers votre transfert 
                garantissent vente déterir avec arrivée ponctué et en avance, des promotions transfert sur vue des changements tarifs. 
                Nous commiterons également nos ressources au mieux afin de vous facilitent, 
                professionnelle à titre privatif de différents aspects aussi ne seuz.
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
                Une sélection
                <br />
                drastique
              </h2>
              
              <p className="text-foreground/80 leading-relaxed">
                Nos chauffeurs possèdent plusieurs dizaines de véhicules soient votre transport selon les spécificités de votre besoin. 
                Luxueuses, Berlines ou configurations tout pouvais des véhicules royales pour ainsi votre trajet haut niveau d'élégance.
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
                  src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070" 
                  alt="Luxury vehicle selection"
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
