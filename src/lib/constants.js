// Single source of truth for ASK Real Estate brand & business constants.
// If you change these, every page auto-updates.

export const SITE_URL = 'https://askrealestate.bh'

export const BRAND = {
  legalName: 'ASK Real Estate W.L.L',
  shortName: 'ASK Real Estate',
  tagline: 'Your Trusted Property Partner in Bahrain',
  founded: 2016,
  rera: ['RERA Licensed', 'RICS Accredited'],
  accreditations: ['RERA', 'RICS', 'IVSC', 'ISO 9001'],
}

export const CONTACT = {
  phone: '+97317000000',
  phoneDisplay: '+973 1700 0000',
  whatsapp: '97317000000',
  whatsappDisplay: '+973 1700 0000',
  email: 'info@askrealestate.bh',
  instagram: 'askrealestatebh',
  instagramFollowers: 12000,
  instagramPosts: 1800,
}

export const OFFICE = {
  street: 'Building 865, Road 4618',
  road: 'Block 346, Seef District',
  city: 'Manama',
  country: 'Kingdom of Bahrain',
  full: 'Building 865, Road 4618, Block 346, Seef District, Manama, Bahrain',
  lat: 26.2154,
  lng: 50.5516,
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Seef+District+Manama+Bahrain',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582!2d50.5516!3d26.2154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSeef+District!5e0!3m2!1sen!2sbh!4v1714400000000',
}

export const STATS = {
  yearsExperience: 9,
  happyClients: 1200,
  propertiesListed: 500,
  aum: '4B+',
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
