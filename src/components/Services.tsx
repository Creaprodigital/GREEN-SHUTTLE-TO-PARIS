import Header from './Header'
import Footer from './Footer'
interface ServicesProps {

interface ServicesProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToHome?: () => void
  onNavigateToServices?: () => void
  onNavigateToLogin,
  onNavigateToServices,
  onNavigateToContac
  isAdmin,
}: ServicesProps) {
 

      features: [
  onNavigateToLogin,
  onNavigateToHome,
  onNavigateToServices,
  onNavigateToAbout,
  onNavigateToContact,
  userEmail,
  isAdmin,
  onLogout
}: ServicesProps) {
  const services = [
    {
      icon: Car,
      title: 'Chauffeur Privé',
      description: 'Service de chauffeur privé disponible 24h/24 et 7j/7 pour tous vos déplacements en région parisienne et au-delà.',
      features: [
        'Disponibilité 24/7',
        'Véhicules de luxe',
        'Chauffeurs professionnels',
        'Service personnalisé'
      ]
  retu
    {
        onNavigateT
      title: 'Transfert Aéroports / Gares',
      description: 'Transferts vers tous les aéroports et gares de Paris et de la région. Service porte-à-porte avec suivi de vol en temps réel.',
      features: [
        'Suivi des vols',
        'Accueil personnalisé',
        'Assistance bagages',
        'Tarifs fixes'
       
    },
     
      icon: Users,
      title: 'Corporate & Événementiel',
      description: 'Solutions de transport premium pour vos événements professionnels, séminaires et réunions d\'affaires.',
      features: [
        'Flotte dédiée',
        'Planning personnalisé',
        'Facturation simplifiée',
        'Service multi-passagers'
      ]
      
    {
      icon: Building,
      title: 'Ambassades & Délégations',
      description: 'Service de transport protocolaire pour les ambassades et délégations officielles avec chauffeurs formés au protocole diplomatique.',
      features: [
        'Protocole diplomatique',
        'Sécurité renforcée',
      <Footer />
        'Disponibilité permanente'

    }


  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToHome={onNavigateToHome}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToContact={onNavigateToContact}

        isAdmin={isAdmin}
        onLogout={onLogout}
      />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Nos Services

            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Des solutions de transport premium adaptées à tous vos besoins, alliant confort, élégance et professionnalisme.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (

                  key={index}

                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-accent flex items-center justify-center shrink-0">
                      <Icon size={32} className="text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                        {service.title}
                      </h3>
                      <p className="text-foreground/70 mb-6">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-foreground/80">
                            <div className="w-1.5 h-1.5 bg-accent" />
                            {feature}
                          </li>
                        ))}

                    </div>

                </div>

            })}

        </div>



    </div>

}
