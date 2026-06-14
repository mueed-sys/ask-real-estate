// Single source of truth for ASK Real Estate brand & business constants.
export const SITE_URL = 'https://ask.msstech.ai'

export const BRAND = {
  legalName: 'ASK Real Estate W.L.L',
  shortName: 'ASK Real Estate',
  tagline: "Bahrain's Premier Real Estate & Asset Management Firm",
  founded: 2016,
  rera: ['RERA Licensed B202401/1232', 'RICS Accredited'],
  accreditations: ['RERA', 'RICS', 'IVSC', 'ISO 9001'],
  logo: '/ask-logo.png',
  favicon: '/ask-logo.png',
  pinCode: '2016',
}

export const CONTACT = {
  phone: '+97317211180',
  phoneDisplay: '+973 1721 1180',
  mobile: '+97336111323',
  mobileDisplay: '+973 3611 1323',
  whatsapp: '97336111323',
  whatsappDisplay: '+973 3611 1323',
  email: 'info@askre.com',
  website: 'askre.com',
  instagram: 'askrealestatebh',
  instagram2: 'askrealestatebahrain',
  linkedin: 'ask-real-estate',
  instagramFollowers: 15000,
  instagramPosts: 2100,
}

export const OFFICE = {
  street: 'Suite 802, 8th Floor, GFH Tower',
  area: 'Bahrain Harbour',
  city: 'Manama',
  country: 'Kingdom of Bahrain',
  full: 'Suite 802, 8th Floor, GFH Tower, Bahrain Harbour, Manama, Bahrain',
  lat: 26.2351,
  lng: 50.5758,
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=GFH+Tower+Bahrain+Harbour+Manama',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.5!2d50.5758!3d26.2351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sGFH+Tower!5e0!3m2!1sen!2sbh!4v1714400000000',
}

export const STATS = {
  yearsExperience: 9,
  happyClients: 1500,
  propertiesListed: 261,
  aum: '$3B+',
  awards: 2,
}

export const LOCALES = {
  en: { code: 'en', label: 'English', dir: 'ltr', short: 'EN' },
}

export const PROPERTY_TYPES = [
  { value: 'Apartment', icon: 'building-2' },
  { value: 'Villa', icon: 'home' },
  { value: 'Studio', icon: 'box' },
  { value: 'Penthouse', icon: 'crown' },
  { value: 'Commercial', icon: 'briefcase' },
  { value: 'Land', icon: 'map' },
]

export const BEDROOM_OPTIONS = ['Studio', '1', '2', '3', '4', '5+']
export const BATHROOM_OPTIONS = ['1', '2', '3', '4+']
export const PRICE_RANGE = { min: 0, max: 5000 }
