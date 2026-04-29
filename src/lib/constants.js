// Single source of truth for IRE Bahrain brand & business constants.
// If you change these, every page auto-updates.

export const SITE_URL = 'https://irebahrain.com'

export const BRAND = {
  legalName: 'Istanbul Real Estate WLL',
  shortName: 'IRE Bahrain',
  founded: 2008,
  rera: ['B201806/0212', 'SA201807/0101'],
}

export const CONTACT = {
  phone: '+97366000009',
  phoneDisplay: '+973 6600 0009',
  whatsapp: '97339777724',
  whatsappDisplay: '+973 3977 7724',
  email: 'irebahrain@gmail.com',
  instagram: 'irebahrain',
  instagramFollowers: 24000,
  instagramPosts: 4000,
}

export const OFFICE = {
  street: 'Office 201, 15th Floor, Platinum Tower',
  road: '190 Road 2803, Seef',
  city: 'Manama',
  country: 'Kingdom of Bahrain',
  full: 'Office 201, 15th Floor, Platinum Tower, 190 Road 2803, Seef, Bahrain',
  // Approximate Platinum Tower coordinates
  lat: 26.2336,
  lng: 50.5469,
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Platinum+Tower+Seef+Bahrain',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.5567!2d50.5469!3d26.2336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPlatinum%20Tower%20Seef!5e0!3m2!1sen!2sbh!4v1714400000000',
}

export const STATS = {
  yearsExperience: 17,
  happyClients: 24000,
  propertiesListed: 4000,
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
