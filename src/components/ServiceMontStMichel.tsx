import Header from './Header'
import Footer from './Footer'
import BookingForm from './BookingForm'
import { Check, Castle, MapPin, Clock, Star } from '@phosphor-icons/react'
import { Card } from './ui/card'

interface ServiceMontStMichelProps {
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

export default function ServiceMontStMichel({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  userEmail,
  isAdmin,
  onLogout
}: ServiceMontStMichelProps) {
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
            backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 mb-6 border border-accent/30">
                <Castle size={20} weight="bold" className="text-accent" />
                <span className="text-accent font-medium text-sm tracking-wide">EXCURSION PRIVÉE</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                Transfert vers le<br />Mont Saint-Michel
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                L'un des sites les plus emblématiques de France - Départ Paris et aéroports
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Découvrez le Mont Saint-Michel
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Partez à la découverte du <strong>Mont Saint-Michel</strong>, l'un des sites les plus emblématiques de France, avec notre service de chauffeur privé VTC.
              </p>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Que vous partiez de Paris, de l'aéroport Charles de Gaulle ou de l'aéroport d'Orly, profitez d'un trajet confortable, sécurisé et ponctuel. Évitez le stress des transports publics et profitez d'un véhicule haut de gamme.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Chauffeur professionnel et ponctuel, parlant français et anglais',
                  'Véhicule confortable, climatisé et spacieux',
                  'Service privé et flexible, adapté à vos besoins',
                  'Possibilité de trajet aller-retour dans la journée',
                  'Assistance bagages et prise en charge personnalisée',
                  'Arrêts possibles en chemin (villages, points de vue, restaurants)'
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
                    Réservez votre excursion
                  </h3>
                  <p className="text-foreground/60">
                    Découvrez le Mont Saint-Michel en toute tranquillité
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
                  icon: Castle,
                  title: 'Site Emblématique',
                  description: 'L\'un des monuments les plus visités de France'
                },
                {
                  icon: Clock,
                  title: 'Trajet Optimisé',
                  description: '3h30 à 4h depuis Paris selon le trafic'
                },
                {
                  icon: Star,
                  title: 'Expérience VIP',
                  description: 'Service premium pour familles, groupes et voyageurs VIP'
                },
                {
                  icon: MapPin,
                  title: 'Flexibilité Totale',
                  description: 'Horaires adaptés et arrêts sur demande'
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
              Durée et itinéraire
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <Card className="p-8 border-accent/20 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={32} weight="duotone" className="text-accent" />
                  <h3 className="text-xl font-bold text-foreground">Depuis Paris</h3>
                </div>
                <p className="text-foreground/70 mb-4">
                  <strong>Paris → Mont Saint-Michel</strong> : environ 3h30 à 4h selon le trafic
                </p>
                <p className="text-foreground/60 text-sm">
                  Votre chauffeur choisira l'itinéraire le plus rapide pour optimiser votre temps et profiter pleinement de votre visite.
                </p>
              </Card>

              <Card className="p-8 border-accent/20 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={32} weight="duotone" className="text-accent" />
                  <h3 className="text-xl font-bold text-foreground">Depuis les aéroports</h3>
                </div>
                <p className="text-foreground/70 mb-4">
                  <strong>CDG / Orly → Mont Saint-Michel</strong> : environ 3h30 à 4h
                </p>
                <p className="text-foreground/60 text-sm">
                  Prise en charge directe depuis votre terminal avec suivi de vol en temps réel.
                </p>
              </Card>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Réservez votre transfert Mont Saint-Michel
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Profitez d'un trajet privé et confortable vers le Mont Saint-Michel avec notre chauffeur VTC professionnel.
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
