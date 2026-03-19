import ServicePage from './ServicePage'

interface ServiceCDGProps {
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

export default function ServiceCDG(props: ServiceCDGProps) {
  return (
    <ServicePage
      {...props}
      title="Transfert Aéroport Charles de Gaulle"
      subtitle="Voyagez sereinement entre l'aéroport CDG et Paris avec notre service VTC premium"
      heroImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000"
      description="Véloce Express vous garantit un transfert ponctuel, confortable et sécurisé entre l'aéroport Charles de Gaulle et Paris. Que ce soit pour un déplacement professionnel ou personnel, profitez d'un service haut de gamme avec chauffeur expérimenté."
      features={[
        'Prise en charge rapide et personnalisée avec panneau nominatif',
        'Suivi des vols en temps réel pour ajuster l\'heure de départ',
        'Véhicules haut de gamme : berlines élégantes et vans spacieux',
        'Chauffeurs professionnels bilingues (français/anglais)',
        'Service sur mesure avec prise en charge des bagages',
        'Trajet direct et confortable vers votre destination',
        'Service disponible 24h/24 et 7j/7'
      ]}
      pricing="à partir de 55€"
      highlights={[
        {
          title: 'Prise en charge personnalisée',
          description: 'Votre chauffeur vous attend à la sortie de l\'aéroport avec un panneau à votre nom pour un accueil chaleureux et professionnel.'
        },
        {
          title: 'Suivi en temps réel',
          description: 'Nous suivons votre vol en direct et ajustons l\'heure de prise en charge même en cas de retard, pour votre tranquillité d\'esprit.'
        },
        {
          title: 'Confort premium',
          description: 'Voyagez dans des véhicules haut de gamme récents, climatisés, avec espace généreux pour vos bagages.'
        },
        {
          title: 'Chauffeurs expérimentés',
          description: 'Nos chauffeurs sont ponctuels, courtois et parlent anglais pour accompagner les voyageurs internationaux.'
        },
        {
          title: 'Tarif fixe garanti',
          description: 'Prix connu à l\'avance, sans surprise. Le tarif reste le même même en cas de retard ou embouteillages.'
        },
        {
          title: 'Réservation simple',
          description: 'Réservez en ligne en quelques clics et recevez immédiatement votre confirmation avec les détails du chauffeur.'
        }
      ]}
      additionalSections={[
        {
          title: 'Comment réserver votre transfert CDG',
          content: `1. Calculez votre trajet avec notre calculateur en ligne
2. Renseignez vos coordonnées : nom, téléphone, email
3. Confirmez votre réservation et recevez immédiatement le nom de votre chauffeur et les détails du véhicule
4. Profitez d'un transfert serein et confortable`
        },
        {
          title: 'Services complémentaires',
          content: `• Transferts vers tous les aéroports et gares d'Île-de-France
• Trajets privés et professionnels à Paris et en région parisienne
• Mise à disposition de chauffeur pour la journée ou demi-journée
• Service premium pour événements, séminaires et visites touristiques`
        }
      ]}
    />
  )
}
