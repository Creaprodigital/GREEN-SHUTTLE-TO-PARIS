import { TelegramSettings } from '@/types/telegram'
import { Booking } from '@/types/booking'

export async function sendTelegramNotification(
  settings: TelegramSettings,
  booking: Booking
): Promise<boolean> {
  console.log('📱 Telegram notification - Starting...')
  console.log('Settings:', { 
    enabled: settings.enabled, 
    hasToken: !!settings.botToken, 
    hasChatId: !!settings.chatId,
    hasGroupChatId: !!settings.groupChatId 
  })

  if (!settings.enabled) {
    console.log('⚠️ Telegram notifications are disabled')
    return false
  }

  if (!settings.botToken) {
    console.error('❌ Telegram bot token is missing')
    return false
  }

  if (!settings.groupChatId && !settings.chatId) {
    console.error('❌ No chat ID or group chat ID configured')
    return false
  }

  try {
    const message = formatBookingMessage(booking)
    const url = `https://api.telegram.org/bot${settings.botToken}/sendMessage`
    
    console.log('📝 Message formatted, length:', message.length)
    console.log('🔗 Telegram API URL:', url.replace(settings.botToken, '[REDACTED]'))
    
    const chatIds = []
    if (settings.groupChatId) {
      chatIds.push(settings.groupChatId)
      console.log('📢 Using group chat ID:', settings.groupChatId)
    }
    if (settings.chatId) {
      chatIds.push(settings.chatId)
      console.log('💬 Using individual chat ID:', settings.chatId)
    }
    
    console.log(`📤 Sending to ${chatIds.length} recipient(s)...`)
    
    const results = await Promise.allSettled(
      chatIds.map(async (chatId, index) => {
        console.log(`Sending message ${index + 1}/${chatIds.length} to chat: ${chatId}`)
        
        const response = await fetch(url, {
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

        const data = await response.json()
        
        if (!response.ok) {
          console.error(`❌ Failed to send to ${chatId}:`, {
            status: response.status,
            statusText: response.statusText,
            error: data
          })
          throw new Error(`Telegram API error: ${data.description || response.statusText}`)
        }
        
        console.log(`✅ Successfully sent to ${chatId}`)
        return data
      })
    )

    const successCount = results.filter(r => r.status === 'fulfilled').length
    const failedCount = results.filter(r => r.status === 'rejected').length
    
    console.log(`📊 Results: ${successCount} successful, ${failedCount} failed`)
    
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed notification ${index + 1}:`, result.reason)
      }
    })
    
    if (successCount === 0) {
      console.error('❌ All Telegram notifications failed')
      return false
    }

    console.log('✅ Telegram notification completed successfully')
    return true
  } catch (error) {
    console.error('❌ Unexpected error sending Telegram notification:', error)
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
