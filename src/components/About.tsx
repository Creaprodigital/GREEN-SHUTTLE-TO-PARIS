import Header from './Header'
import Footer from './Footer'
import { Shield, Star, Heart, Users } from '@phosphor-icons/react'

interface AboutProps {
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

export default function About({
  onNavigateToLogin,
  onNavigateToHome,
  onNavigateToChauffeurPrive,
  onNavigateToAirportTransfer,
  onNavigateToCorporateEvent,
  onNavigateToEmbassyDelegation,
  onLogout,
  userEmail,
  isAdmin
}: AboutProps) {
  const values = [
    {
      icon: Shield,
      title: 'Fiabilité',
      description: 'Une ponctualité irréprochable et un service constant pour tous vos déplacements.'
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'Des standards de qualité élevés dans chaque aspect de notre service.'
    },
    {
      icon: Heart,
      title: 'Service Client',
      description: 'Une écoute attentive et une disponibilité permanente pour répondre à vos besoins.'
    },
    {
      icon: Users,
      title: 'Professionnalisme',
      description: 'Des chauffeurs expérimentés, formés et dévoués à votre satisfaction.'
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
              Qui Sommes-Nous ?
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Green Shuttle To Paris est votre partenaire de confiance pour un transport de luxe en Île-de-France.
            </p>
          </div>

          <div className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                  Notre Histoire
                </h2>
                <div className="space-y-4 text-foreground/80 text-lg">
                  <p>
                    Fondée avec la vision de redéfinir le transport premium en région parisienne, Green Shuttle To Paris s'est imposée comme une référence dans le domaine du chauffeur privé de luxe.
                  </p>
                  <p>
                    Fort de plus de 10 ans d'expérience, nous avons su développer une expertise unique alliant confort, ponctualité et discrétion pour satisfaire une clientèle exigeante.
                  </p>
                  <p>
                    Notre engagement environnemental se reflète dans notre flotte de véhicules écologiques haut de gamme, permettant de concilier luxe et responsabilité.
                  </p>
                </div>
              </div>
              <div className="bg-accent h-96" />
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-accent h-96" />
              <div className="order-1 md:order-2">
                <h2 className="text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                  Notre Mission
                </h2>
                <div className="space-y-4 text-foreground/80 text-lg">
                  <p>
                    Offrir à nos clients une expérience de transport exceptionnelle, où chaque trajet devient un moment de confort et de sérénité.
                  </p>
                  <p>
                    Nous nous engageons à fournir un service irréprochable, adapté aux besoins spécifiques de chaque client, qu'il s'agisse de déplacements professionnels, de transferts aéroportuaires ou d'événements spéciaux.
                  </p>
                  <p>
                    Notre objectif est de dépasser vos attentes à chaque instant, en combinant professionnalisme, élégance et innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl font-bold text-foreground text-center mb-12" style={{ fontFamily: 'var(--font-display)' }}>
              Nos Valeurs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-accent flex items-center justify-center mx-auto mb-4">
                      <Icon size={40} className="text-accent-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      {value.title}
                    </h3>
                    <p className="text-foreground/70">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-card border border-border p-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Une Équipe à Votre Service
              </h2>
              <p className="text-foreground/80 text-lg mb-8">
                Notre équipe de chauffeurs professionnels est rigoureusement sélectionnée et formée pour vous garantir une expérience exceptionnelle. Discrétion, courtoisie et connaissance parfaite de la région sont les qualités qui définissent nos collaborateurs.
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-accent mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    50+
                  </div>
                  <p className="text-foreground/70">Chauffeurs professionnels</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    5000+
                  </div>
                  <p className="text-foreground/70">Clients satisfaits</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    98%
                  </div>
                  <p className="text-foreground/70">Taux de satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
