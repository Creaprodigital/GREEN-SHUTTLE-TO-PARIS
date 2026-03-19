import Header from './Header'
import Footer from './Footer'
import BookingForm from './BookingForm'
import { Check, GlobeHemisphereWest, MapPin, Car, Shield } from '@phosphor-icons/react'
import { Card } from './ui/card'

interface ServiceLongDistanceProps {
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

export default function ServiceLongDistance({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  userEmail,
  isAdmin,
  onLogout
}: ServiceLongDistanceProps) {
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
            backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 mb-6 border border-accent/30">
                <GlobeHemisphereWest size={20} weight="bold" className="text-accent" />
                <span className="text-accent font-medium text-sm tracking-wide">TRANSFERT LONGUE DISTANCE</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                Transferts<br />Longue Distance
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Chauffeur privé VTC depuis Paris - Bruxelles, Luxembourg, Lyon, Marseille et plus
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Voyagez en toute sérénité
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Voyagez confortablement et en toute sécurité sur de <strong>longues distances</strong> avec notre service de chauffeur privé VTC. Que vous partiez vers Bruxelles, Luxembourg, Marseille, Lyon ou d'autres destinations en France et en Europe.
              </p>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Notre service est idéal pour voyageurs professionnels, familles, groupes et clients VIP, souhaitant éviter le stress des transports publics ou des vols internes.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Chauffeurs professionnels et expérimentés sur longs trajets',
                  'Véhicules confortables et climatisés adaptés aux trajets longs',
                  'Service privé et flexible pour aller à votre rythme',
                  'Assistance bagages et suivi en temps réel',
                  'Possibilité de trajets aller-retour ou multi-destinations',
                  'Pauses et arrêts selon vos besoins'
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
                    Réservez votre trajet
                  </h3>
                  <p className="text-foreground/60">
                    Obtenez un devis pour votre destination
                  </p>
                </div>
                <BookingForm inline />
              </Card>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Destinations longue distance
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { city: 'Bruxelles', country: 'Belgique', duration: '~3h30' },
                { city: 'Luxembourg', country: 'Luxembourg', duration: '~3h45' },
                { city: 'Lyon', country: 'France', duration: '~4h30' },
                { city: 'Marseille', country: 'France', duration: '~7h30' }
              ].map((item, idx) => (
                <Card key={idx} className="p-6 hover:border-accent/50 transition-all duration-300 bg-card/30 backdrop-blur-sm group">
                  <MapPin size={40} weight="duotone" className="text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl text-foreground mb-1">{item.city}</h3>
                  <p className="text-foreground/60 text-sm mb-3">{item.country}</p>
                  <p className="text-accent font-medium text-sm">{item.duration}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Pourquoi choisir notre service ?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Car,
                  title: 'Confort Premium',
                  description: 'Véhicules adaptés aux longues distances avec espace bagages'
                },
                {
                  icon: Shield,
                  title: 'Sécurité Garantie',
                  description: 'Chauffeurs expérimentés et véhicules entretenus'
                },
                {
                  icon: MapPin,
                  title: 'Trajet Direct',
                  description: 'Sans correspondances ni changements de transport'
                },
                {
                  icon: GlobeHemisphereWest,
                  title: 'France & Europe',
                  description: 'Destinations en France et pays voisins'
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

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Réservez votre trajet longue distance
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Profitez d'un trajet sécurisé, confortable et ponctuel vers votre destination longue distance depuis Paris.
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
