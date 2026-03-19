import Header from './Header'
import Footer from './Footer'
import BookingForm from './BookingForm'
import { Check, Briefcase, MapPin, Users, Clock } from '@phosphor-icons/react'
import { Card } from './ui/card'

interface ServiceEventsProps {
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

export default function ServiceEvents({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  userEmail,
  isAdmin,
  onLogout
}: ServiceEventsProps) {
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
            backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 mb-6 border border-accent/30">
                <Briefcase size={20} weight="bold" className="text-accent" />
                <span className="text-accent font-medium text-sm tracking-wide">ÉVÉNEMENTS PROFESSIONNELS</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                VTC pour Événements<br />et Salons à Paris
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Transport professionnel pour salons, congrès et événements corporate
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Transport professionnel pour événements
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Participez à vos <strong>événements professionnels</strong> en toute sérénité grâce à notre service de VTC dédié aux événements et salons à Paris. Nous proposons des solutions de transport fiables et confortables pour les exposants, visiteurs, VIP et équipes organisatrices.
              </p>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Que vous assistiez à un congrès, un salon professionnel ou un événement privé, notre service vous garantit ponctualité, discrétion et confort.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Véhicules premium et confortables pour déplacements multiples',
                  'Chauffeurs professionnels et discrets',
                  'Ponctualité et organisation optimisée',
                  'Prise en charge à l\'hôtel, gare ou aéroport',
                  'Service flexible adapté aux horaires des événements',
                  'Mise à disposition de chauffeur pour la journée'
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
                    Transport pour votre événement professionnel
                  </p>
                </div>
                <BookingForm inline />
              </Card>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Principaux centres d'événements
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: MapPin,
                  title: 'Paris Expo Porte de Versailles',
                  description: 'Le plus grand parc d\'expositions de Paris'
                },
                {
                  icon: MapPin,
                  title: 'Palais des Congrès',
                  description: 'Centre de congrès prestigieux à Paris'
                },
                {
                  icon: MapPin,
                  title: 'Paris Nord Villepinte',
                  description: 'Parc des Expositions au nord de Paris'
                },
                {
                  icon: MapPin,
                  title: 'Le Bourget',
                  description: 'Centre d\'expositions et salons internationaux'
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
              Une solution idéale pour
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Briefcase,
                  title: 'Exposants',
                  description: 'Entreprises participant aux salons'
                },
                {
                  icon: Users,
                  title: 'Visiteurs',
                  description: 'Professionnels en visite aux salons'
                },
                {
                  icon: Clock,
                  title: 'Conférences',
                  description: 'Congrès et événements corporate'
                },
                {
                  icon: MapPin,
                  title: 'Événements VIP',
                  description: 'Lancements et événements privés'
                }
              ].map((item, idx) => (
                <Card key={idx} className="p-6 hover:border-accent/50 transition-all duration-300 bg-card/30 backdrop-blur-sm group text-center">
                  <item.icon size={40} weight="duotone" className="text-accent mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Mise à disposition avec chauffeur
            </h2>
            <Card className="p-8 sm:p-12 border-accent/20 bg-card/50 backdrop-blur-sm">
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                Pour les journées de salon ou d'événement, nous proposons également un service de <strong>chauffeur à disposition</strong>. Votre chauffeur reste disponible pour tous vos déplacements entre :
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Hôtels et centres d\'expositions',
                  'Restaurants et lieux de restauration',
                  'Rendez-vous professionnels',
                  'Aéroports et gares'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <p className="text-foreground/80">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Réservez votre VTC pour votre événement
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Simplifiez vos déplacements lors de votre prochain événement à Paris grâce à un service de transport professionnel.
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
