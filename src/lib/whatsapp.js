import { CONTACT } from './constants'

// Build a wa.me URL with a pre-filled message tailored to the inquiry context.
//
// Examples:
//   waLink()                         // generic
//   waLink({ text: 'Hello' })        // plain custom message
//   waLink({ property })             // property-specific message with title, location, price, ID
//   waLink({ agent })                // agent-specific message
//
// We keep the phone number in one place (CONTACT.whatsapp) so changing it later
// requires editing one file.

const PHONE = CONTACT.whatsapp

function encode(msg) {
  return encodeURIComponent(msg)
}

export function waLink({ text, property, agent } = {}) {
  if (property) {
    const msg = `Hi, I'm interested in ${property.title} in ${property.location} (BD ${property.price}/${property.price_period}) listed on your website. Reference: ${property.id}`
    return `https://wa.me/${PHONE}?text=${encode(msg)}`
  }
  if (agent) {
    const msg = `Hi ${agent.name}, I found you on the IRE Bahrain website and I'd like to discuss a property with you.`
    return `https://wa.me/${PHONE}?text=${encode(msg)}`
  }
  if (text) {
    return `https://wa.me/${PHONE}?text=${encode(text)}`
  }
  const fallback = "Hi, I found you on your website. I'm interested in learning more about available properties."
  return `https://wa.me/${PHONE}?text=${encode(fallback)}`
}

export const WHATSAPP_PHONE = PHONE
