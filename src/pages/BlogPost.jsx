import { Link, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Clock, ArrowLeft, Twitter, Facebook, Link2, MessageCircle, ArrowUpRight } from 'lucide-react'

import Reveal from '../components/common/Reveal'

import blog from '../data/blog.json'
import { BRAND, SITE_URL } from '../lib/constants'
import { shortDate } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { useToast } from '../store/useToast'

export default function BlogPost() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const pushToast = useToast((s) => s.push)

  const post = blog.find((p) => p.slug === slug)
  if (!post) return <Navigate to="/blog" replace />

  const related = blog.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3)

  const url = `${SITE_URL}/blog/${slug}`
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      pushToast(t('toast.link_copied'))
    } catch {}
  }

  const title = post.title

  return (
    <>
      <Helmet>
        <title>{`${title} — ${BRAND.shortName}`}</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={url} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            image: post.image,
            datePublished: post.date,
            author: { '@type': 'Person', name: post.author },
            publisher: { '@type': 'Organization', name: BRAND.legalName },
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="relative -mt-20 flex min-h-[60vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={post.image} alt={title} className="h-full w-full object-cover" fetchpriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/10" />
        </div>
        <div className="container-lux relative z-10 pb-16 pt-32">
          <Reveal>
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-500 hover:text-gold-300">
              <ArrowLeft className="h-3 w-3" />
              {t('nav.blog')}
            </Link>
            <span className="mt-6 inline-block rounded-full border border-gold-500/30 bg-gold-500/5 px-4 py-1 text-[10px] font-medium uppercase tracking-widest text-gold-300">
              {post.category}
            </span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-ink-100 md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink-300">
              <span>{t('blog.by')} <span className="font-medium text-ink-100">{post.author}</span></span>
              <span>·</span>
              <span>{shortDate(post.date)}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {t('blog.read_time', { count: post.read_time })}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <article className="container-lux py-16">
        <Reveal>
          <div className="prose prose-invert mx-auto max-w-3xl">
            {post.body.split('\n\n').map((para, i) => (
              <p key={i} className="mb-5 text-base leading-[1.8] text-ink-200 first-letter:font-display first-letter:text-3xl first-letter:text-gold-500 first-letter:[&]:mr-1 first:first-letter:[&]:float-none">
                {para}
              </p>
            ))}
          </div>
        </Reveal>

        {/* Share */}
        <Reveal>
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center gap-2 border-y border-white/5 py-6">
            <span className="text-[11px] font-medium uppercase tracking-widest text-gold-500">{t('share.title')}</span>
            <ShareBtn icon={Link2} onClick={handleCopy}>{t('share.copy')}</ShareBtn>
            <ShareBtn icon={MessageCircle} href={waLink({ text: `${title} — ${url}` })}>{t('share.whatsapp')}</ShareBtn>
            <ShareBtn icon={Twitter} href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}>{t('share.twitter')}</ShareBtn>
            <ShareBtn icon={Facebook} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}>{t('share.facebook')}</ShareBtn>
          </div>
        </Reveal>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-ink-850/40 py-20">
          <div className="container-lux">
            <Reveal>
              <h2 className="font-display text-3xl text-ink-100">{t('blog.related')}</h2>
              <div className="gold-rule" />
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <Link to={`/blog/${p.slug}`} className="card-lux group block">
                    <img src={p.image} alt={p.title} className="aspect-[16/10] w-full object-cover" loading="lazy" />
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-widest text-gold-500">{p.category}</p>
                      <h3 className="mt-2 font-display text-lg leading-snug text-ink-100">{p.title}</h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-ink-950 py-16">
        <div className="container-lux text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl text-ink-100 md:text-4xl">
            Looking for property in Bahrain?
          </h2>
          <Link to="/properties" className="btn-gold mt-8 inline-flex items-center gap-2 text-xs">
            Browse our listings
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </>
  )
}

function ShareBtn({ icon: Icon, href, onClick, children }) {
  const Comp = href ? 'a' : 'button'
  const props = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { onClick, type: 'button' }
  return (
    <Comp
      {...props}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-ink-200 transition-colors hover:border-gold-500/40 hover:text-gold-300"
    >
      <Icon className="h-3 w-3" />
      {children}
    </Comp>
  )
}
