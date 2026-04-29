// Generic dashboard card / panel with a luxury header.
export default function Panel({ title, subtitle, action, children, className = '', noPadding = false }) {
  return (
    <section className={`rounded-md border border-white/5 bg-white/[0.02] ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            {title && <h2 className="truncate font-display text-base text-ink-100 sm:text-xl">{title}</h2>}
            {subtitle && <p className="mt-0.5 truncate text-[11px] text-ink-400">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={noPadding ? '' : 'p-4 sm:p-5'}>{children}</div>
    </section>
  )
}
