// Generic dashboard card / panel with a luxury header.
export default function Panel({ title, subtitle, action, children, className = '', noPadding = false }) {
  return (
    <section className={`rounded-md border border-white/5 bg-white/[0.02] ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4">
          <div>
            {title && <h2 className="font-display text-xl text-ink-100">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[11px] text-ink-400">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </section>
  )
}
