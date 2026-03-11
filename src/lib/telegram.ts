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

  let message = `<b>🔔 NOUVELLE RÉSERVATION</b>\n\n`
  message += `${statusEmoji[booking.status]} <b>Statut:</b> ${booking.status}\n`
  message += `${serviceTypeLabel}\n\n`
  
  message += `👤 <b>Client:</b> ${booking.firstName} ${booking.lastName}\n`
  message += `📧 <b>Email:</b> ${booking.userEmail}\n`
  message += `📱 <b>Téléphone:</b> ${booking.phone}\n\n`
  
  message += `📍 <b>Départ:</b> ${booking.pickup}\n`
  if (booking.destination) {
    message += `📍 <b>Arrivée:</b> ${booking.destination}\n`
  }
  message += `📅 <b>Date:</b> ${booking.date}\n`
  message += `🕐 <b>Heure:</b> ${booking.time}\n\n`
  
  if (booking.transferType === 'roundtrip' && booking.returnDate && booking.returnTime) {
    message += `🔄 <b>Retour:</b> ${booking.returnDate} à ${booking.returnTime}\n\n`
  }
  
  message += `🚙 <b>Véhicule:</b> ${booking.vehicleType}\n`
  message += `👥 <b>Passagers:</b> ${booking.passengers}\n`
  message += `🧳 <b>Bagages:</b> ${booking.luggage}\n\n`
  
  if (booking.selectedOptions && booking.selectedOptions.length > 0) {
    message += `✨ <b>Options:</b> ${booking.selectedOptions.join(', ')}\n\n`
  }
  
  message += `💰 <b>Prix:</b> ${booking.price ? booking.price.toFixed(2) : '0.00'}€\n`
  message += `💳 <b>Paiement:</b> ${booking.paymentMethod}\n\n`
  
  if (booking.notes) {
    message += `📝 <b>Notes:</b> ${booking.notes}\n\n`
  }
  
  message += `🆔 <b>ID Réservation:</b> ${booking.id}`
  
  return message
}
