import { STATUS_STYLE } from '../../lib/dashboard'

export default function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.inactive
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${s.bg} ${s.text} ${s.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.text.replace('text-', 'bg-')}`} />
      {s.label}
    </span>
  )
}
