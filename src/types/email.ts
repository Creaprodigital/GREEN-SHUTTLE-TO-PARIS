export interface EmailSettings {
  enabled: boolean
  adminEmail: string
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPassword: string
  fromEmail: string
  fromName: string
  sendConfirmationToClient: boolean
  sendNotificationToAdmin: boolean
  sendUpdatesToClient: boolean
}

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  enabled: false,
  adminEmail: '',
  smtpHost: '',
  smtpPort: '587',
  smtpUser: '',
  smtpPassword: '',
  fromEmail: 'noreply@greenshuttle.com',
  fromName: 'Green Shuttle To Paris',
  sendConfirmationToClient: true,
  sendNotificationToAdmin: true,
  sendUpdatesToClient: true
}

export interface EmailTemplate {
  subject: string
  body: string
}

export const EMAIL_TEMPLATES = {
  bookingConfirmation: {
    subject: 'Confirmation de votre réservation - Green Shuttle To Paris',
    getBody: (booking: any) => `
Bonjour ${booking.firstName} ${booking.lastName},

Nous vous confirmons votre réservation auprès de Green Shuttle To Paris.

DÉTAILS DE VOTRE RÉSERVATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Numéro de réservation : ${booking.id}
Type de service : ${getServiceTypeLabel(booking.serviceType)}
${booking.transferType === 'roundtrip' ? 'Type de transfert : Aller-Retour\n' : ''}

📍 ITINÉRAIRE
Départ : ${booking.pickup}
${booking.destination ? `Destination : ${booking.destination}` : ''}

📅 DATE & HEURE
Date : ${formatDate(booking.date)}
${booking.time ? `Heure : ${booking.time}` : ''}
${booking.returnDate && booking.transferType === 'roundtrip' ? `Date retour : ${formatDate(booking.returnDate)}` : ''}
${booking.returnTime && booking.transferType === 'roundtrip' ? `Heure retour : ${booking.returnTime}` : ''}

🚗 VÉHICULE
Type : ${booking.vehicleType}
Passagers : ${booking.passengers}
${booking.luggage ? `Bagages : ${booking.luggage}` : ''}

💶 TARIF
${booking.originalPrice && booking.discount ? `Prix initial : ${booking.originalPrice.toFixed(2)}€` : ''}
${booking.discount ? `Réduction : -${booking.discount.toFixed(2)}€` : ''}
${booking.promoCode ? `Code promo appliqué : ${booking.promoCode}` : ''}
Prix total : ${booking.price?.toFixed(2) || '0.00'}€

💳 MODE DE PAIEMENT
${getPaymentMethodLabel(booking.paymentMethod)}

${booking.notes ? `\n📝 NOTES\n${booking.notes}\n` : ''}

Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Green Shuttle To Paris
    `.trim()
  },
  
  bookingUpdate: {
    subject: 'Mise à jour de votre réservation - Green Shuttle To Paris',
    getBody: (booking: any, statusChange: string) => `
Bonjour ${booking.firstName} ${booking.lastName},

Votre réservation a été mise à jour.

Numéro de réservation : ${booking.id}
Nouveau statut : ${getStatusLabel(booking.status)}

${statusChange === 'confirmed' ? 'Votre réservation a été confirmée par notre équipe. Nous vous contacterons prochainement.' : ''}
${statusChange === 'cancelled' ? 'Votre réservation a été annulée. Si vous avez des questions, contactez-nous.' : ''}
${statusChange === 'completed' ? 'Merci d\'avoir utilisé nos services ! Nous espérons vous revoir bientôt.' : ''}

Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Green Shuttle To Paris
    `.trim()
  },

  adminNotification: {
    subject: 'Nouvelle réservation - Green Shuttle To Paris',
    getBody: (booking: any) => `
Nouvelle réservation reçue

DÉTAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ID : ${booking.id}
Client : ${booking.firstName} ${booking.lastName}
Email : ${booking.email}
Téléphone : ${booking.phone}

Service : ${getServiceTypeLabel(booking.serviceType)}
${booking.transferType === 'roundtrip' ? 'Type : Aller-Retour\n' : ''}

Départ : ${booking.pickup}
${booking.destination ? `Destination : ${booking.destination}` : ''}

Date : ${formatDate(booking.date)}
${booking.time ? `Heure : ${booking.time}` : ''}

Véhicule : ${booking.vehicleType}
Passagers : ${booking.passengers}
${booking.luggage ? `Bagages : ${booking.luggage}` : ''}

Prix : ${booking.price?.toFixed(2) || '0.00'}€
${booking.promoCode ? `Code promo : ${booking.promoCode}` : ''}

Paiement : ${getPaymentMethodLabel(booking.paymentMethod)}

${booking.notes ? `Notes : ${booking.notes}` : ''}
    `.trim()
  }
}

function getServiceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    transfer: 'Transfert',
    hourly: 'Mise à disposition',
    tour: 'Circuit touristique',
    shared: 'Transfert partagé'
  }
  return labels[type] || type
}

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    card: 'Carte bancaire',
    cash: 'Espèces',
    transfer: 'Virement bancaire'
  }
  return labels[method] || method
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    completed: 'Terminée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
