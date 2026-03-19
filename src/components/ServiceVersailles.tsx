import ServicePage from './ServicePage'

interface ServiceVersaillesProps {
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

export default function ServiceVersailles(props: ServiceVersaillesProps) {
  return (
    <ServicePage
      {...props}
      title="Excursions Château de Versailles"
      subtitle="Découvrez le prestigieux Château de Versailles avec un chauffeur privé"
      heroImage="https://images.unsplash.com/photo-1599931468960-4f1e72ca8dd1?auto=format&fit=crop&q=80&w=2000"
      description="Profitez d'une excursion privée avec chauffeur pour visiter le prestigieux Château de Versailles. Évitez le stress des transports en commun et profitez d'une journée sur mesure, avec un chauffeur privé à votre disposition."
      features={[
        'Véhicules haut de gamme et climatisés',
        'Chauffeur professionnel, discret et ponctuel',
        'Flexibilité totale : vous choisissez vos horaires',
        'Arrêts pour photos dans les jardins et les alentours',
        'Prise en charge à votre hôtel, domicile ou bureau',
        'Service sur mesure pour particuliers et groupes',
        'Retour à Paris selon votre emploi du temps'
      ]}
      highlights={[
        {
          title: 'Transfert Direct',
          description: 'Trajet direct et confortable entre Paris et le Château de Versailles sans correspondances ni attentes.'
        },
        {
          title: 'Service Privé',
          description: 'Profitez d\'un service exclusif et personnalisé adapté à votre rythme et vos préférences.'
        },
        {
          title: 'Liberté Totale',
          description: 'Choisissez la durée de votre visite et vos arrêts photo dans les magnifiques jardins de Versailles.'
        },
        {
          title: 'Confort Premium',
          description: 'Voyagez dans des véhicules haut de gamme avec chauffeur expérimenté pour une journée sans stress.'
        },
        {
          title: 'Pour Tous',
          description: 'Idéal pour couples, familles, groupes d\'amis, touristes internationaux et voyageurs business.'
        },
        {
          title: 'Ponctualité Garantie',
          description: 'Commencez votre journée sans stress avec notre service ponctuel et fiable.'
        }
      ]}
      additionalSections={[
        {
          title: 'Comment fonctionne l\'excursion',
          content: `1. Réservez votre excursion en ligne ou via notre application
2. Le chauffeur vient vous chercher à votre hôtel, domicile ou bureau à Paris
3. Déplacez-vous confortablement jusqu'au Château de Versailles
4. Profitez de la visite à votre rythme, avec la liberté de choisir la durée de votre séjour
5. Retour à Paris dans un véhicule premium, selon votre emploi du temps`
        }
      ]}
    />
  )
}
