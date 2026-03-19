import Header from './Header'
import Footer from './Footer'
import BookingForm from './BookingForm'
import { Check, Wine, MapPin, Clock, Star } from '@phosphor-icons/react'
import { Card } from './ui/card'

interface ServiceWineTourProps {
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

export default function ServiceWineTour({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  userEmail,
  isAdmin,
  onLogout
}: ServiceWineTourProps) {
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
            backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 mb-6 border border-accent/30">
                <Wine size={20} weight="bold" className="text-accent" />
                <span className="text-accent font-medium text-sm tracking-wide">EXCURSION PRIVÉE</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                Dégustation de Vins<br />et Champagne
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Découvrez les vignobles français avec chauffeur privé - Champagne, Loire, Bourgogne
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Excursion privée dans les vignobles
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Partez à la découverte des <strong>meilleurs vins et champagnes</strong> autour de Paris avec un chauffeur privé. Notre service VTC haut de gamme vous garantit un transport confortable, sécurisé et ponctuel.
              </p>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Profitez pleinement de chaque dégustation, sans stress et à votre rythme. Idéal pour amateurs de vin, touristes ou clients VIP souhaitant une expérience sur mesure.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Véhicules confortables et haut de gamme pour trajets entre vignobles',
                  'Chauffeurs expérimentés, ponctuels et discrets',
                  'Flexibilité totale : durée et itinéraire sur mesure',
                  'Accès à des dégustations privées et conseils personnalisés',
                  'Idéal pour particuliers, familles, groupes ou VIP',
                  'Prise en charge à Paris, retour en fin de journée'
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
                    Créez votre expérience viticole sur mesure
                  </p>
                </div>
                <BookingForm inline />
              </Card>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Destinations viticoles populaires
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: MapPin,
                  title: 'Champagne',
                  subtitle: 'Épernay et Reims',
                  description: 'Visite des prestigieuses maisons de champagne, dégustations privées et découverte des caves'
                },
                {
                  icon: MapPin,
                  title: 'Vallée de la Loire',
                  subtitle: 'Vignobles et Châteaux',
                  description: 'Découverte des vignobles historiques, dégustation de vins raffinés et villages pittoresques'
                },
                {
                  icon: MapPin,
                  title: 'Bourgogne',
                  subtitle: 'Grands Crus',
                  description: 'Exploration des vignobles renommés, domaines familiaux et dégustation de grands crus'
                }
              ].map((item, idx) => (
                <Card key={idx} className="p-6 hover:border-accent/50 transition-all duration-300 bg-card/30 backdrop-blur-sm group">
                  <item.icon size={40} weight="duotone" className="text-accent mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl text-foreground mb-1">{item.title}</h3>
                  <p className="text-accent text-sm font-medium mb-3">{item.subtitle}</p>
                  <p className="text-foreground/60 text-sm leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Comment fonctionne votre excursion
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Clock,
                  number: '1',
                  title: 'Réservation',
                  description: 'Réservation en ligne rapide et sécurisée'
                },
                {
                  icon: MapPin,
                  number: '2',
                  title: 'Prise en charge',
                  description: 'À Paris (hôtel, domicile ou bureau)'
                },
                {
                  icon: Wine,
                  number: '3',
                  title: 'Dégustations',
                  description: 'Visites et dégustations à votre rythme'
                },
                {
                  icon: Star,
                  number: '4',
                  title: 'Retour',
                  description: 'Retour à Paris dans un véhicule climatisé'
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
              Réservez votre excursion vins et champagne
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Vivez une journée exceptionnelle dans les vignobles français, avec un chauffeur privé pour un transport sûr et confortable.
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
