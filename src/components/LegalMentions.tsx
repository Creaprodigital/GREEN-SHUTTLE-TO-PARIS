import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface LegalMentionsProps {
  onNavigateToLogin: (isAdmin: boolean) => void
  onNavigateToClient: () => void
  onNavigateToHome: () => void
  onNavigateToServices: () => void
  onNavigateToAbout: () => void
  onNavigateToContact: () => void
  onNavigateToService: (serviceId: string) => void
  onNavigateToLegalMentions?: () => void
  onNavigateToPrivacy?: () => void
  onNavigateToCGV?: () => void
  userEmail?: string
  isAdmin?: boolean
  onLogout: () => void
}

export default function LegalMentions({
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
  onLogout
}: LegalMentionsProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <main className="flex-1 pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
            Mentions Légales
          </h1>

          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                1. Informations légales
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Raison sociale :</strong> ELGOH SARL
                </p>
                <p>
                  <strong className="text-foreground">Forme juridique :</strong> Société à Responsabilité Limitée (SARL)
                </p>
                <p>
                  <strong className="text-foreground">Capital social :</strong> [À compléter]
                </p>
                <p>
                  <strong className="text-foreground">Siège social :</strong> [Adresse complète à compléter]
                </p>
                <p>
                  <strong className="text-foreground">SIRET :</strong> [Numéro SIRET à compléter]
                </p>
                <p>
                  <strong className="text-foreground">RCS :</strong> [Numéro RCS à compléter]
                </p>
                <p>
                  <strong className="text-foreground">N° TVA intracommunautaire :</strong> [Numéro TVA à compléter]
                </p>
                <p>
                  <strong className="text-foreground">Licence VTC :</strong> [Numéro de licence à compléter]
                </p>
                <p>
                  <strong className="text-foreground">Immatriculation Registre des Transporteurs :</strong> [Numéro à compléter]
                </p>
                <p>
                  <strong className="text-foreground">Téléphone :</strong> +33 6 09 61 37 21
                </p>
                <p>
                  <strong className="text-foreground">Email :</strong> contact@elgoh.fr
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                2. Directeur de la publication
              </h2>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Directeur de la publication :</strong> [Nom du directeur à compléter]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                3. Hébergement du site
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Le site est hébergé par :
                </p>
                <p>
                  <strong className="text-foreground">[Nom de l'hébergeur]</strong><br />
                  [Adresse de l'hébergeur]<br />
                  [Téléphone de l'hébergeur]
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                4. Propriété intellectuelle
              </h2>
              <p className="text-muted-foreground">
                L'ensemble du contenu de ce site (textes, images, logos, graphismes, vidéos, icônes, sons, logiciels, etc.) est la propriété exclusive de ELGOH SARL ou de ses partenaires. Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord écrit de ELGOH SARL.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                5. Protection des données personnelles
              </h2>
              <p className="text-muted-foreground">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant. Pour exercer ces droits, vous pouvez nous contacter à l'adresse : contact@elgoh.fr
              </p>
              <p className="text-muted-foreground mt-3">
                Pour plus d'informations, consultez notre{' '}
                <span className="text-accent underline cursor-pointer hover:text-accent/80">
                  Politique de Confidentialité
                </span>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                6. Cookies
              </h2>
              <p className="text-muted-foreground">
                Le site ELGOH peut être amené à utiliser des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. Vous pouvez à tout moment désactiver ces cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                7. Responsabilité
              </h2>
              <p className="text-muted-foreground">
                ELGOH s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, dont elle se réserve le droit de corriger le contenu à tout moment et sans préavis. Toutefois, ELGOH ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                8. Loi applicable
              </h2>
              <p className="text-muted-foreground">
                Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                9. Contact
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  Pour toute question concernant les mentions légales, vous pouvez nous contacter :
                </p>
                <p>
                  <strong className="text-foreground">Par téléphone :</strong> +33 6 09 61 37 21
                </p>
                <p>
                  <strong className="text-foreground">Par email :</strong> contact@elgoh.fr
                </p>
              </div>
            </section>
          </div>
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
