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
  return (
    <footer className="bg-primary border-t-2 border-accent text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
              ELGOH
            </h3>
            <p className="text-muted-foreground text-sm font-light mb-4">
              Service de chauffeur privé VTC premium à Paris et en Île-de-France depuis 2010.
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
    </footer>
  )
}
