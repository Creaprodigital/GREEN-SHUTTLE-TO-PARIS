import { TelegramSettings } from '@/types/telegram'
import { Booking } from '@/types/booking'

export async function sendTelegramNotification(
  settings: TelegramSettings,
  booking: Booking
): Promise<boolean> {
  if (!settings.enabled || !settings.botToken) {
    return false
  }

  if (!settings.chatId && !settings.groupChatId) {
    return false
  }

  try {
    const message = formatBookingMessage(booking)
    const url = `https://api.telegram.org/bot${settings.botToken}/sendMessage`
    
    const chatIds = [settings.chatId, settings.groupChatId].filter(Boolean)
    
    const results = await Promise.allSettled(
      chatIds.map(chatId =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
          }),
        })
      )
    )

    const successCount = results.filter(r => r.status === 'fulfilled').length
    
    if (successCount === 0) {
      console.error('All Telegram notifications failed')
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    return false
  }
}

function formatBookingMessage(booking: Booking): string {
  const serviceTypeLabel = booking.serviceType === 'transfer' ? '🚗 Transfert' : '🗺️ Circuit'
  const statusEmoji = {
    pending: '⏳',
    confirmed: '✅',
    completed: '🏁',
    cancelled: '❌'
  }

  const paymentLabels = {
    card: '💳 Carte bancaire',
    cash: '💵 Espèces',
    transfer: '🏦 Virement'
  }

  let message = `━━━━━━━━━━━━━━━━━━━━━\n`
  message += `<b>🔔 NOUVELLE RÉSERVATION</b>\n`
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`
  
  message += `${statusEmoji[booking.status]} <b>Statut:</b> <code>${booking.status.toUpperCase()}</code>\n`
  message += `${serviceTypeLabel}\n`
  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`
  message += `<b>👤 INFORMATIONS CLIENT</b>\n`
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`
  
  message += `<b>Nom:</b> ${booking.firstName} ${booking.lastName}\n`
  message += `<b>Email:</b> ${booking.userEmail}\n`
  message += `<b>Téléphone:</b> ${booking.phone}\n`
  
  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`
  message += `<b>📍 TRAJET</b>\n`
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`
  
  message += `<b>Départ:</b>\n${booking.pickup}\n\n`
  if (booking.destination) {
    message += `<b>Arrivée:</b>\n${booking.destination}\n\n`
  }
  message += `📅 <b>Date:</b> ${booking.date}\n`
  message += `🕐 <b>Heure:</b> ${booking.time}\n`
  
  if (booking.transferType === 'roundtrip' && booking.returnDate && booking.returnTime) {
    message += `\n🔄 <b>Retour:</b> ${booking.returnDate} à ${booking.returnTime}\n`
  }
  
  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`
  message += `<b>🚙 DÉTAILS DU SERVICE</b>\n`
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`
  
  message += `<b>Véhicule:</b> ${booking.vehicleType}\n`
  message += `👥 <b>Passagers:</b> ${booking.passengers}\n`
  if (booking.luggage) {
    message += `🧳 <b>Bagages:</b> ${booking.luggage}\n`
  }
  
  if (booking.selectedOptions && booking.selectedOptions.length > 0) {
    message += `\n✨ <b>Options supplémentaires:</b>\n`
    booking.selectedOptions.forEach(option => {
      message += `  • ${option}\n`
    })
  }
  
  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`
  message += `<b>💰 PAIEMENT</b>\n`
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`
  
  message += `<b>Prix total:</b> <b>${booking.price ? booking.price.toFixed(2) : '0.00'}€</b>\n`
  message += `<b>Mode de paiement:</b> ${paymentLabels[booking.paymentMethod] || booking.paymentMethod}\n`
  
  if (booking.notes) {
    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`
    message += `<b>📝 NOTES</b>\n`
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`
    message += `${booking.notes}\n`
  }
  
  message += `\n━━━━━━━━━━━━━━━━━━━━━\n`
  message += `🆔 <code>${booking.id}</code>\n`
  message += `━━━━━━━━━━━━━━━━━━━━━`
  
  return message
}
