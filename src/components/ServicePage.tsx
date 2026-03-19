import Header from './Header'
import Footer from './Footer'
import BookingForm from './BookingForm'
import { Button } from '@/components/ui/button'
import { Check } from '@phosphor-icons/react'

interface ServicePageProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToClient?: () => void
  onNavigateToHome?: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
  onNavigateToService?: (serviceId: string) => void
  onNavigateToLegalMentions?: () => void
  onNavigateToPrivacy?: () => void
  onNavigateToCGV?: () => void
  userEmail?: string
  isAdmin?: boolean
  onLogout?: () => void
  
  title: string
  subtitle: string
  heroImage: string
  description: string
  features: string[]
  pricing?: string
  highlights?: Array<{ title: string; description: string }>
  additionalSections?: Array<{ title: string; content: string }>
}

export default function ServicePage({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  onNavigateToService,
  onNavigateToLegalMentions,
  onNavigateToPrivacy,
  onNavigateToCGV,
  userEmail,
  isAdmin,
  onLogout,
  title,
  subtitle,
  heroImage,
  description,
  features,
  pricing,
  highlights,
  additionalSections
}: ServicePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToClient={onNavigateToClient}
        onNavigateToHome={onNavigateToHome}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToContact={onNavigateToContact}
        onNavigateToService={onNavigateToService}
        userEmail={userEmail}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />

      <main className="pt-32">
        <div 
          className="relative h-[400px] sm:h-[500px] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroImage})`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                À propos de ce service
              </h2>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                {description}
              </p>
              
              <div className="space-y-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={16} weight="bold" className="text-accent-foreground" />
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>

              {pricing && (
                <div className="mt-8 p-6 bg-accent/10 border border-accent/30">
                  <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    Tarification
                  </h3>
                  <p className="text-2xl font-bold text-accent">{pricing}</p>
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="bg-card border border-border p-6">
                <h3 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Réservez ce service
                </h3>
                <p className="text-foreground/70 mb-6">
                  Utilisez notre calculateur pour obtenir instantanément le tarif exact de votre trajet.
                </p>
                <BookingForm inline />
              </div>
            </div>
          </div>

          {highlights && highlights.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: 'var(--font-display)' }}>
                Pourquoi choisir ce service
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="bg-card border border-border p-6 hover:border-accent/50 transition-all">
                    <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      {highlight.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {additionalSections && additionalSections.length > 0 && (
            <div className="space-y-12">
              {additionalSections.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-3xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                    {section.title}
                  </h2>
                  <div className="prose prose-lg max-w-none text-foreground/70">
                    <p className="leading-relaxed whitespace-pre-line">{section.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer 
        onNavigateToLegalMentions={onNavigateToLegalMentions}
        onNavigateToPrivacy={onNavigateToPrivacy}
        onNavigateToCGV={onNavigateToCGV}
      />
    </div>
  )
}
