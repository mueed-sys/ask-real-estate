import { useState, useRef, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { X, Download, Copy, Instagram, Check } from 'lucide-react'
import { BRAND } from '../../lib/constants'

// Renders a 1080×1080 IRE-branded Instagram card from a property record.
// Live HTML preview drives html2canvas → PNG download. Caption + hashtags are
// generated in-component from the listing fields.
export default function InstagramPostGenerator({ property, open, onClose }) {
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) { setCopied(false); setDownloading(false) }
  }, [open])

  if (!property) return null

  const period = property.purpose === 'rent' ? '/month' : 'total'
  const caption = buildCaption(property)

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        useCORS: true,
        scale: 2,
        width: 1080,
        height: 1080,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `IRE-${property.id}-instagram.png`
      a.click()
    } catch (e) {
      console.error('IG export failed', e)
    } finally {
      setDownloading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {/* noop */}
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/80 px-4 py-12 backdrop-blur-md"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-ink-elevated shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)]"
            role="dialog"
            aria-label="Instagram post preview"
          >
            <header className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-gold-300" strokeWidth={1.6} />
                <p className="font-display text-base text-ink-100">Instagram Auto-Post · {property.id}</p>
              </div>
              <button onClick={onClose} className="rounded-md p-1 text-ink-300 hover:text-ink-100" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="grid gap-6 p-6 md:grid-cols-[420px_1fr]">
              {/* Live preview — scaled-down 1080² card */}
              <div className="flex justify-center">
                <div className="overflow-hidden rounded-md ring-1 ring-white/10">
                  <div
                    style={{ width: 1080, height: 1080, transform: 'scale(0.36)', transformOrigin: 'top left' }}
                  >
                    <PostCard ref={cardRef} property={property} period={period} />
                  </div>
                  <div style={{ width: 388, height: 388 }} aria-hidden="true" />
                </div>
              </div>

              {/* Right: caption + actions */}
              <div className="flex min-w-0 flex-col">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-300">Caption</p>
                <textarea
                  readOnly
                  rows={11}
                  value={caption}
                  className="mt-2 w-full resize-none rounded-md border border-white/10 bg-white/[0.03] p-3 font-mono text-[12px] leading-relaxed text-ink-200 outline-none"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gold-gradient px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-900 disabled:opacity-60"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {downloading ? 'Rendering…' : 'Download PNG'}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-200 hover:border-gold-500/40 hover:text-gold-300"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-success-300" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy caption'}
                  </button>
                </div>

                <p className="mt-4 text-[11px] text-ink-400">
                  PNG is rendered at 1080 × 1080 @ 2× — drop it straight into Instagram or schedule via Later/Buffer.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 1080 × 1080 card — rendered in normal HTML/CSS so html2canvas can rasterise
// it with web fonts and overlays preserved. Forwarded ref lets the parent grab
// the node for export.
const PostCard = forwardRef(function PostCard({ property, period }, ref) {
  return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1080,
          position: 'relative',
          background: '#0B0E1F',
          fontFamily: '"DM Sans", system-ui, sans-serif',
          color: '#fff',
        }}
      >
        <img
          src={property.images[0]}
          alt=""
          crossOrigin="anonymous"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Diagonal darkening for headline contrast */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(11,14,31,0.85) 0%, rgba(11,14,31,0.4) 50%, rgba(11,14,31,0.95) 100%)',
        }} />

        {/* Gold accent corner brackets */}
        <span style={{ position: 'absolute', top: 60, left: 60, width: 60, height: 60, borderTop: '3px solid #d4af37', borderLeft: '3px solid #d4af37' }} />
        <span style={{ position: 'absolute', top: 60, right: 60, width: 60, height: 60, borderTop: '3px solid #d4af37', borderRight: '3px solid #d4af37' }} />
        <span style={{ position: 'absolute', bottom: 60, left: 60, width: 60, height: 60, borderBottom: '3px solid #d4af37', borderLeft: '3px solid #d4af37' }} />
        <span style={{ position: 'absolute', bottom: 60, right: 60, width: 60, height: 60, borderBottom: '3px solid #d4af37', borderRight: '3px solid #d4af37' }} />

        {/* Top: brand */}
        <div style={{ position: 'absolute', top: 90, left: 90, display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src="/logo.jpg" crossOrigin="anonymous" alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(212,175,55,0.6)' }} />
          <div>
            <p style={{ margin: 0, fontFamily: '"Playfair Display", serif', fontSize: 38, fontWeight: 700, lineHeight: 1 }}>{BRAND.shortName}</p>
            <p style={{ margin: '6px 0 0', fontSize: 16, letterSpacing: '0.22em', color: '#d4af37', fontWeight: 600 }}>SINCE 2008</p>
          </div>
        </div>

        {/* Type pill */}
        <div style={{ position: 'absolute', top: 110, right: 100 }}>
          <span style={{
            display: 'inline-block', padding: '12px 24px', borderRadius: 999,
            background: property.purpose === 'sale' ? 'linear-gradient(135deg,#d4af37 0%,#f4d03f 50%,#d4af37 100%)' : 'rgba(11,14,31,0.7)',
            border: property.purpose === 'sale' ? 'none' : '1px solid rgba(255,255,255,0.25)',
            color: property.purpose === 'sale' ? '#0a0b14' : '#fff',
            fontWeight: 700, fontSize: 18, letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>
            {property.purpose === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>

        {/* Centerpiece: title + price */}
        <div style={{ position: 'absolute', left: 90, right: 90, bottom: 240 }}>
          <p style={{
            margin: 0, fontFamily: '"Playfair Display", serif',
            fontSize: 78, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.018em', maxWidth: 800,
          }}>
            {truncate(property.title, 64)}
          </p>
          <p style={{ margin: '20px 0 0', fontSize: 22, color: '#E8E0D0', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>
            {property.location}
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 30 }}>
            <span style={{ fontFamily: 'Outfit, "DM Sans", sans-serif', fontSize: 32, color: 'rgba(212,175,55,0.7)', fontWeight: 700 }}>BD</span>
            <span style={{
              fontFamily: 'Outfit, "DM Sans", sans-serif', fontSize: 110, fontWeight: 800, lineHeight: 1,
              background: 'linear-gradient(135deg, #f4d03f 0%, #d4af37 60%, #b08d24 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
              {property.price.toLocaleString()}
            </span>
            <span style={{ fontSize: 26, color: 'rgba(196,200,219,0.7)', fontWeight: 500 }}>{period}</span>
          </div>
        </div>

        {/* Specs row */}
        <div style={{ position: 'absolute', left: 90, right: 90, bottom: 140, display: 'flex', gap: 50, color: '#fff' }}>
          <Spec label="BEDS" value={property.bedrooms === 0 ? 'Studio' : String(property.bedrooms)} />
          <Spec label="BATHS" value={String(property.bathrooms)} />
          <Spec label="AREA" value={`${property.sqm} m²`} />
          <Spec label="REF" value={property.id} />
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '36px 100px',
          borderTop: '1px solid rgba(212,175,55,0.4)',
          background: 'rgba(11,14,31,0.85)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ margin: 0, fontSize: 22, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E8E0D0' }}>
            DM us · ire.msstech.ai
          </p>
          <p style={{ margin: 0, fontSize: 18, color: '#d4af37', fontWeight: 600, letterSpacing: '0.22em' }}>
            @irebahrain
          </p>
        </div>
      </div>
  )
})

function Spec({ label, value }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: 16, letterSpacing: '0.22em', color: 'rgba(232,224,208,0.7)', fontWeight: 600 }}>{label}</p>
      <p style={{ margin: '6px 0 0', fontFamily: 'Outfit, sans-serif', fontSize: 38, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</p>
    </div>
  )
}

function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

function buildCaption(p) {
  const period = p.purpose === 'rent' ? `BD ${p.price.toLocaleString()}/month` : `BD ${p.price.toLocaleString()}`
  const beds = p.bedrooms === 0 ? 'Studio' : `${p.bedrooms} bed`
  const tags = [
    '#Bahrain', '#BahrainRealEstate', '#IRE', '#IREBahrain',
    `#${p.location.replace(/\s+/g, '')}`,
    p.purpose === 'sale' ? '#PropertyForSale' : '#PropertyForRent',
    `#${p.type}`, '#LuxuryLiving', '#GulfRealEstate',
  ].join(' ')
  return [
    `✨ ${p.title}`,
    `📍 ${p.address}`,
    '',
    `${beds} · ${p.bathrooms} bath · ${p.sqm} m² · Ref ${p.id}`,
    `💎 ${period}${p.purpose === 'rent' ? '' : ' · for sale'}`,
    '',
    p.description?.slice(0, 220) + (p.description?.length > 220 ? '…' : ''),
    '',
    'DM us, WhatsApp, or visit ire.msstech.ai for viewings.',
    '',
    tags,
  ].join('\n')
}
