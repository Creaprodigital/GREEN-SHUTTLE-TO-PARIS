import Header from './Header'
import Footer from './Footer'
import BookingForm from './BookingForm'
import { Check, MapPin, Car, Clock, Users } from '@phosphor-icons/react'
import { Card } from './ui/card'

interface ServiceNormandyProps {
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

export default function ServiceNormandy({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  userEmail,
  isAdmin,
  onLogout
}: ServiceNormandyProps) {
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
            backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1599974114946-9ed5043ba4b1?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 mb-6 border border-accent/30">
                <MapPin size={20} weight="bold" className="text-accent" />
                <span className="text-accent font-medium text-sm tracking-wide">TRANSFERT PRIVÉ</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                Transfert vers<br />la Normandie
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Chauffeur privé depuis Paris et les aéroports - Deauville, Honfleur, Étretat, Mont Saint-Michel
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Voyagez confortablement vers la Normandie
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Voyagez confortablement vers la <strong>Normandie</strong> avec notre service de chauffeur privé. Que vous partiez de Paris, de l'aéroport Charles de Gaulle ou de l'aéroport d'Orly, nous vous garantissons un trajet ponctuel, sécurisé et confortable.
              </p>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Évitez le stress des transports publics et profitez d'un véhicule haut de gamme avec chauffeur professionnel pour découvrir les plus beaux sites de Normandie.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Chauffeur professionnel et expérimenté',
                  'Véhicule confortable, climatisé et spacieux',
                  'Départ depuis Paris ou les aéroports sans stress',
                  'Service privé et flexible selon votre planning',
                  'Possibilité de trajets aller-retour',
                  'Arrêts touristiques ou pause café sur demande'
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
                    Obtenez un devis pour votre trajet vers la Normandie
                  </p>
                </div>
                <BookingForm inline />
              </Card>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Nos destinations en Normandie
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: MapPin,
                  title: 'Deauville & Trouville',
                  description: 'Stations balnéaires élégantes de la Côte Fleurie'
                },
                {
                  icon: MapPin,
                  title: 'Honfleur',
                  description: 'Port pittoresque et charmant, village d\'artistes'
                },
                {
                  icon: MapPin,
                  title: 'Étretat',
                  description: 'Falaises spectaculaires et paysages à couper le souffle'
                },
                {
                  icon: MapPin,
                  title: 'Caen & Bayeux',
                  description: 'Sites historiques et culturels de Normandie'
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
              Durée du trajet
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { from: 'Paris', to: 'Deauville', duration: 'environ 2h30' },
                { from: 'Paris', to: 'Honfleur', duration: 'environ 2h30' },
                { from: 'Paris', to: 'Mont Saint-Michel', duration: 'environ 3h30' },
                { from: 'Aéroports CDG / Orly', to: 'Normandie', duration: 'temps similaire selon le trafic' }
              ].map((item, idx) => (
                <Card key={idx} className="p-6 border-accent/20 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock size={24} weight="duotone" className="text-accent" />
                    <h3 className="font-bold text-foreground">{item.from} → {item.to}</h3>
                  </div>
                  <p className="text-foreground/60">{item.duration}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: Car,
                title: 'Berline',
                description: '1 à 3 passagers'
              },
              {
                icon: Car,
                title: 'SUV / Van',
                description: '4 à 7 passagers, idéal pour familles ou groupes'
              },
              {
                icon: Users,
                title: 'Véhicule Premium',
                description: 'Confort maximal pour clients VIP'
              }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 text-center hover:border-accent/50 transition-all duration-300 bg-card/30 backdrop-blur-sm group">
                <item.icon size={48} weight="duotone" className="text-accent mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-foreground/60 text-sm">{item.description}</p>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Réservez votre transfert vers la Normandie
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Profitez d'un trajet confortable et sécurisé depuis Paris ou les aéroports vers les plus beaux sites de Normandie.
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
