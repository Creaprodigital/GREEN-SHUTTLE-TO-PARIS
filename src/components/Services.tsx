import Header from './Header'
import Footer from './Footer'
import { Button } from '@/components/ui/button'
import { 
  Airplane, 
  MapTrifold, 
  Champagne, 
  GlobeHemisphereWest,
  Landmark,
  Briefcase,
  Sparkle,
  ArrowRight
} from '@phosphor-icons/react'

interface ServicesProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToClient?: () => void
  onNavigateToHome?: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
  onNavigateToService?: (serviceId: string) => void
  userEmail?: string
  isAdmin?: boolean
  onLogout?: () => void
}

export default function Services({
  onNavigateToLogin,
  onNavigateToClient,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  onNavigateToService,
  userEmail,
  isAdmin,
  onLogout
}: ServicesProps) {
  const services = [
    {
      id: 'cdg',
      icon: Airplane,
      title: 'Transfert Aéroport Charles de Gaulle',
      description: 'Voyagez sereinement entre l\'aéroport Charles de Gaulle (CDG) et Paris avec Véloce Express, votre service de chauffeur privé VTC.',
      features: [
        'Prise en charge rapide et personnalisée',
        'Suivi des vols en temps réel',
        'Véhicules haut de gamme',
        'Chauffeurs professionnels et expérimentés'
      ],
      tarif: 'à partir de 55€'
    },
    {
      id: 'orly',
      icon: Airplane,
      title: 'Transfert Aéroport Orly',
      description: 'Voyagez en toute sérénité entre l\'Aéroport de Paris-Orly et Paris grâce à notre service de transfert VTC privé.',
      features: [
        'Accueil personnalisé à l\'aéroport',
        'Assistance pour vos bagages',
        'Véhicules confortables et climatisés',
        'Service fiable et ponctuel'
      ]
    },
    {
      id: 'beauvais',
      icon: Airplane,
      title: 'Transfert Aéroport Paris-Beauvais',
      description: 'Voyagez confortablement entre l\'Aéroport de Paris-Beauvais et Paris (80 km) grâce à notre service de transfert VTC privé.',
      features: [
        'Trajet direct entre Paris et Beauvais',
        'Idéal pour compagnies low-cost',
        'Service disponible 24h/24 et 7j/7',
        'Planification adaptée au trafic'
      ]
    },
    {
      id: 'city-tour',
      icon: MapTrifold,
      title: 'City Tour Paris avec Chauffeur Privé',
      description: 'Découvrez la beauté de Paris grâce à un City Tour panoramique avec chauffeur privé de jour ou de nuit.',
      features: [
        'Tour Eiffel, Arc de Triomphe, Champs-Élysées',
        'Louvre, Notre-Dame, Montmartre',
        'Arrêts photos aux monuments',
        'Durée : 3 à 4 heures selon vos envies'
      ]
    },
    {
      id: 'events',
      icon: Briefcase,
      title: 'VTC pour Événements et Salons',
      description: 'Participez à vos événements professionnels en toute sérénité avec notre service VTC dédié aux salons à Paris.',
      features: [
        'Paris Expo Porte de Versailles',
        'Palais des Congrès de Paris',
        'Parc des Expositions Villepinte',
        'Mise à disposition avec chauffeur'
      ]
    },
    {
      id: 'versailles',
      icon: Landmark,
      title: 'Excursions Château de Versailles',
      description: 'Profitez d\'une excursion privée avec chauffeur pour visiter le prestigieux Château de Versailles.',
      features: [
        'Véhicules haut de gamme et climatisés',
        'Chauffeur professionnel, discret et ponctuel',
        'Flexibilité totale : vous choisissez vos horaires',
        'Arrêts pour photos dans les jardins'
      ]
    },
    {
      id: 'wine',
      icon: Champagne,
      title: 'Dégustation Vins et Champagne',
      description: 'Partez à la découverte des vignobles français avec un chauffeur privé (Champagne, Loire, Bourgogne).',
      features: [
        'Visite des maisons de champagne à Épernay et Reims',
        'Dégustations privées et conseils personnalisés',
        'Découverte des vignobles et châteaux',
        'Service sur mesure adapté à vos envies'
      ]
    },
    {
      id: 'normandy',
      icon: GlobeHemisphereWest,
      title: 'Transfert Privé vers la Normandie',
      description: 'Voyagez confortablement vers la Normandie avec notre service de chauffeur privé VTC (Deauville, Honfleur, Étretat, Mont Saint-Michel).',
      features: [
        'Départ depuis Paris ou les aéroports',
        'Véhicule confortable, climatisé et spacieux',
        'Service privé et flexible',
        'Possibilité de trajets aller-retour'
      ]
    },
    {
      id: 'mont-saint-michel',
      icon: GlobeHemisphereWest,
      title: 'Transfert Mont Saint-Michel',
      description: 'Découvrez le Mont Saint-Michel, l\'un des sites les plus emblématiques de France, avec notre chauffeur privé VTC.',
      features: [
        'Paris → Mont Saint-Michel : environ 3h30 à 4h',
        'Arrêts possibles sur demande',
        'Véhicules premium pour un confort maximal',
        'Service flexible selon vos besoins'
      ]
    },
    {
      id: 'long-distance',
      icon: GlobeHemisphereWest,
      title: 'Transferts Longue Distance',
      description: 'Voyagez sur de longues distances avec notre service de chauffeur privé VTC (Bruxelles, Luxembourg, Marseille, Lyon).',
      features: [
        'Trajets directs sans correspondances',
        'Véhicules adaptés aux longues distances',
        'Flexibilité pour pauses et arrêts',
        'Idéal pour voyageurs d\'affaires et familles'
      ]
    },
    {
      id: 'travel-agency',
      icon: Briefcase,
      title: 'VTC pour Agence de Voyage',
      description: 'Partenariat de transport fiable pour vos clients : transferts aéroports, excursions touristiques, trajets longue distance.',
      features: [
        'Service ponctuel et sécurisé',
        'Véhicules adaptés aux groupes',
        'Collaboration transparente',
        'Tarification claire'
      ]
    },
    {
      id: 'fashion-week',
      icon: Sparkle,
      title: 'VTC Premium Fashion Week Paris',
      description: 'Transport VIP pendant la Fashion Week avec service ponctuel, sécurisé et confortable pour défilés et soirées.',
      features: [
        'Transferts aéroports et gares',
        'Déplacements VIP pendant la Fashion Week',
        'Véhicules premium avec Wi-Fi',
        'Service personnalisé et discret'
      ]
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
        userEmail={userEmail}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Nos Services
            </h1>
            <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
              Des solutions de transport premium adaptées à tous vos besoins, alliant confort, élégance et professionnalisme.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className="bg-card border border-border p-6 hover:border-accent/50 transition-all duration-300 group flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon size={24} className="text-accent-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-foreground/70 mb-4 text-sm flex-grow">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-foreground/80 text-sm">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {service.tarif && (
                    <div className="mb-4 pb-4 border-b border-border">
                      <p className="text-accent font-semibold">{service.tarif}</p>
                    </div>
                  )}
                  <Button
                    onClick={() => onNavigateToService?.(service.id)}
                    variant="outline"
                    className="w-full border-accent text-foreground hover:bg-accent hover:text-accent-foreground group/btn"
                  >
                    En savoir plus
                    <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
