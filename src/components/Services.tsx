import Header from './Header'
import Footer from './Footer'
import { Car, MapPin, Users, Building } from '@phosphor-icons/react'

interface ServicesProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToHome?: () => void
  onNavigateToChauffeurPrive?: () => void
  onNavigateToAirportTransfer?: () => void
  onNavigateToCorporateEvent?: () => void
  onNavigateToEmbassyDelegation?: () => void
  onLogout?: () => void
  userEmail?: string
  isAdmin?: boolean
}

export default function Services({
  onNavigateToLogin,
  onNavigateToHome,
  onNavigateToChauffeurPrive,
  onNavigateToAirportTransfer,
  onNavigateToCorporateEvent,
  onNavigateToEmbassyDelegation,
  onLogout,
  userEmail,
  isAdmin
}: ServicesProps) {
  const services = [
    {
      icon: Car,
      title: 'Chauffeur Privé',
      description: 'Profitez d\'un service de chauffeur privé haut de gamme pour tous vos déplacements. Confort, ponctualité et discrétion garantis.',
      features: [
        'Disponibilité 24/7',
        'Véhicules de luxe',
        'Chauffeurs professionnels',
        'Service personnalisé'
      ]
    },
    {
      icon: MapPin,
      title: 'Transfert Aéroports / Gares',
      description: 'Transferts vers tous les aéroports et gares de Paris et de la région. Service porte-à-porte avec suivi de vol en temps réel.',
      features: [
        'Suivi des vols',
        'Accueil personnalisé',
        'Assistance bagages',
        'Tarifs fixes'
      ]
    },
    {
      icon: Users,
      title: 'Corporate & Événementiel',
      description: 'Solutions de transport premium pour vos événements professionnels, séminaires et réunions d\'affaires.',
      features: [
        'Flotte dédiée',
        'Planning personnalisé',
        'Facturation simplifiée',
        'Service multi-passagers'
      ]
    },
    {
      icon: Building,
      title: 'Ambassades & Délégations',
      description: 'Service de transport protocolaire pour les ambassades et délégations officielles avec chauffeurs formés au protocole diplomatique.',
      features: [
        'Discrétion absolue',
        'Protocole diplomatique',
        'Sécurité renforcée',
        'Disponibilité permanente'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToChauffeurPrive={onNavigateToChauffeurPrive}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
        onNavigateToCorporateEvent={onNavigateToCorporateEvent}
        onNavigateToEmbassyDelegation={onNavigateToEmbassyDelegation}
        onNavigateToHome={onNavigateToHome}
        onLogout={onLogout}
        userEmail={userEmail}
        isAdmin={isAdmin}
      />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Nos Services
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Des solutions de transport premium adaptées à tous vos besoins, alliant confort, élégance et professionnalisme.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className="bg-card border border-border p-8 hover:border-accent transition-colors"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-accent flex items-center justify-center shrink-0">
                      <Icon size={32} className="text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                        {service.title}
                      </h3>
                      <p className="text-foreground/70 mb-6">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-foreground/80">
                            <div className="w-1.5 h-1.5 bg-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-16 bg-accent p-12 text-center">
            <h2 className="text-3xl font-bold text-accent-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Pourquoi Choisir Green Shuttle To Paris ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-4xl font-bold text-accent-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  24/7
                </div>
                <p className="text-accent-foreground/90">Service disponible jour et nuit</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  100%
                </div>
                <p className="text-accent-foreground/90">Satisfaction client garantie</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  +10 ans
                </div>
                <p className="text-accent-foreground/90">D'expérience dans le transport de luxe</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
