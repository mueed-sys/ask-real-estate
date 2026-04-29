import Reveal from './Reveal'

// Standard luxury section header — eyebrow, display title, gold rule, optional subtitle.
export default function SectionHeader({ eyebrow, title, subtitle, align = 'left' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <Reveal>
      <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {title && (
          <h2 className="font-display text-4xl leading-tight text-ink-100 md:text-5xl lg:text-6xl">
            {title}
          </h2>
        )}
        <div className={`gold-rule ${align === 'center' ? 'mx-auto' : ''}`} />
        {subtitle && <p className="max-w-xl text-base leading-relaxed text-ink-300">{subtitle}</p>}
      </div>
    </Reveal>
  )
}
