import Reveal from './Reveal'

// Standard luxury section header — eyebrow, display title, gold rule, optional subtitle.
export default function SectionHeader({ eyebrow, title, subtitle, align = 'left' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <Reveal>
      <div className={`flex max-w-2xl flex-col gap-3 sm:gap-4 ${alignment}`}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {title && (
          <h2 className="font-display text-3xl leading-tight text-ink-100 sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h2>
        )}
        <div className={`gold-rule ${align === 'center' ? 'mx-auto' : ''}`} />
        {subtitle && <p className="max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">{subtitle}</p>}
      </div>
    </Reveal>
  )
}
