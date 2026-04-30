import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight, Sparkles } from 'lucide-react'

import MortgageCalculator from '../components/property/MortgageCalculator'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'
import { BRAND, SITE_URL } from '../lib/constants'

// Standalone mortgage calculator — accessible from header / footer as a
// quick tool. Beta tag noted in the eyebrow + CTA.
export default function MortgageTool() {
  return (
    <>
      <Helmet>
        <title>{`Mortgage Calculator — ${BRAND.shortName}`}</title>
        <meta
          name="description"
          content="Estimate your monthly mortgage payment for any Bahrain freehold property. Standard amortisation, real-time recalculation, no signup required."
        />
        <link rel="canonical" href={`${SITE_URL}/tools/mortgage-calculator`} />
      </Helmet>

      <div className="container-lux pb-24 pt-12">
        <SectionHeader
          eyebrow={
            <span className="inline-flex items-center gap-2">
              Tools · Beta
              <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gold-300">
                Beta
              </span>
            </span>
          }
          title="Mortgage Calculator"
          subtitle="Estimate your monthly payment on any Bahrain freehold property. Adjust price, down payment, interest rate and term in real time."
        />

        <div className="mt-10">
          <Reveal>
            <MortgageCalculator defaultPrice={250000} />
          </Reveal>
        </div>

        {/* Disclaimer + CTA back to listings */}
        <Reveal delay={0.15}>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <p className="text-sm text-ink-300">
              This calculator is for guidance only. Final terms depend on lender approval and current
              Bahrain market rates. The Beta version uses standard amortisation; lender-specific fees,
              insurance, and EWA charges are not included.
            </p>
            <Link
              to="/properties?purpose=sale"
              className="btn-gold inline-flex items-center gap-2 text-xs"
            >
              Browse Properties for Sale
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  )
}
