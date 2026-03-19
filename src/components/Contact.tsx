import { useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Phone, EnvelopeSimple, MapPin, Clock, InstagramLogo } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ContactProps {
  onNavigateToLogin?: (isAdmin: boolean) => void
  onNavigateToClient?: () => void
  onNavigateToHome?: () => void
  onNavigateToServices?: () => void
  onNavigateToAbout?: () => void
  onNavigateToContact?: () => void
  onNavigateToService?: (serviceId: string) => void
  onNavigateToLegalMentions?: () => void
  onNavigateToPrivacy?: () => void
  onNavigateToCGV?: () => void
  onLogout?: () => void
  userEmail?: string
  isAdmin?: boolean
}

export default function Contact({
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
  onLogout,
  userEmail,
  isAdmin
}: ContactProps) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      message: ''
    })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      content: 'Paris, Île-de-France'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+33 6 09 61 37 21'
    },
    {
      icon: EnvelopeSimple,
      title: 'Email',
      content: 'contact@elgoh.fr'
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: 'Service disponible 24h/24 - 7j/7'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToClient={onNavigateToClient}
        onNavigateToHome={onNavigateToHome}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAbout={onNavigateToAbout}
        onNavigateToContact={onNavigateToContact}
        onNavigateToService={onNavigateToService}
        onLogout={onLogout}
        userEmail={userEmail}
        isAdmin={isAdmin}
      />
      
      <div 
        className="relative h-[400px] bg-cover bg-center pt-20"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)),
            url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000')
          `
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Contactez-nous
            </h1>
            <div className="w-24 h-0.5 bg-accent mx-auto mb-4" />
            <p className="text-lg text-white/90 max-w-2xl mx-auto px-4">
              Nous sommes là pour répondre à toutes vos questions et organiser vos trajets sur mesure
            </p>
          </div>
        </div>
      </div>
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                Nos coordonnées
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div key={index} className="flex items-start gap-4 bg-card border border-border p-6">
                      <div className="w-12 h-12 bg-accent flex items-center justify-center shrink-0">
                        <Icon size={24} className="text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                        <p className="text-foreground/70">{info.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 bg-card border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <InstagramLogo size={24} className="text-accent" />
                  Réseaux sociaux
                </h3>
                <p className="text-foreground/70 mb-4">
                  Suivez-nous pour être informé de nos offres et nouveautés
                </p>
                <div className="space-y-2">
                  <p className="text-foreground/80">Instagram : @veloce_express</p>
                  <p className="text-foreground/80">TikTok : @veloce_express</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                Formulaire de contact
              </h2>
              <form onSubmit={handleSubmit} className="bg-card border border-border p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom" className="text-foreground">Nom *</Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                      className="bg-background border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom" className="text-foreground">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      required
                      className="bg-background border-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-foreground">Téléphone *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    required
                    className="bg-background border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="bg-background border-input resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Envoyer
                </Button>
              </form>
            </div>
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
