import Header from './Header'
import Footer from './Footer'
import BookingForm from './BookingForm'
import { Check, Briefcase, Airplane, MapTrifold, Users } from '@phosphor-icons/react'
import { Card } from './ui/card'

interface ServiceTravelAgencyProps {
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

export default function ServiceTravelAgency({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  userEmail,
  isAdmin,
  onLogout
}: ServiceTravelAgencyProps) {
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
            backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 mb-6 border border-accent/30">
                <Briefcase size={20} weight="bold" className="text-accent" />
                <span className="text-accent font-medium text-sm tracking-wide">PARTENARIAT B2B</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                Chauffeur Privé pour<br />Agence de Voyage
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Partenaire transport fiable et professionnel pour vos clients
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Partenaire de confiance pour agences
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Vous êtes une <strong>agence de voyage</strong> et cherchez un partenaire de transport fiable pour vos clients ? Notre service de chauffeur privé haut de gamme offre des solutions sur mesure pour tous types de déplacements.
              </p>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Nous assurons un service ponctuel, sécurisé et confortable, adapté aux besoins des voyageurs et aux exigences des agences professionnelles.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Chauffeurs professionnels et discrets expérimentés',
                  'Véhicules confortables adaptés aux groupes',
                  'Service privé et flexible pour répondre à vos exigences',
                  'Possibilité de réservations récurrentes ou ponctuelles',
                  'Assistance bagages et suivi en temps réel',
                  'Tarification transparente et partenariats sur mesure'
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
                    Contactez-nous
                  </h3>
                  <p className="text-foreground/60">
                    Devenez partenaire
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Téléphone</p>
                    <p className="text-lg font-semibold text-foreground">+33 X XX XX XX XX</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Email</p>
                    <p className="text-lg font-semibold text-foreground">partenaires@velocexpress.com</p>
                  </div>
                  <div className="pt-4">
                    <button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 font-semibold tracking-wide transition-all">
                      DEVENIR PARTENAIRE
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Nos services pour agences
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Airplane,
                  title: 'Transferts Aéroports et Gares',
                  description: 'Charles de Gaulle, Orly, gares Paris - Suivi de vols et trains en temps réel'
                },
                {
                  icon: MapTrifold,
                  title: 'Excursions et Circuits',
                  description: 'Sites touristiques autour de Paris, trajets sur mesure pour groupes'
                },
                {
                  icon: Users,
                  title: 'Trajets Longue Distance',
                  description: 'Paris vers régions françaises et pays voisins (Bruxelles, Luxembourg)'
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
              Avantages pour votre agence
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                {
                  title: 'Réseau Fiable',
                  description: 'Accès à un réseau VTC fiable pour tous vos clients, service ponctuel et sécuritaire garanti'
                },
                {
                  title: 'Flexibilité Totale',
                  description: 'Trajets courts, longs ou excursions - Service adapté à tous besoins'
                },
                {
                  title: 'Suivi & Assistance',
                  description: 'Suivi et assistance pour chaque réservation, coordination transparente'
                },
                {
                  title: 'Tarification Claire',
                  description: 'Collaboration transparente avec tarification claire et contrats négociables'
                }
              ].map((item, idx) => (
                <Card key={idx} className="p-8 border-accent/20 bg-card/50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Rejoignez notre réseau partenaires
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Offrez à vos clients un transport sécurisé, confortable et ponctuel avec notre service VTC professionnel.
            </p>
            <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 font-semibold text-lg tracking-wide transition-all hover:scale-105">
              DEVENIR PARTENAIRE VTC
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
