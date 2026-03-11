import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  Clock, 
  Car,
  CheckCircle
} from '@phosphor-icons/react'

interface ChauffeurPriveProps {
  onBackToHome: () => void
  onNavigateToAirportTransfer: () => void
  onNavigateToCorporateEvent: () => void
  onNavigateToEmbassyDelegation: () => void
}

export default function ChauffeurPrive({ 
  onBackToHome, 
  onNavigateToAirportTransfer,
  onNavigateToCorporateEvent,
  onNavigateToEmbassyDelegation
}: ChauffeurPriveProps) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const features = [
    {
      icon: <Car size={32} />,
      title: 'Service sur mesure',
      description: 'Un chauffeur privé dédié pour tous vos déplacements personnels ou professionnels'
    },
    {
      icon: <Clock size={32} />,
      title: 'Ponctualité garantie',
      description: 'Nos chauffeurs sont toujours à l\'heure pour assurer vos rendez-vous'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Discrétion & Confort',
      description: 'Un service premium dans des véhicules haut de gamme'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onNavigateToHome={onBackToHome}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
        onNavigateToCorporateEvent={onNavigateToCorporateEvent}
        onNavigateToEmbassyDelegation={onNavigateToEmbassyDelegation}
      />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              Chauffeur Privé
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Un service de chauffeur privé pour tous vos déplacements. Confort, discrétion et professionnalisme.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border hover:border-accent transition-all duration-300">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="flex justify-center mb-4 text-accent">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
