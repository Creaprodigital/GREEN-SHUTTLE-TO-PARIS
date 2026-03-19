import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface PrivacyProps {
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

export default function Privacy({
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
}: PrivacyProps) {
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
            Politique de Confidentialité
          </h1>

          <div className="space-y-8 text-foreground">
            <section>
              <p className="text-muted-foreground mb-6">
                <strong className="text-foreground">Date de mise à jour :</strong> [Date à compléter]
              </p>
              <p className="text-muted-foreground">
                ELGOH SARL s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons, protégeons et partageons vos données personnelles lorsque vous utilisez notre site internet et nos services de transport VTC.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                1. Responsable du traitement des données
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong className="text-foreground">ELGOH SARL</strong><br />
                  Siège social : [Adresse à compléter]<br />
                  SIRET : [Numéro SIRET à compléter]<br />
                  Email : contact@elgoh.fr<br />
                  Téléphone : +33 6 09 61 37 21
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                2. Données personnelles collectées
              </h2>
              <p className="text-muted-foreground mb-4">
                Nous collectons les données personnelles suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                <li><strong className="text-foreground">Données de facturation :</strong> adresse de facturation, informations de paiement</li>
                <li><strong className="text-foreground">Données de réservation :</strong> adresses de prise en charge et de destination, date et heure du trajet, type de véhicule</li>
                <li><strong className="text-foreground">Données de connexion :</strong> adresse IP, données de navigation, cookies</li>
                <li><strong className="text-foreground">Données de communication :</strong> échanges via email, téléphone ou formulaire de contact</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                3. Finalités du traitement
              </h2>
              <p className="text-muted-foreground mb-4">
                Vos données personnelles sont collectées et traitées pour les finalités suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Gestion de vos réservations et prestations de transport</li>
                <li>Facturation et paiement des services</li>
                <li>Communication avec vous concernant vos réservations</li>
                <li>Amélioration de nos services et de votre expérience utilisateur</li>
                <li>Envoi d'informations commerciales (avec votre consentement)</li>
                <li>Respect de nos obligations légales et réglementaires</li>
                <li>Gestion des réclamations et du service client</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                4. Base légale du traitement
              </h2>
              <p className="text-muted-foreground mb-4">
                Le traitement de vos données personnelles repose sur les bases légales suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Exécution du contrat :</strong> traitement nécessaire à la fourniture de nos services de transport</li>
                <li><strong className="text-foreground">Obligation légale :</strong> respect des obligations comptables et fiscales</li>
                <li><strong className="text-foreground">Consentement :</strong> envoi de communications marketing</li>
                <li><strong className="text-foreground">Intérêt légitime :</strong> amélioration de nos services et sécurité</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                5. Destinataires des données
              </h2>
              <p className="text-muted-foreground mb-4">
                Vos données personnelles peuvent être communiquées aux destinataires suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Nos chauffeurs, uniquement pour l'exécution de votre réservation</li>
                <li>Nos prestataires de services (paiement, hébergement web, outils de gestion)</li>
                <li>Les autorités administratives et judiciaires, sur demande légale</li>
                <li>Nos partenaires commerciaux, avec votre consentement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                6. Durée de conservation des données
              </h2>
              <p className="text-muted-foreground mb-4">
                Vos données personnelles sont conservées pendant les durées suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Données de réservation :</strong> 10 ans (obligations comptables)</li>
                <li><strong className="text-foreground">Données de facturation :</strong> 10 ans (obligations fiscales)</li>
                <li><strong className="text-foreground">Données marketing :</strong> 3 ans à compter du dernier contact</li>
                <li><strong className="text-foreground">Données de navigation :</strong> 13 mois maximum</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                7. Vos droits
              </h2>
              <p className="text-muted-foreground mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Droit d'accès :</strong> obtenir la confirmation que vos données sont traitées et accéder à vos données</li>
                <li><strong className="text-foreground">Droit de rectification :</strong> corriger vos données inexactes ou incomplètes</li>
                <li><strong className="text-foreground">Droit à l'effacement :</strong> supprimer vos données dans certaines conditions</li>
                <li><strong className="text-foreground">Droit à la limitation :</strong> limiter le traitement de vos données</li>
                <li><strong className="text-foreground">Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                <li><strong className="text-foreground">Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                <li><strong className="text-foreground">Droit de retirer votre consentement :</strong> à tout moment, sans affecter la licéité du traitement antérieur</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Pour exercer ces droits, contactez-nous par email à <strong className="text-foreground">contact@elgoh.fr</strong> ou par courrier à notre siège social.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                8. Sécurité des données
              </h2>
              <p className="text-muted-foreground">
                ELGOH met en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la destruction accidentelle ou illicite, la perte, l'altération, la divulgation ou l'accès non autorisé. Nos systèmes sont sécurisés et les données sensibles sont chiffrées.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                9. Cookies
              </h2>
              <p className="text-muted-foreground mb-4">
                Notre site utilise des cookies pour améliorer votre expérience de navigation et réaliser des statistiques de visite. Vous pouvez accepter ou refuser les cookies via les paramètres de votre navigateur.
              </p>
              <p className="text-muted-foreground">
                Les cookies utilisés sont :
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                <li><strong className="text-foreground">Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
                <li><strong className="text-foreground">Cookies de performance :</strong> pour analyser l'utilisation du site</li>
                <li><strong className="text-foreground">Cookies de préférence :</strong> pour mémoriser vos choix</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                10. Modification de la politique de confidentialité
              </h2>
              <p className="text-muted-foreground">
                ELGOH se réserve le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour. Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                11. Contact
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :
                </p>
                <p>
                  <strong className="text-foreground">Email :</strong> contact@elgoh.fr
                </p>
                <p>
                  <strong className="text-foreground">Téléphone :</strong> +33 6 09 61 37 21
                </p>
                <p>
                  <strong className="text-foreground">Courrier :</strong> ELGOH SARL, [Adresse à compléter]
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                12. Réclamation auprès de la CNIL
              </h2>
              <p className="text-muted-foreground">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
              </p>
              <p className="text-muted-foreground mt-3">
                <strong className="text-foreground">CNIL</strong><br />
                3 Place de Fontenoy<br />
                TSA 80715<br />
                75334 Paris Cedex 07<br />
                Téléphone : 01 53 73 22 22<br />
                Site web : www.cnil.fr
              </p>
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
