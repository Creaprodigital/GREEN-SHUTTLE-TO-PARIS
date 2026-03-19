import { Separator } from '@/components/ui/separator'
import { Phone, Envelope, InstagramLogo } from '@phosphor-icons/react'

interface FooterProps {
  onNavigateToLegalMentions?: () => void
  onNavigateToPrivacy?: () => void
  onNavigateToCGV?: () => void
}

export default function Footer({ 
  onNavigateToLegalMentions, 
  onNavigateToPrivacy, 
  onNavigateToCGV 
}: FooterProps = {}) {
  const cities = [
    'Paris', 'Versailles', 'Saint-Denis', 'Montreuil', 'Boulogne-Billancourt',
    'Nanterre', 'Créteil', 'Argenteuil', 'Colombes', 'Aulnay-sous-Bois',
    'Saint-Maur-des-Fossés', 'Rueil-Malmaison', 'Aubervilliers', 'Champigny-sur-Marne', 'Asnières-sur-Seine',
    'Courbevoie', 'Vitry-sur-Seine', 'Levallois-Perret', 'Issy-les-Moulineaux', 'Neuilly-sur-Seine',
    'Clichy', 'Antony', 'Noisy-le-Grand', 'Suresnes', 'Clamart',
    'Fontenay-sous-Bois', 'Maisons-Alfort', 'Pantin', 'Sevran', 'Ivry-sur-Seine',
    'Villejuif', 'Épinay-sur-Seine', 'Meaux', 'Saint-Germain-en-Laye', 'Poissy',
    'Évry', 'Cergy', 'Pontoise', 'Melun', 'Corbeil-Essonnes',
    'Sarcelles', 'Mantes-la-Jolie', 'Vincennes', 'Drancy', 'Bondy'
  ]

  const column1 = cities.slice(0, 15)
  const column2 = cities.slice(15, 30)
  const column3 = cities.slice(30, 45)

  return (
    <footer className="bg-primary text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Chauffeur Privé en Île-de-France
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <ul className="space-y-3">
                {column1.map((city) => (
                  <li key={city} className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">
                    Chauffeur privé {city}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                {column2.map((city) => (
                  <li key={city} className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">
                    Chauffeur privé {city}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                {column3.map((city) => (
                  <li key={city} className="text-sm text-muted-foreground hover:text-accent transition-colors font-light">
                    Chauffeur privé {city}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-border mb-12" />
      </div>

      <div className="border-t-2 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
              ELGOH
            </h3>
            <p className="text-muted-foreground text-sm font-light mb-4">
              Service de chauffeur privé premium à Paris et en Île-de-France depuis 2010.
            </p>
            <div className="space-y-2">
              <a 
                href="tel:+33609613721" 
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors font-medium"
              >
                <Phone size={20} weight="fill" />
                <span>+33 6 09 61 37 21</span>
              </a>
              <a 
                href="mailto:contact@elgoh.fr" 
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors font-medium"
              >
                <Envelope size={20} weight="fill" />
                <span>contact@elgoh.fr</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4 uppercase tracking-widest text-sm">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-light">
              <li className="hover:text-accent transition-colors cursor-pointer">Transferts Aéroports</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Déplacements Professionnels</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Événements & Sorties</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Mise à Disposition</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Circuits Touristiques</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Longue Distance</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 uppercase tracking-widest text-sm">À Propos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-light">
              <li className="hover:text-accent transition-colors cursor-pointer">Qui sommes-nous</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Nos valeurs</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Notre flotte</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Nos chauffeurs</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 uppercase tracking-widest text-sm">Suivez-nous</h4>
            <div className="space-y-3">
              <a 
                href="#" 
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors font-medium"
              >
                <InstagramLogo size={20} weight="fill" />
                <span>Instagram</span>
              </a>
              <p className="text-sm text-muted-foreground font-light">
                Service disponible 24h/24 - 7j/7
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-border mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-light">
          <p>&copy; 2010-2024 ELGOH. Tous droits réservés.</p>
          <div className="flex gap-6">
            <span 
              onClick={onNavigateToLegalMentions}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              Mentions légales
            </span>
            <span 
              onClick={onNavigateToPrivacy}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              Confidentialité
            </span>
            <span 
              onClick={onNavigateToCGV}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              CGV
            </span>
          </div>
        </div>
        </div>
      </div>
    </footer>
  )
}
