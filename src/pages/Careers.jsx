import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight, MapPin, Clock, Briefcase, ChevronRight } from 'lucide-react'
import Reveal from '../components/common/Reveal'
import SectionHeader from '../components/common/SectionHeader'
import { BRAND, CONTACT, SITE_URL } from '../lib/constants'

const ROLES = [
  {
    id: 'senior-broker',
    title: 'Senior Sales Broker',
    department: 'Brokerage',
    type: 'Full-Time',
    location: 'Seef District, Manama',
    description:
      "We're looking for a driven, experienced broker to join our sales team. You'll work across residential and commercial mandates, build your own client base, and have the full support of our marketing, admin and legal teams. RERA license required or supported.",
    requirements: [
      'Minimum 3 years real estate sales experience in Bahrain',
      'RERA license (or willingness to obtain with our support)',
      'Strong knowledge of Bahrain property market',
      'Fluent English; Arabic a strong advantage',
      'Self-motivated and target-driven',
    ],
  },
  {
    id: 'property-manager',
    title: 'Property Manager',
    department: 'Property Management',
    type: 'Full-Time',
    location: 'Seef District, Manama',
    description:
      "Manage a portfolio of 150–200 residential and commercial units on behalf of landlord clients. Day-to-day responsibilities include tenant relations, maintenance coordination, rent collection and monthly reporting. You'll be supported by our admin platform and in-house legal team.",
    requirements: [
      '2+ years property management experience',
      'Familiarity with Bahraini tenancy law and RERA regulations',
      'Excellent organisational and communication skills',
      'Proficiency in property management software',
      'Valid Bahrain driving license',
    ],
  },
  {
    id: 'valuation-surveyor',
    title: 'Registered Valuer / Surveyor',
    department: 'Valuation & Advisory',
    type: 'Full-Time',
    location: 'Seef District, Manama',
    description:
      'Produce RICS-compliant valuation reports for residential, commercial and mixed-use properties across Bahrain. Reports are instructed by banks, corporate clients and government entities. MRICS or AssocRICS preferred; exceptional candidates supported toward membership.',
    requirements: [
      'MRICS, AssocRICS or equivalent qualification preferred',
      'Experience in Bahrain or GCC property markets',
      'Strong written English for report production',
      'Knowledge of Red Book / IVS valuation standards',
      'Analytical, detail-oriented, able to meet bank deadlines',
    ],
  },
  {
    id: 'marketing-coordinator',
    title: 'Marketing & Content Coordinator',
    department: 'Marketing',
    type: 'Full-Time',
    location: 'Seef District, Manama',
    description:
      "Own ASK's content calendar across Instagram, LinkedIn and email. Coordinate property photography and videography, manage listing content, and support the team with digital campaigns, print materials and event collateral. Creative eye and real estate enthusiasm required.",
    requirements: [
      'Experience running social media for a brand or agency',
      'Proficiency in Canva, Adobe suite, or equivalent',
      'Strong copywriting skills in English',
      'Photography or video editing experience a plus',
      'Interest in property and real estate markets',
    ],
  },
]

const BENEFITS = [
  'Competitive base salary + commission structure',
  'Medical insurance',
  'RERA licensing support and CPD training',
  'Flexible hybrid working where role permits',
  "Access to ASK's professional network across Bahrain and the GCC",
]

export default function Careers() {
  const mailTo = (role) =>
    `mailto:${CONTACT.email}?subject=Application: ${encodeURIComponent(role.title)}&body=Hi ASK team,%0D%0A%0D%0AI'd like to apply for the ${encodeURIComponent(role.title)} position.%0D%0A%0D%0A[Please attach your CV and a brief introduction]`

  return (
    <>
      <Helmet>
        <title>{`Careers — ${BRAND.shortName}`}</title>
        <meta name="description" content={`Join the ASK Real Estate team in Bahrain. Current openings in brokerage, property management, valuation and marketing.`} />
        <link rel="canonical" href={`${SITE_URL}/careers`} />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 pb-20 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_60%,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="container-lux relative">
          <Reveal>
            <span className="eyebrow">Join the Team</span>
            <h1 className="mt-4 font-display text-h1-mob font-bold text-ink-100 lg:text-h1">
              Build Your Career<br className="hidden sm:block" /> at ASK Real Estate
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
              We're a team of straight-talking professionals who take pride in excellent work. If you want to grow in Bahrain real estate — not just move deals — we want to hear from you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Open roles */}
      <section className="bg-ink-bg py-section">
        <div className="container-lux">
          <SectionHeader eyebrow="Open Positions" title="Current Openings" />

          <div className="mt-10 space-y-5 sm:mt-14">
            {ROLES.map((role, i) => (
              <Reveal key={role.id} delay={i * 0.07}>
                <details className="group rounded-2xl border border-white/[0.06] bg-ink-card transition-all hover:border-gold-500/20">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                      <h3 className="font-display text-xl font-semibold text-ink-100">{role.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-ink-400">
                          <Briefcase className="h-3 w-3" />
                          {role.department}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-ink-400">
                          <Clock className="h-3 w-3" />
                          {role.type}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-ink-400">
                          <MapPin className="h-3 w-3" />
                          {role.location}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-gold-500 transition-transform group-open:rotate-90" strokeWidth={1.5} />
                  </summary>

                  <div className="border-t border-white/[0.06] px-6 pb-6 pt-5">
                    <p className="text-sm leading-relaxed text-ink-300">{role.description}</p>

                    <div className="mt-5">
                      <h4 className="text-[11px] font-semibold uppercase tracking-widest text-gold-500">
                        What We're Looking For
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {role.requirements.map((r) => (
                          <li key={r} className="flex items-start gap-2.5 text-sm text-ink-300">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={mailTo(role)}
                      className="btn-gold mt-6 inline-flex items-center gap-2"
                    >
                      Apply for This Role
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-white/[0.05] bg-ink-card/40 py-section">
        <div className="container-lux">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <SectionHeader
                eyebrow="Why Join ASK"
                title="What We Offer"
                subtitle="We believe great people deserve great environments."
              />
              <ul className="mt-8 space-y-3">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-ink-200">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-white/[0.06] bg-ink-card p-8">
                <h3 className="font-display text-2xl font-bold text-ink-100">Don't see your role?</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                  We're always interested in hearing from talented people in real estate, finance, marketing and technology. Send your CV and a brief note about what you're looking for.
                </p>
                <a
                  href={`mailto:${CONTACT.email}?subject=General Application — ASK Real Estate`}
                  className="btn-gold mt-6 inline-flex items-center gap-2"
                >
                  Send a General Application
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
