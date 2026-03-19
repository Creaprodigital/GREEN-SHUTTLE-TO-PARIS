import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface CGVProps {
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

export default function CGV({
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
}: CGVProps) {
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
            Conditions Générales de Vente
          </h1>

          <div className="space-y-8 text-foreground">
            <section>
              <p className="text-muted-foreground mb-6">
                <strong className="text-foreground">Date de mise à jour :</strong> [Date à compléter]
              </p>
              <p className="text-muted-foreground">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre ELGOH SARL et ses clients dans le cadre de la fourniture de services de transport de personnes par véhicules de tourisme avec chauffeur (VTC).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                1. Informations légales
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong className="text-foreground">ELGOH SARL</strong><br />
                  Siège social : [Adresse à compléter]<br />
                  SIRET : [Numéro SIRET à compléter]<br />
                  RCS : [Numéro RCS à compléter]<br />
                  Licence VTC : [Numéro de licence à compléter]<br />
                  Email : contact@elgoh.fr<br />
                  Téléphone : +33 6 09 61 37 21
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                2. Objet
              </h2>
              <p className="text-muted-foreground">
                Les présentes CGV ont pour objet de définir les droits et obligations des parties dans le cadre de la vente de prestations de transport de personnes par VTC. Toute réservation implique l'acceptation sans réserve des présentes CGV.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                3. Services proposés
              </h2>
              <p className="text-muted-foreground mb-4">
                ELGOH propose les services suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Transferts aéroports et gares (Charles de Gaulle, Orly, Beauvais, gares parisiennes)</li>
                <li>Déplacements professionnels et événementiels</li>
                <li>Mise à disposition de chauffeur avec ou sans véhicule</li>
                <li>Circuits touristiques (Versailles, vins et champagne, Normandie, Mont Saint-Michel)</li>
                <li>Transferts longue distance</li>
                <li>Transferts partagés (sous réserve de disponibilité)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                4. Réservation
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">4.1 Modalités de réservation</strong><br />
                  Les réservations peuvent être effectuées :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>En ligne via notre site internet</li>
                  <li>Par téléphone au +33 6 09 61 37 21</li>
                  <li>Par email à contact@elgoh.fr</li>
                </ul>
                
                <p>
                  <strong className="text-foreground">4.2 Confirmation de réservation</strong><br />
                  Toute réservation fait l'objet d'une confirmation par email avec les détails de la prestation (date, heure, lieu de prise en charge, destination, tarif, type de véhicule).
                </p>

                <p>
                  <strong className="text-foreground">4.3 Informations requises</strong><br />
                  Le client doit fournir les informations suivantes : nom, prénom, email, téléphone, adresse de prise en charge, destination, date et heure du trajet, nombre de passagers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                5. Tarifs et paiement
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">5.1 Tarification</strong><br />
                  Les tarifs sont indiqués en euros TTC. Ils sont calculés en fonction de la distance, de la durée, du type de véhicule et des éventuels suppléments (bagages, animaux, trajets de nuit).
                </p>

                <p>
                  <strong className="text-foreground">5.2 Devis</strong><br />
                  Un devis peut être établi sur demande. Il est valable 30 jours et devient caduc passé ce délai.
                </p>

                <p>
                  <strong className="text-foreground">5.3 Modalités de paiement</strong><br />
                  Le paiement peut être effectué :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>En ligne par carte bancaire (paiement sécurisé via Stripe)</li>
                  <li>À bord du véhicule par carte bancaire ou espèces</li>
                  <li>Par virement bancaire pour les entreprises (sous conditions)</li>
                </ul>

                <p>
                  <strong className="text-foreground">5.4 Facturation</strong><br />
                  Une facture est émise pour chaque prestation et envoyée par email au client. Les entreprises peuvent demander une facturation mensuelle.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                6. Modification et annulation
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">6.1 Modification de réservation</strong><br />
                  Toute modification doit être communiquée au moins 2 heures avant l'heure de prise en charge. Au-delà, la modification sera soumise à disponibilité et pourra entraîner un supplément.
                </p>

                <p>
                  <strong className="text-foreground">6.2 Annulation par le client</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Plus de 24 heures avant : annulation gratuite</li>
                  <li>Entre 24h et 2h avant : 50% du montant de la course</li>
                  <li>Moins de 2 heures avant : 100% du montant de la course</li>
                  <li>Absence du client (no-show) : 100% du montant de la course</li>
                </ul>

                <p>
                  <strong className="text-foreground">6.3 Annulation par ELGOH</strong><br />
                  En cas de force majeure ou d'impossibilité d'assurer la prestation, ELGOH s'engage à prévenir le client dans les meilleurs délais et à proposer une solution alternative. Si aucune solution n'est trouvée, le remboursement intégral sera effectué.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                7. Exécution du service
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">7.1 Prise en charge</strong><br />
                  Le chauffeur sera présent à l'heure et au lieu convenus. Pour les transferts aéroports, le chauffeur suit les vols en temps réel et adapte l'heure de prise en charge en cas de retard.
                </p>

                <p>
                  <strong className="text-foreground">7.2 Temps d'attente</strong><br />
                  Un temps d'attente gratuit de 15 minutes est accordé pour les prises en charge en ville et de 45 minutes pour les aéroports. Au-delà, un supplément peut être facturé.
                </p>

                <p>
                  <strong className="text-foreground">7.3 Bagages</strong><br />
                  Le transport de bagages standards est inclus. Des frais supplémentaires peuvent s'appliquer pour les bagages volumineux ou en surnombre.
                </p>

                <p>
                  <strong className="text-foreground">7.4 Comportement</strong><br />
                  Le client s'engage à adopter un comportement respectueux envers le chauffeur et le véhicule. ELGOH se réserve le droit de refuser le transport en cas de comportement inapproprié ou dangereux.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                8. Responsabilité
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">8.1 Assurance</strong><br />
                  ELGOH dispose d'une assurance responsabilité civile professionnelle couvrant les dommages causés aux tiers et aux passagers.
                </p>

                <p>
                  <strong className="text-foreground">8.2 Objets perdus</strong><br />
                  ELGOH décline toute responsabilité en cas de perte ou de vol d'objets personnels laissés dans les véhicules. En cas de découverte d'objets oubliés, ELGOH s'efforcera de les restituer au client.
                </p>

                <p>
                  <strong className="text-foreground">8.3 Retards</strong><br />
                  ELGOH met tout en œuvre pour respecter les horaires. Toutefois, en cas de retard dû à des circonstances indépendantes de notre volonté (trafic, accidents, conditions météorologiques), notre responsabilité ne pourra être engagée.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                9. Code promo et réductions
              </h2>
              <p className="text-muted-foreground">
                Des codes promotionnels peuvent être proposés ponctuellement. Ils sont soumis à conditions et ne sont pas cumulables sauf mention contraire. Les réductions pour trajets aller-retour sont appliquées automatiquement lors de la réservation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                10. Transferts partagés
              </h2>
              <p className="text-muted-foreground">
                Les transferts partagés permettent de partager un véhicule avec d'autres passagers ayant un trajet similaire. Le tarif est réduit mais le temps de trajet peut être légèrement rallongé en raison des arrêts intermédiaires. ELGOH se réserve le droit d'annuler un transfert partagé si le nombre minimum de passagers n'est pas atteint.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                11. Remboursements et litiges Stripe
              </h2>
              <p className="text-muted-foreground">
                En cas de contestation d'un paiement effectué par carte bancaire via Stripe, le client peut demander un remboursement dans les 14 jours suivant la prestation. ELGOH étudiera chaque demande et procédera au remboursement si elle est justifiée. Les litiges sont gérés conformément aux conditions générales de Stripe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                12. Données personnelles
              </h2>
              <p className="text-muted-foreground">
                Les données personnelles collectées sont traitées conformément à notre Politique de Confidentialité et au RGPD. Elles sont utilisées uniquement pour la gestion des réservations et l'amélioration de nos services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                13. Droit de rétractation
              </h2>
              <p className="text-muted-foreground">
                Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les prestations de transport dont la date d'exécution est déterminée. Les réservations sont donc fermes sous réserve des conditions d'annulation prévues à l'article 6.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                14. Réclamations
              </h2>
              <p className="text-muted-foreground">
                Toute réclamation doit être adressée par email à contact@elgoh.fr dans les 48 heures suivant la prestation. ELGOH s'engage à y répondre dans un délai de 7 jours ouvrés.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                15. Médiation
              </h2>
              <p className="text-muted-foreground">
                En cas de litige non résolu à l'amiable, le client peut saisir le médiateur de la consommation suivant :
              </p>
              <p className="text-muted-foreground mt-3">
                <strong className="text-foreground">[Nom du médiateur à compléter]</strong><br />
                [Adresse du médiateur]<br />
                [Email du médiateur]<br />
                [Site web du médiateur]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                16. Droit applicable et juridiction
              </h2>
              <p className="text-muted-foreground">
                Les présentes CGV sont régies par le droit français. En cas de litige et à défaut de solution amiable, les tribunaux français seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                17. Modification des CGV
              </h2>
              <p className="text-muted-foreground">
                ELGOH se réserve le droit de modifier les présentes CGV à tout moment. Les conditions applicables sont celles en vigueur au moment de la réservation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                18. Contact
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  Pour toute question concernant les présentes CGV :
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
