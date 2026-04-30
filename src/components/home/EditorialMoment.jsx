import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import properties from '../../data/properties.json'
import Reveal from '../common/Reveal'
import PropertyCard from '../property/PropertyCard'

// Architectural-Digest-style editorial slot. A curated paragraph + hero
// photograph paired with 1-2 hand-picked listings from the spotlighted
// neighbourhood. The intent is for the homepage to feel like a magazine
// cover, not a property database.
//
// Right now the spotlight is hard-coded to Bahrain Bay; once the dashboard
// "Property of the Week" toggle ships, this slot can be admin-curated.
const SPOTLIGHT = {
  area:  'Bahrain Bay',
  slug:  'bahrain-bay',
  image: '/images/hero/bahrain-bay-panorama.webp',
  eyebrow: 'NEIGHBOURHOOD IN FOCUS',
  title: 'Living on the Bay',
  body:
    "Bahrain Bay is the Kingdom's most curated address — a private peninsula \
where Four Seasons, the Avenues mall, and the Financial Harbour all sit within \
walking distance. Sunset reflections off the towers feel cinematic from any of \
its waterfront residences.",
  pickIds: ['IRE-015', 'IRE-005'],
}

export default function EditorialMoment() {
  const picks = SPOTLIGHT.pickIds
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean)

  return (
    <section className="relative overflow-hidden">
      <div className="container-wide grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* Editorial photograph + caption */}
        <Reveal>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-md sm:aspect-[16/10] lg:aspect-[5/6]">
            <img
              src={SPOTLIGHT.image}
              alt={`${SPOTLIGHT.area} editorial`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-bg/80 via-ink-bg/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="eyebrow eyebrow-gold">{SPOTLIGHT.eyebrow}</span>
              <p className="mt-3 font-display text-3xl leading-[1.05] tracking-tight text-ink-100 sm:text-4xl md:text-5xl">
                {SPOTLIGHT.title}
              </p>
            </figcaption>
          </figure>
        </Reveal>

        {/* Editorial copy + curated picks */}
        <div className="flex flex-col gap-8">
          <Reveal>
            <p className="text-base leading-[1.8] text-ink-200 sm:text-[17px]">{SPOTLIGHT.body}</p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {picks.map((p, i) => (
              <Reveal key={p.id} delay={0.08 * (i + 1)} className="h-full">
                <PropertyCard property={p} showCompare={false} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <Link
              to={`/areas/${SPOTLIGHT.slug}`}
              className="group inline-flex items-center gap-2 self-start rounded-full border border-gold-500/30 bg-gold-500/[0.05] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-200 transition-colors hover:border-gold-500/60 hover:bg-gold-500/10"
            >
              Read the {SPOTLIGHT.area} guide
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.6}
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
