import ServicePage from './ServicePage'

interface ServiceCityTourProps {
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

export default function ServiceCityTour(props: ServiceCityTourProps) {
  return (
    <ServicePage
      {...props}
      title="City Tour Paris avec Chauffeur Privé"
      subtitle="Découvrez la beauté de Paris de jour ou de nuit"
      heroImage="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=2000"
      description="Découvrez la beauté de Paris grâce à un City Tour panoramique avec chauffeur privé. Profitez d'une visite confortable à bord d'un véhicule haut de gamme pour explorer les monuments emblématiques de la capitale française."
      features={[
        'Tour Eiffel, Arc de Triomphe et Champs-Élysées',
        'Musée du Louvre et Cathédrale Notre-Dame',
        'Montmartre et Basilique du Sacré-Cœur',
        'Quais de la Seine et ponts historiques',
        'Arrêts photos aux monuments emblématiques',
        'Visite panoramique sans guide',
        'Durée : 3 à 4 heures selon vos envies',
        'Disponible de jour ou de nuit'
      ]}
      highlights={[
        {
          title: 'City Tour de Jour',
          description: 'Admirez l\'architecture, les grandes avenues et les places historiques de Paris. Votre chauffeur peut prévoir des arrêts photos aux monuments emblématiques.'
        },
        {
          title: 'City Tour de Nuit',
          description: 'Paris est mondialement connue comme la Ville Lumière. Admirez les monuments illuminés : Tour Eiffel, Arc de Triomphe, et les lumières des Champs-Élysées.'
        },
        {
          title: 'Service Premium',
          description: 'Véhicule haut de gamme climatisé, chauffeur professionnel expérimenté, visite panoramique personnalisable à votre rythme.'
        },
        {
          title: 'Flexibilité Totale',
          description: 'Vous choisissez vos horaires, la durée de votre visite et les arrêts que vous souhaitez faire.'
        },
        {
          title: 'Départ Flexible',
          description: 'Prise en charge à votre hôtel, gare ou aéroport. Nous assurons également les transferts après votre visite.'
        },
        {
          title: 'Pour Tous',
          description: 'Véhicules adaptés pour 1 à 6 passagers, parfaits pour couples, familles ou groupes.'
        }
      ]}
      additionalSections={[
        {
          title: 'Sites Incontournables',
          content: `Notre City Tour Paris panoramique vous emmène à travers :

• La célèbre Tour Eiffel
• L'impressionnant Arc de Triomphe
• L'avenue mythique des Champs-Élysées
• Le prestigieux Musée du Louvre
• La magnifique Cathédrale Notre-Dame
• Le quartier historique de Montmartre
• La Basilique du Sacré-Cœur
• Les quais romantiques de la Seine`
        }
      ]}
    />
  )
}
