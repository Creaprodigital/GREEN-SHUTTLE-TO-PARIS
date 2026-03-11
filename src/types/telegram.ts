export interface TelegramSettings {
  enabled: boolean
  botToken: string
  chatId: string
}

export const DEFAULT_TELEGRAM_SETTINGS: TelegramSettings = {
  enabled: false,
  botToken: '',
  chatId: ''
}
