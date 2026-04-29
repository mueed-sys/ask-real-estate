import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { waLink } from '../../lib/whatsapp'

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_36px_-8px_rgba(37,211,102,0.65)] animate-pulse-gold rtl:right-auto rtl:left-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
    </motion.a>
  )
}
