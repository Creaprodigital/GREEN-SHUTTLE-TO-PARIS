import Header from './Header'
import Footer from './Footer'
import { Phone, EnvelopeSimple, MapPin, Clock } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { toast } from 'sonner'

interface ContactProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToHome?: () => void
  onNavigateToChauffeurPrive?: () => void
  onNavigateToAirportTransfer?: () => void
  onNavigateToCorporateEvent?: () => void
  onNavigateToEmbassyDelegation?: () => void
  onLogout?: () => void
  userEmail?: string
  isAdmin?: boolean
}

export default function Contact({
  onNavigateToLogin,
  onNavigateToHome,
  onNavigateToChauffeurPrive,
  onNavigateToAirportTransfer,
  onNavigateToCorporateEvent,
  onNavigateToEmbassyDelegation,
  onLogout,
  userEmail,
  isAdmin
}: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+33 1 XX XX XX XX',
      description: 'Du lundi au dimanche, 24h/24'
    },
    {
      icon: EnvelopeSimple,
      title: 'Email',
      content: 'contact@greenshuttle.fr',
      description: 'Réponse sous 24h'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: 'Paris, Île-de-France',
      description: 'France'
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: '24/7',
      description: 'Service disponible jour et nuit'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToChauffeurPrive={onNavigateToChauffeurPrive}
        onNavigateToAirportTransfer={onNavigateToAirportTransfer}
        onNavigateToCorporateEvent={onNavigateToCorporateEvent}
        onNavigateToEmbassyDelegation={onNavigateToEmbassyDelegation}
        onNavigateToHome={onNavigateToHome}
        onLogout={onLogout}
        userEmail={userEmail}
        isAdmin={isAdmin}
      />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Contactez-Nous
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions et organiser vos déplacements.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nom complet *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-card border-border"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-card border-border"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Téléphone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-card border-border"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Sujet *
                  </label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="bg-card border-border"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="bg-card border-border resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Envoyer le message
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                Informations de contact
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-6 bg-card border border-border"
                    >
                      <div className="w-12 h-12 bg-accent flex items-center justify-center shrink-0">
                        <Icon size={24} className="text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">
                          {info.title}
                        </h3>
                        <p className="text-lg text-foreground mb-1">
                          {info.content}
                        </p>
                        <p className="text-sm text-foreground/70">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 p-8 bg-accent">
                <h3 className="text-2xl font-bold text-accent-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Besoin d'une réponse rapide ?
                </h3>
                <p className="text-accent-foreground/90 mb-6">
                  Pour toute demande urgente ou réservation de dernière minute, n'hésitez pas à nous appeler directement. Notre service client est disponible 24h/24 et 7j/7.
                </p>
                <Button
                  variant="outline"
                  className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent"
                >
                  <Phone className="mr-2" size={18} />
                  Appeler maintenant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
