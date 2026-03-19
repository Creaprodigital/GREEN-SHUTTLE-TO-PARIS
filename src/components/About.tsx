import Header from './Header'
import Footer from './Footer'
import { CheckCircle, Clock, Shield, Users } from '@phosphor-icons/react'

interface AboutProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToClient?: () => void
  onNavigateToHome?: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
  onLogout?: () => void
  userEmail?: string
  isAdmin?: boolean
}

export default function About({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  onLogout,
  userEmail,
  isAdmin
}: AboutProps) {
  const values = [
    {
      icon: CheckCircle,
      title: 'Excellence',
      description: 'Nous plaçons la satisfaction du client au cœur de nos priorités avec un service de qualité irréprochable.'
    },
    {
      icon: Shield,
      title: 'Discrétion',
      description: 'Confidentialité et respect de votre vie privée sont nos engagements premiers.'
    },
    {
      icon: Clock,
      title: 'Ponctualité',
      description: 'Nos chauffeurs connaissent parfaitement les itinéraires pour vous conduire à destination dans les meilleurs délais.'
    },
    {
      icon: Users,
      title: 'Professionnalisme',
      description: 'Nos chauffeurs sont professionnels, courtois et expérimentés pour garantir votre confort.'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToClient={onNavigateToClient}
        onNavigateToHome={onNavigateToHome}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToContact={onNavigateToContact}
        onLogout={onLogout}
        userEmail={userEmail}
        isAdmin={isAdmin}
      />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Qui sommes-nous
            </h1>
            <div className="w-24 h-0.5 bg-accent mx-auto mb-8" />
            <p className="text-xl text-accent font-medium uppercase tracking-wider mb-8">
              Tout ce que vous voulez savoir
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 mb-16">
            <div className="bg-card border border-border p-8">
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Bienvenue chez <span className="text-accent font-semibold">Véloce Express</span>, votre service de chauffeur privé VTC dédié à vous offrir des trajets <span className="text-accent font-medium">confortables</span>, <span className="text-accent font-medium">sur mesure</span>, <span className="text-accent font-medium">sûrs</span> et <span className="text-accent font-medium">ponctuels</span>.
              </p>
              
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Véloce Express est une <span className="font-semibold">SARL fondée en 2010</span>, immatriculée au registre des transporteurs et conforme aux réglementations européennes en vigueur ; pensé pour celles et ceux qui recherchent excellence, discrétion, satisfaction et confort.
              </p>

              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Notre mission est simple : <span className="text-accent font-medium">faciliter vos déplacements</span> tout en vous garantissant une expérience de transport haut de gamme. Que ce soit pour un transfert vers l'aéroport, un rendez-vous professionnel, une sortie entre amis ou un événement spécial, nous mettons tout en œuvre pour répondre à vos attentes.
              </p>

              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Nous accordons une grande importance à la qualité du service et à la satisfaction de nos clients. Nos chauffeurs sont professionnels, courtois et expérimentés. Ils connaissent parfaitement les itinéraires afin de vous conduire à destination dans les meilleures conditions et dans les meilleurs délais.
              </p>

              <div className="bg-accent/10 border-l-4 border-accent p-6 mt-8">
                <p className="text-lg text-foreground font-medium">
                  Avec Véloce Express, profitez d'un service de transport privé qui place la satisfaction, la discrétion et le confort du client au cœur de ses priorités.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Nos Valeurs
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="bg-card border border-border p-6 text-center hover:border-accent/50 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-accent mx-auto mb-4 flex items-center justify-center">
                      <Icon size={32} className="text-accent-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      {value.title}
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
