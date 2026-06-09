import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight, ArrowLeft, MapPin, Home, CheckCircle2 } from 'lucide-react'
import Reveal from '../components/common/Reveal'
import SectionHeader from '../components/common/SectionHeader'
import projects from '../data/projects.json'
import { BRAND, SITE_URL } from '../lib/constants'

function ProjectGrid() {
  const [hover, setHover] = useState(null)

  return (
    <>
      <Helmet>
        <title>{`Our Projects — ${BRAND.shortName}`}</title>
        <meta name="description" content={`Landmark real estate projects in Bahrain managed and delivered by ${BRAND.legalName}.`} />
        <link rel="canonical" href={`${SITE_URL}/projects`} />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 pb-20 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="container-lux relative">
          <Reveal>
            <span className="eyebrow">Our Portfolio</span>
            <h1 className="mt-4 font-display text-h1-mob font-bold text-ink-100 lg:text-h1">
              Landmark Projects
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
              From brokerage mandates to full-stack facility management — a selection of the developments we've been trusted to deliver.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-ink-bg py-section">
        <div className="container-lux">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.07}>
                <Link
                  to={`/projects/${project.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-card transition-all hover:border-gold-500/20 hover:shadow-gold-soft"
                  onMouseEnter={() => setHover(project.id)}
                  onMouseLeave={() => setHover(null)}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        project.status === 'Completed'
                          ? 'border-gold-500/40 bg-ink-950/70 text-gold-300'
                          : 'border-emerald-500/40 bg-ink-950/70 text-emerald-300'
                      } backdrop-blur-sm`}>
                        {project.status}
                      </span>
                      <span className="rounded-full border border-white/20 bg-ink-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-200 backdrop-blur-sm">
                        {project.type}
                      </span>
                    </div>
                  </div>

                  {/* Copy */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-ink-100">{project.title}</h3>
                    <p className="mt-1 text-sm text-ink-400">{project.subtitle}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-300">{project.description}</p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {project.highlights.slice(0, 2).map((h) => (
                          <span key={h} className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[10px] text-ink-400">
                            {h}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gold-500 transition-colors group-hover:text-gold-300">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/[0.05] bg-ink-950 py-section">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_65%)]" />
        <div className="container-lux relative text-center">
          <Reveal>
            <h2 className="font-display text-h2-mob font-bold text-ink-100 lg:text-h2">
              Have a project to discuss?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-ink-300">
              Whether you need a leasing partner, property manager, or full-service OA operator — let's talk.
            </p>
            <Link to="/contact" className="btn-gold mt-8 inline-flex items-center gap-2">
              Contact Our Team <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <section className="container-lux flex min-h-[60vh] flex-col items-center justify-center py-section text-center">
        <p className="text-ink-300">Project not found.</p>
        <Link to="/projects" className="btn-gold mt-6 inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
      </section>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`${project.title} — ${BRAND.shortName}`}</title>
        <meta name="description" content={project.description} />
        <link rel="canonical" href={`${SITE_URL}/projects/${project.slug}`} />
      </Helmet>

      {/* Hero */}
      <section className="relative -mt-20 flex min-h-[60vh] items-end overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-ink-950/20" />
        <div className="container-lux relative pb-16 pt-32">
          <Reveal>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                project.status === 'Completed'
                  ? 'border-gold-500/40 bg-ink-950/70 text-gold-300'
                  : 'border-emerald-500/40 bg-ink-950/70 text-emerald-300'
              } backdrop-blur-sm`}>
                {project.status}
              </span>
              <span className="rounded-full border border-white/20 bg-ink-950/70 px-3 py-1 text-xs text-ink-200 backdrop-blur-sm">
                {project.type}
              </span>
              <span className="rounded-full border border-white/20 bg-ink-950/70 px-3 py-1 text-xs text-ink-200 backdrop-blur-sm">
                {project.year}
              </span>
            </div>
            <h1 className="font-display text-h1-mob font-bold text-ink-100 lg:text-h1">{project.title}</h1>
            <p className="mt-2 text-base text-ink-300">{project.subtitle}</p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="bg-ink-bg py-section">
        <div className="container-lux">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="font-display text-2xl font-bold text-ink-100">About This Project</h2>
                <p className="mt-4 text-base leading-relaxed text-ink-300">{project.description}</p>
              </Reveal>

              {project.gallery && (
                <div className="mt-10 grid grid-cols-2 gap-4">
                  {project.gallery.map((src, i) => (
                    <Reveal key={src} delay={i * 0.08}>
                      <img
                        src={src}
                        alt={`${project.title} ${i + 1}`}
                        loading="lazy"
                        className="aspect-[4/3] w-full rounded-xl object-cover"
                      />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Reveal>
                <div className="rounded-2xl border border-white/[0.06] bg-ink-card p-6">
                  <h3 className="font-display text-lg font-semibold text-ink-100">Project Highlights</h3>
                  <ul className="mt-4 space-y-3">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm text-ink-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" strokeWidth={1.5} />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {project.units && (
                    <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-6">
                      <Home className="h-4 w-4 text-gold-500" strokeWidth={1.5} />
                      <span className="text-sm text-ink-300">{project.units} units</span>
                    </div>
                  )}

                  <Link to="/contact" className="btn-gold mt-6 w-full justify-center">
                    Enquire About This Project
                  </Link>
                </div>

                <Link
                  to="/projects"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-400 transition-colors hover:text-gold-300"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  All Projects
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function Projects() {
  const { slug } = useParams()
  return slug ? <ProjectDetail /> : <ProjectGrid />
}
