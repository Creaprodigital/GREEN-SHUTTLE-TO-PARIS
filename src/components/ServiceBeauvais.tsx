import Header from './Header'
import Footer from './Footer'
import BookingForm from './BookingForm'
import { Check, Airplane, Clock, Shield, Users } from '@phosphor-icons/react'
import { Card } from './ui/card'

interface ServiceBeauvaisProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToClient?: () => void
  onNavigateToHome?: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
  userEmail?: string
  isAdmin?: boolean
  onLogout?: () => void
}

export default function ServiceBeauvais({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  userEmail,
  isAdmin,
  onLogout
}: ServiceBeauvaisProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToClient={onNavigateToClient}
        onNavigateToHome={onNavigateToHome}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToContact={onNavigateToContact}
        userEmail={userEmail}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />

      <main className="pt-20">
        <div 
          className="relative h-[450px] sm:h-[550px] bg-gradient-to-br from-primary via-primary/95 to-secondary"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 mb-6 border border-accent/30">
                <Airplane size={20} weight="bold" className="text-accent" />
                <span className="text-accent font-medium text-sm tracking-wide">TRANSFERT AÉROPORT</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                Transfert Aéroport<br />Paris-Beauvais
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Service de chauffeur privé entre l'aéroport Beauvais et Paris - Situé à 80 km, trajet confortable et direct
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Voyagez confortablement entre Beauvais et Paris
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Voyagez confortablement entre <strong>Aéroport de Paris-Beauvais</strong> et Paris grâce à notre service de transfert avec chauffeur privé. Nous proposons une solution fiable et confortable pour rejoindre la capitale ou l'aéroport en toute tranquillité.
              </p>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Situé à environ 80 km de Paris, l'aéroport Beauvais est principalement utilisé par les compagnies low-cost. Notre service vous permet de rejoindre votre destination rapidement et sans stress.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Accueil personnalisé à l\'aéroport avec pancarte nominative',
                  'Suivi de votre vol pour ajuster l\'heure de prise en charge',
                  'Assistance complète avec vos bagages',
                  'Véhicules confortables et spacieux pour trajets longue distance',
                  'Service ponctuel et fiable disponible 24h/24',
                  'Trajet direct entre Paris et Beauvais optimisé selon le trafic'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent flex items-center justify-center shrink-0 mt-1">
                      <Check size={16} weight="bold" className="text-accent-foreground" />
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <Card className="p-6 sm:p-8 border-accent/20 bg-card/50 backdrop-blur-sm">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    Réservez votre transfert
                  </h3>
                  <p className="text-foreground/60">
                    Obtenez un devis instantané pour votre trajet
                  </p>
                </div>
                <BookingForm inline />
              </Card>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Pourquoi choisir notre service ?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Airplane,
                  title: 'Idéal pour Low-Cost',
                  description: 'Service adapté aux compagnies low-cost comme Ryanair, Wizz Air'
                },
                {
                  icon: Clock,
                  title: 'Disponible 24/7',
                  description: 'Service disponible jour et nuit pour tous les vols'
                },
                {
                  icon: Shield,
                  title: 'Trajet Sécurisé',
                  description: 'Chauffeurs expérimentés sur cet itinéraire de 80 km'
                },
                {
                  icon: Users,
                  title: 'Tous Voyageurs',
                  description: 'Familles, groupes, arrivées tardives ou départs matinaux'
                }
              ].map((item, idx) => (
                <Card key={idx} className="p-6 hover:border-accent/50 transition-all duration-300 bg-card/30 backdrop-blur-sm group">
                  <item.icon size={40} weight="duotone" className="text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-20">
            <Card className="p-8 border-accent/20 bg-card/50 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Depuis l'aéroport Beauvais vers Paris
              </h3>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                À votre arrivée à <strong>l'Aéroport de Paris-Beauvais</strong>, votre chauffeur vous attend au terminal avec une pancarte à votre nom et vous accompagne jusqu'au véhicule.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Nous suivons également votre vol afin d'adapter l'heure de prise en charge en cas de retard. Profitez d'un trajet confortable d'environ 1h15 selon le trafic.
              </p>
            </Card>

            <Card className="p-8 border-accent/20 bg-card/50 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                De Paris vers l'aéroport Beauvais
              </h3>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                Pour votre départ, votre chauffeur vient vous chercher directement à votre hôtel, domicile ou bureau à Paris.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Nous planifions l'heure de départ en fonction du trafic et de votre vol afin de garantir une arrivée à l'aéroport dans les meilleures conditions, avec une marge de sécurité adaptée.
              </p>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Réservez votre transfert Beauvais ⇄ Paris
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Profitez d'un service de transport fiable et confortable entre l'Aéroport de Paris-Beauvais et Paris. Évitez le stress des navettes bondées.
            </p>
            <a href="#accueil" onClick={(e) => {
              e.preventDefault()
              onNavigateToHome?.()
            }}>
              <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 font-semibold text-lg tracking-wide transition-all hover:scale-105">
                RÉSERVER MAINTENANT
              </button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
