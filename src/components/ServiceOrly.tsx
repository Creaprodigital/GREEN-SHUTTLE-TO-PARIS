import ServicePage from './ServicePage'

interface ServiceOrlyProps {
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

export default function ServiceOrly(props: ServiceOrlyProps) {
  return (
    <ServicePage
      {...props}
      title="Transfert Aéroport Orly ⇄ Paris"
      subtitle="Service VTC fiable et confortable entre Orly et Paris"
      heroImage="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=2000"
      description="Voyagez en toute sérénité entre l'Aéroport de Paris-Orly et Paris grâce à notre service de transfert VTC privé. Nous proposons un transport confortable, fiable et ponctuel pour vos déplacements depuis ou vers l'aéroport."
      features={[
        'Accueil personnalisé à l\'aéroport avec pancarte nominative',
        'Assistance pour vos bagages',
        'Véhicules confortables et climatisés',
        'Service fiable et ponctuel 24h/24',
        'Chauffeurs professionnels expérimentés',
        'Suivi de vol pour ajuster l\'horaire de prise en charge',
        'Réservation simple et rapide'
      ]}
      highlights={[
        {
          title: 'Transfert depuis Orly vers Paris',
          description: 'À votre arrivée à l\'Aéroport de Paris-Orly, votre chauffeur vous accueille directement au terminal et vous accompagne jusqu\'au véhicule.'
        },
        {
          title: 'Transfert de Paris vers Orly',
          description: 'Pour votre départ, votre chauffeur vient vous chercher à votre hôtel, domicile ou bureau à Paris avec un timing parfait.'
        },
        {
          title: 'Service premium',
          description: 'Trajets directs entre Paris et l\'aéroport d\'Orly avec véhicules modernes et confortables adaptés à vos besoins.'
        }
      ]}
    />
  )
}
