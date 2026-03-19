import Header from './Header'
import Footer from './Footer'
import BookingForm from './BookingForm'
import { Check, Sparkle, Car, Clock, Shield } from '@phosphor-icons/react'
import { Card } from './ui/card'

interface ServiceFashionWeekProps {
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

export default function ServiceFashionWeek({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  userEmail,
  isAdmin,
  onLogout
}: ServiceFashionWeekProps) {
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
            backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1558769132-cb1aea3c8563?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 mb-6 border border-accent/30">
                <Sparkle size={20} weight="bold" className="text-accent" />
                <span className="text-accent font-medium text-sm tracking-wide">SERVICE VIP</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                VTC Premium<br />Fashion Week Paris
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Chauffeur privé exclusif pour professionnels de la mode, influenceurs et VIP
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Arrivez avec style à la Fashion Week
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Assurez-vous d'arriver à l'heure et avec style lors de la <strong>Fashion Week de Paris</strong> grâce à notre service VTC haut de gamme.
              </p>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Que vous soyez professionnel de la mode, influenceur, presse internationale, VIP ou visiteur de l'événement, nous vous offrons un transport ponctuel, sécurisé et confortable entre hôtels, défilés et soirées.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Véhicules premium avec chauffeur expérimenté et discret',
                  'Service ponctuel et flexible selon votre planning',
                  'Transport sécurisé pour événements VIP et press trips',
                  'Assistance bagages et coordination avec votre agenda',
                  'Véhicules équipés Wi-Fi pour rester connecté en route',
                  'Service sur mesure pour célébrités et clients d\'affaires'
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
                    Réservez votre VTC
                  </h3>
                  <p className="text-foreground/60">
                    Service premium pour la Fashion Week
                  </p>
                </div>
                <BookingForm compact={true} />
              </Card>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Services spécialisés Fashion Week
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Car,
                  title: 'Transferts Aéroports',
                  description: 'Charles de Gaulle et Orly vers hôtels et lieux de défilés avec suivi de vol'
                },
                {
                  icon: Sparkle,
                  title: 'Déplacements VIP',
                  description: 'Défilés, showrooms privés et soirées exclusives dans Paris'
                },
                {
                  icon: Shield,
                  title: 'Service Personnalisé',
                  description: 'Chauffeur dédié, ponctualité garantie et flexibilité totale'
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

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Nos véhicules pour la Fashion Week
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  title: 'Berline Premium',
                  description: 'Idéal pour 1 à 3 passagers, confort maximal, climatisation et Wi-Fi'
                },
                {
                  title: 'SUV / Van de Luxe',
                  description: '4 à 7 passagers, parfait pour équipes ou groupes avec bagages'
                },
                {
                  title: 'Véhicule VIP',
                  description: 'Service sur mesure pour célébrités, influenceurs ou clients d\'affaires'
                }
              ].map((item, idx) => (
                <Card key={idx} className="p-8 border-accent/20 bg-card/50 backdrop-blur-sm text-center">
                  <Car size={48} weight="duotone" className="text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Comment réserver
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Clock,
                  number: '1',
                  title: 'Point de départ',
                  description: 'Aéroport, hôtel ou adresse privée'
                },
                {
                  icon: Car,
                  number: '2',
                  title: 'Véhicule',
                  description: 'Sélectionnez adapté à votre groupe'
                },
                {
                  icon: Clock,
                  number: '3',
                  title: 'Dates & Heures',
                  description: 'Choisissez selon votre planning'
                },
                {
                  icon: Sparkle,
                  number: '4',
                  title: 'Confirmation',
                  description: 'Service VTC sur mesure confirmé'
                }
              ].map((item, idx) => (
                <Card key={idx} className="p-6 hover:border-accent/50 transition-all duration-300 bg-card/30 backdrop-blur-sm group text-center">
                  <div className="w-12 h-12 bg-accent/20 flex items-center justify-center mx-auto mb-4 border border-accent/30">
                    <span className="text-2xl font-bold text-accent" style={{ fontFamily: 'var(--font-display)' }}>{item.number}</span>
                  </div>
                  <item.icon size={32} weight="duotone" className="text-accent mb-3 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Réservez votre VTC Fashion Week Paris
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Assurez votre transport pendant la Fashion Week avec ponctualité, confort et discrétion absolue.
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
