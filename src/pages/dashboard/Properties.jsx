import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, ArrowUp, ArrowDown, Edit, EyeOff, Trash2, X, ExternalLink, Sparkles, Instagram, Crown,
} from 'lucide-react'

import Panel from '../../components/dashboard/Panel'
import StatusBadge from '../../components/dashboard/StatusBadge'
import InstagramPostGenerator from '../../components/dashboard/InstagramPostGenerator'
import { useToast } from '../../store/useToast'
import properties from '../../data/properties.json'
import agents from '../../data/agents.json'
import areas from '../../data/areas.json'
import { formatPrice } from '../../lib/format'
import { PROPERTY_TYPES } from '../../lib/constants'

// Synthetic status — mock layer over real properties.json data
function statusFor(p) {
  if (p.id.endsWith('06') || p.id.endsWith('14')) return 'pending'
  if (p.id.endsWith('19') || p.id.endsWith('05')) return 'rented'
  if (p.id.endsWith('18')) return 'inactive'
  return 'active'
}

function inquiryCountFor(p) {
  // deterministic mock based on id char codes
  const code = p.id.split('-')[1] || '1'
  return Math.round(Number(code) * 1.7) + 4
}

const SORTABLE = [
  { key: 'id',          label: 'ID' },
  { key: 'title',       label: 'Title' },
  { key: 'location',    label: 'Area' },
  { key: 'type',        label: 'Type' },
  { key: 'price',       label: 'Price' },
  { key: 'status',      label: 'Status' },
  { key: 'views',       label: 'Views' },
  { key: 'inquiries',   label: 'Inquiries' },
  { key: 'created_at',  label: 'Listed' },
]

export default function DashProperties() {
  const pushToast = useToast((s) => s.push)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sort, setSort] = useState({ key: 'created_at', dir: 'desc' })
  const [selected, setSelected] = useState(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [igFor, setIgFor] = useState(null)

  const enriched = useMemo(
    () =>
      properties.map((p) => ({
        ...p,
        status: statusFor(p),
        inquiries: inquiryCountFor(p),
      })),
    []
  )

  const filtered = useMemo(() => {
    let out = enriched
    if (search) {
      const q = search.toLowerCase()
      out = out.filter(
        (p) => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') out = out.filter((p) => p.status === statusFilter)
    if (areaFilter !== 'all') out = out.filter((p) => p.location === areaFilter)
    if (typeFilter !== 'all') out = out.filter((p) => p.type === typeFilter)
    out = [...out].sort((a, b) => {
      const av = a[sort.key]; const bv = b[sort.key]
      if (av == null) return 1
      if (bv == null) return -1
      if (av < bv) return sort.dir === 'asc' ? -1 : 1
      if (av > bv) return sort.dir === 'asc' ? 1 : -1
      return 0
    })
    return out
  }, [enriched, search, statusFilter, areaFilter, typeFilter, sort])

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }))

  const toggleSelect = (id) =>
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const exportCsv = () => {
    const rows = [
      ['ID', 'Title', 'Area', 'Type', 'Price', 'Status', 'Views', 'Inquiries', 'Agent', 'Listed'],
      ...filtered.map((p) => [
        p.id, p.title, p.location, p.type, p.price, p.status, p.views, p.inquiries,
        agents.find((a) => a.id === p.agent_id)?.name || '',
        p.created_at,
      ]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'ire-properties.csv'; a.click(); URL.revokeObjectURL(url)
    pushToast('Exported to CSV')
  }

  const openAdd = () => { setEditing(null); setDrawerOpen(true) }
  const openEdit = (p) => { setEditing(p); setDrawerOpen(true) }

  return (
    <div className="space-y-6">
      {/* Selling-point banner */}
      <div className="rounded-md border border-gold-500/20 bg-gold-500/[0.04] p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
          <p className="text-sm text-ink-200">
            <span className="font-semibold text-gold-300">Upload a new listing in under 2 minutes.</span>{' '}
            No more designing Instagram posts for each property — the website, search results, and listings sheet update automatically.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, or area"
            className="w-72 rounded-md border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-ink-100 outline-none focus:border-gold-500/40"
          />
        </div>
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={[
          { value: 'all', label: 'All statuses' },
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
          { value: 'rented', label: 'Rented' },
          { value: 'inactive', label: 'Inactive' },
        ]} />
        <FilterSelect value={areaFilter} onChange={setAreaFilter} options={[
          { value: 'all', label: 'All areas' },
          ...areas.map((a) => ({ value: a.name, label: a.name })),
        ]} />
        <FilterSelect value={typeFilter} onChange={setTypeFilter} options={[
          { value: 'all', label: 'All types' },
          ...PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.value })),
        ]} />
        <div className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <span className="text-[11px] text-ink-300">{selected.size} selected</span>
          )}
          <button onClick={exportCsv} className="rounded-md border border-white/10 px-3 py-2 text-xs uppercase tracking-widest text-ink-200 hover:border-gold-500/40">
            Export CSV
          </button>
          <button onClick={openAdd} className="btn-gold inline-flex items-center gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add New Property
          </button>
        </div>
      </div>

      {/* Table */}
      <Panel
        title={`${filtered.length} properties`}
        subtitle={`Sorted by ${SORTABLE.find((s) => s.key === sort.key)?.label || ''} (${sort.dir})`}
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                <th className="px-5 py-3">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelected(e.target.checked ? new Set(filtered.map((p) => p.id)) : new Set())
                    }
                    className="accent-gold-500"
                  />
                </th>
                <th className="px-5 py-3">Image</th>
                {SORTABLE.map((c) => (
                  <th key={c.key} className="px-5 py-3">
                    <button
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex items-center gap-1 hover:text-gold-300"
                    >
                      {c.label}
                      {sort.key === c.key && (sort.dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                    </button>
                  </th>
                ))}
                <th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const agent = agents.find((a) => a.id === p.agent_id)
                const isSel = selected.has(p.id)
                return (
                  <tr key={p.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleSelect(p.id)}
                        className="accent-gold-500"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <img src={p.images[0]} alt="" className="h-11 w-16 rounded object-cover" loading="lazy" />
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-numbers text-sm font-bold tracking-tight tabular-nums text-gold-400">{p.id}</span>
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="truncate text-sm text-ink-100">{p.title}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-ink-300">{p.location}</td>
                    <td className="px-5 py-3 text-sm text-ink-300">{p.type}</td>
                    <td className="px-5 py-3">
                      <span className="font-numbers text-sm font-bold tracking-tight tabular-nums text-gold-300">BD {formatPrice(p.price)}</span>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3 font-numbers text-sm font-bold tracking-tight tabular-nums text-ink-200">{p.views}</td>
                    <td className="px-5 py-3 font-numbers text-sm font-bold tracking-tight tabular-nums text-emerald-400">{p.inquiries}</td>
                    <td className="px-5 py-3 text-[11px] text-ink-400">{p.created_at}</td>
                    <td className="px-5 py-3 text-sm text-ink-300">{agent?.name.split(' ')[0] || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/properties/${p.id}`} target="_blank" className="rounded p-1.5 text-ink-300 hover:bg-white/5 hover:text-gold-300" title="View live">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => setIgFor(p)}
                          className="rounded p-1.5 text-ink-300 hover:bg-white/5 hover:text-gold-300"
                          title="Instagram auto-post"
                        >
                          <Instagram className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => openEdit(p)} className="rounded p-1.5 text-ink-300 hover:bg-white/5 hover:text-gold-300" title="Edit">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => pushToast(`${p.id} deactivated`)} className="rounded p-1.5 text-ink-300 hover:bg-white/5 hover:text-yellow-300" title="Deactivate">
                          <EyeOff className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => pushToast(`${p.id} deleted`, { type: 'error' })} className="rounded p-1.5 text-ink-300 hover:bg-white/5 hover:text-red-400" title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Instagram auto-post modal */}
      <InstagramPostGenerator
        property={igFor}
        open={!!igFor}
        onClose={() => setIgFor(null)}
      />

      {/* Slide-out drawer */}
      <PropertyDrawer
        open={drawerOpen}
        editing={editing}
        onClose={() => setDrawerOpen(false)}
        onSubmit={(payload) => {
          setDrawerOpen(false)
          const id = payload.id || `IRE-0${properties.length + 1}`
          pushToast(`Property ${id} ${editing ? 'updated' : 'published successfully. It is now live on your website.'}`, { type: 'success' })
        }}
      />
    </div>
  )
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-ink-200 outline-none focus:border-gold-500/40"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-ink-900">{o.label}</option>
      ))}
    </select>
  )
}

const ALL_AMENITIES = [
  'pool', 'gym', 'security_24_7', 'covered_parking', 'balcony', 'sea_view',
  'maids_room', 'storage', 'central_ac', 'built_in_wardrobes',
  'kitchen_appliances', 'internet', 'playground', 'concierge',
]

function PropertyDrawer({ open, editing, onClose, onSubmit }) {
  const [form, setForm] = useState(() =>
    editing
      ? { ...editing, amenitySet: new Set(editing.amenities || []) }
      : {
          id: '', title: '', location: 'Juffair', type: 'Apartment', purpose: 'rent',
          price: 500, bedrooms: 1, bathrooms: 1, sqm: 80, floor: 1, parking: 1,
          furnished: false, featured: false, year_built: 2024, agent_id: 'agent-001',
          description: '', amenitySet: new Set(),
        }
  )
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto bg-[#0a0c18] shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#0a0c18]/95 px-6 py-4 backdrop-blur">
              <div>
                <h2 className="font-display text-2xl text-ink-100">{editing ? `Edit ${editing.id}` : 'Add New Property'}</h2>
                <p className="mt-0.5 text-[11px] text-ink-400">All fields auto-publish to the live site.</p>
              </div>
              <button onClick={onClose} className="rounded-md p-2 text-ink-200 hover:text-gold-300">
                <X className="h-5 w-5" />
              </button>
            </header>

            <form
              onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, amenities: Array.from(form.amenitySet) }) }}
              className="space-y-6 p-6"
            >
              {/* Image upload mock */}
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gold-500">Photos</p>
                <div className="grid grid-cols-3 gap-3">
                  {(editing?.images || []).slice(0, 3).map((src, i) => (
                    <img key={i} src={src} alt="" className="aspect-[4/3] w-full rounded object-cover" />
                  ))}
                  <div className="flex aspect-[4/3] cursor-pointer items-center justify-center rounded border border-dashed border-white/15 bg-white/[0.02] text-xs text-ink-400 transition-colors hover:border-gold-500/40">
                    + Upload
                  </div>
                </div>
              </div>

              <Field label="Title">
                <input value={form.title} onChange={(e) => set('title', e.target.value)} className="dash-input" placeholder="e.g. Luxury 2BR with Sea View" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Purpose">
                  <select value={form.purpose} onChange={(e) => set('purpose', e.target.value)} className="dash-input">
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                  </select>
                </Field>
                <Field label="Type">
                  <select value={form.type} onChange={(e) => set('type', e.target.value)} className="dash-input">
                    {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.value}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Area">
                  <select value={form.location} onChange={(e) => set('location', e.target.value)} className="dash-input">
                    {areas.map((a) => <option key={a.slug} value={a.name}>{a.name}</option>)}
                  </select>
                </Field>
                <Field label="Price (BD)">
                  <input type="number" value={form.price} onChange={(e) => set('price', Number(e.target.value))} className="dash-input" />
                </Field>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <Field label="Bedrooms">
                  <input type="number" value={form.bedrooms} onChange={(e) => set('bedrooms', Number(e.target.value))} className="dash-input" />
                </Field>
                <Field label="Bathrooms">
                  <input type="number" value={form.bathrooms} onChange={(e) => set('bathrooms', Number(e.target.value))} className="dash-input" />
                </Field>
                <Field label="Sqm">
                  <input type="number" value={form.sqm} onChange={(e) => set('sqm', Number(e.target.value))} className="dash-input" />
                </Field>
                <Field label="Floor">
                  <input type="number" value={form.floor} onChange={(e) => set('floor', Number(e.target.value))} className="dash-input" />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  className="dash-input resize-none"
                  placeholder="Open with the headline feature, then describe the layout, amenities, and neighbourhood."
                />
              </Field>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gold-500">Amenities</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ALL_AMENITIES.map((a) => (
                    <label key={a} className="flex cursor-pointer items-center gap-2 rounded border border-white/10 px-3 py-2 text-xs text-ink-200 hover:border-gold-500/30">
                      <input
                        type="checkbox"
                        checked={form.amenitySet.has(a)}
                        onChange={(e) => {
                          const next = new Set(form.amenitySet)
                          if (e.target.checked) next.add(a); else next.delete(a)
                          set('amenitySet', next)
                        }}
                        className="accent-gold-500"
                      />
                      {a.replace(/_/g, ' ')}
                    </label>
                  ))}
                </div>
              </div>

              <Field label="Assigned Agent">
                <select value={form.agent_id} onChange={(e) => set('agent_id', e.target.value)} className="dash-input">
                  {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Toggle label="Furnished" checked={form.furnished} onChange={(v) => set('furnished', v)} />
                <Toggle label="Featured on homepage" checked={form.featured} onChange={(v) => set('featured', v)} />
              </div>

              <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-between border-t border-white/5 bg-[#0a0c18]/95 px-6 py-4 backdrop-blur">
                <button type="button" onClick={onClose} className="text-xs uppercase tracking-widest text-ink-300 hover:text-ink-100">
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-ink-200 hover:border-gold-500/40">
                    Preview
                  </button>
                  <button type="submit" className="btn-gold text-xs">
                    {editing ? 'Save Changes' : 'Publish'}
                  </button>
                </div>
              </div>
            </form>

            <style>{`
              .dash-input {
                width: 100%;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 4px;
                padding: 0.5rem 0.75rem;
                color: #e6e7f0;
                font-size: 0.875rem;
                outline: none;
                transition: border-color .2s;
              }
              .dash-input:focus { border-color: rgba(212,175,55,0.4); }
            `}</style>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold-500">{label}</p>
      {children}
    </label>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded border border-white/10 px-4 py-3">
      <span className="text-sm text-ink-200">{label}</span>
      <span className="relative inline-flex h-5 w-9 items-center">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-white/10 transition-colors peer-checked:bg-gold-500" />
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  )
}
