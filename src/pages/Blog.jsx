import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Clock, ArrowUpRight } from 'lucide-react'

import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/common/Reveal'

import blog from '../data/blog.json'
import { BRAND, SITE_URL } from '../lib/constants'
import { shortDate } from '../lib/format'

export default function Blog() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const categories = ['All', ...Array.from(new Set(blog.map((p) => p.category)))]
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? blog : blog.filter((p) => p.category === active)

  return (
    <>
      <Helmet>
        <title>{`${t('blog.title')} — ${BRAND.shortName}`}</title>
        <meta name="description" content={t('blog.subtitle')} />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
      </Helmet>

      <div className="container-lux pb-24 pt-12">
        <SectionHeader
          eyebrow={t('nav.blog')}
          title={t('blog.title')}
          subtitle={t('blog.subtitle')}
        />

        {/* Category filter */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                  active === c
                    ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                    : 'border-white/10 text-ink-300 hover:border-gold-500/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <Link to={`/blog/${post.slug}`} className="card-lux group flex h-full flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-gold-300 backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h3 className="font-display text-xl leading-snug text-ink-100">
                    {lang === 'ar' && post.title_ar ? post.title_ar : post.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-ink-300">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4 text-[11px] text-ink-400">
                    <span>{shortDate(post.date, lang)} · {post.author}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t('blog.read_time', { count: post.read_time })}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  )
}
