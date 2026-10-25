export const GROUP_WHATSAPP_NUMBER = '5554999902688'
export const GROUP_WHATSAPP_LABEL = '(54) 99990-2688'

export function whatsappUrl(message: string) {
  return `https://wa.me/${GROUP_WHATSAPP_NUMBER}?${new URLSearchParams({ text: message })}`
}
