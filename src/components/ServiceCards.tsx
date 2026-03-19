import { Airplane, Briefcase, MartiniGlass, Car, Check } from '@phosphor-icons/react'

export default function ServiceCards() {
  const services = [
    {
      icon: Airplane,
      title: 'Transferts aéroports et gares',
      description: 'Voyagez l\'esprit tranquille avec un chauffeur privé ponctuel pour vos transferts vers les principaux aéroports et gares :',
      items: [
        'Aéroport Charles de Gaulle',
        'Aéroport d\'Orly',
        'Gare de Lyon',
        'Gare du Nord'
      ],
      note: 'Votre chauffeur suit votre vol ou votre train afin de garantir une prise en charge ponctuelle et sans attente.'
    },
    {
      icon: Briefcase,
      title: 'Déplacements professionnels',
      description: 'Nous accompagnons les entreprises et les voyageurs d\'affaires pour leurs déplacements professionnels à Paris et en Île-de-France.',
      note: 'Nos chauffeurs assurent un service discret, fiable et confortable, idéal pour vos rendez-vous, séminaires et événements professionnels.'
    },
    {
      icon: MartiniGlass,
      title: 'Événements et sorties',
      description: 'Profitez pleinement de vos moments sans vous soucier du transport.',
      note: 'Restaurants, soirées, événements privés ou sorties nocturnes à Paris, votre chauffeur privé vous accompagne en toute sécurité.'
    },
    {
      icon: Car,
      title: 'Mise à disposition chauffeur',
      description: 'Besoin d\'un chauffeur pour plusieurs trajets ?',
      note: 'Nous proposons un service de mise à disposition de chauffeur privé à Paris pour quelques heures (minimum 3 heures) ou pour la journée.',
      items: [
        'Rendez-vous professionnels',
        'Shopping',
        'Visites touristiques',
        'Événements privés'
      ]
    }
  ]

  const advantages = [
    'Chauffeurs professionnels et bilingues',
    'Service disponible 24h/24 – 7j/7',
    'Véhicules récents et confortables',
    'Ponctualité et discrétion garanties',
    'Réservation simple et rapide'
  ]

  return (
    <div className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Chauffeur Privé pour tous vos déplacements
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
            Notre service de chauffeur privé à Paris s'adapte à tous vos besoins, que vous voyagiez pour affaires ou pour le plaisir.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="bg-card border border-border p-8 hover:border-accent/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-accent flex items-center justify-center shrink-0">
                    <Icon size={28} className="text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground pt-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {service.title}
                  </h3>
                </div>
                <p className="text-foreground/80 mb-4">
                  {service.description}
                </p>
                {service.items && (
                  <ul className="space-y-2 mb-4">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-foreground/70">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-foreground/70 italic text-sm border-l-2 border-accent pl-4 mt-4">
                  {service.note}
                </p>
              </div>
            )
          })}
        </div>

        <div className="bg-card border-2 border-accent p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-center" style={{ fontFamily: 'var(--font-display)' }}>
            Véloce Express : l'excellence du transport privé
          </h2>
          <p className="text-center text-foreground/80 mb-8 max-w-3xl mx-auto">
            Chez Véloce Express, nous mettons tout en œuvre pour offrir un service de chauffeur privé haut de gamme à Paris et en Île-de-France.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-center gap-3 text-foreground/90">
                <Check size={20} className="text-accent shrink-0" weight="bold" />
                <span>{advantage}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-foreground/80">
            Notre objectif est de vous offrir un service de transport fiable et premium pour tous vos déplacements.
          </p>
        </div>
      </div>
    </div>
  )
}
