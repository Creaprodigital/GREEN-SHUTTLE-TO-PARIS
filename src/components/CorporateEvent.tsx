import { Button } from '@/components/ui/button'
import { CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface CorporateEventProps {
  onBackToHome?: () => void
  onNavigateToAirportTransfer?: () => void
  onNavigateToCorporateEvent?: () => void
  onNavigateToEmbassyDelegation?: () => void
}

export default function CorporateEvent({ onBackToHome, onNavigateToAirportTransfer, onNavigateToCorporateEvent, onNavigateToEmbassyDelegation }: CorporateEventProps) {
  const benefits = [
    "Organisation complète de vos déplacements professionnels",
    "Véhicules haut de gamme pour vos événements d'entreprise",
    "Chauffeurs professionnels multilingues",
    "Service discret et ponctuel pour vos collaborateurs",
    "Gestion de groupe pour séminaires et conférences",
    "Coordination en temps réel pour vos événements"
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
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Corporate &
              <br />
              Événementiel
            </h1>
            <Button 
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 font-semibold uppercase tracking-wider"
            >
              Demander un devis
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Service de <span className="text-accent">transport corporate & événementiel</span>, disponible 
              24 heures sur 24, 7 jours sur 7, pour accompagner vos événements professionnels.
            </h2>
            
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p>
                Haimouri International vous propose un service de transport corporate et événementiel haut de gamme adapté 
                à tous vos besoins professionnels. Que ce soit pour des réunions d'affaires, des séminaires, des conférences 
                ou des événements d'entreprise, nous mettons à votre disposition notre expertise et notre flotte de véhicules 
                premium pour garantir le succès de vos déplacements.
              </p>

              <p>
                Nos chauffeurs professionnels sont formés pour répondre aux exigences du monde des affaires. Discrétion, 
                ponctualité et présentation irréprochable sont nos maîtres-mots. Nous comprenons l'importance de chaque 
                déplacement dans le cadre professionnel et nous nous engageons à vous offrir une expérience sans faille.
              </p>

              <p>
                Nos véhicules sont équipés des dernières technologies pour vous permettre de travailler en déplacement. 
                Wi-Fi à bord, prises électriques, et espaces confortables sont mis à votre disposition pour que chaque 
                trajet soit productif. Nous proposons également des services de coordination pour les événements de groupe, 
                assurant une logistique parfaite pour vos équipes.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-card border border-border p-6 flex items-start gap-4"
              >
                <CheckCircle className="text-accent shrink-0 mt-1" size={24} weight="fill" />
                <p className="text-foreground/80">{benefit}</p>
              </div>
            ))}
          </motion.div>
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
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                Excellence
                <br />
                & Disponibilité
              </h2>
              
              <p className="text-foreground/80 leading-relaxed mb-8">
                Notre service corporate est disponible 24h/24, 7j/7 pour répondre à tous vos besoins. 
                Que ce soit pour un transfert urgent, un événement planifié ou une mission de dernière minute, 
                notre équipe est prête à vous accompagner.
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
                  src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2112" 
                  alt="Corporate event"
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
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070" 
                  alt="Professional team"
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
                Professionnalisme
              </h2>
              
              <p className="text-foreground/80 leading-relaxed">
                Nous comprenons l'importance de la discrétion et du professionnalisme dans le monde des affaires. 
                Nos chauffeurs sont formés pour offrir un service haut de gamme tout en respectant la confidentialité 
                de vos échanges professionnels. Chaque détail est pensé pour que vous puissiez vous concentrer sur 
                l'essentiel : vos affaires.
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
                Flotte premium
                <br />
                pour vos événements
              </h2>
              
              <p className="text-foreground/80 leading-relaxed">
                Notre flotte de véhicules haut de gamme est spécialement sélectionnée pour répondre aux exigences 
                des événements corporate. Berlines de luxe, SUV premium et vans VIP sont à votre disposition pour 
                transporter vos invités et collaborateurs dans le plus grand confort.
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
                  alt="Luxury fleet"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}
