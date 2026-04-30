import { motion } from 'framer-motion'

// Word- or letter-level reveal. Each unit fades + rises with a staggered delay,
// so a single line lands like a curtain dropping rather than a single block.
//
// Use `as="block"` for inline-block words (default), `as="inline"` for inline.
// `gradient` flag clips a gold gradient onto the text and gives it a slow
// shimmer pan — used for the hero "Bahrain Real Estate" line.
export default function SplitText({
  text,
  type = 'word', // 'word' | 'letter'
  initialDelay = 0,
  stagger = 0.05,
  className = '',
  unitClassName = '',
  y = '0.5em',
  duration = 0.9,
  gradient = false,
}) {
  const units = type === 'letter' ? Array.from(text) : text.split(' ')

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: initialDelay },
    },
  }
  const child = {
    hidden: { opacity: 0, y, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
      style={
        gradient
          ? {
              background:
                'linear-gradient(110deg, #b8860b 0%, #d4af37 25%, #f4d03f 50%, #d4af37 75%, #b8860b 100%)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              animation: 'goldShimmer 9s linear infinite',
              display: 'inline-block',
            }
          : undefined
      }
    >
      {units.map((unit, i) => {
        if (type === 'word') {
          const isLast = i === units.length - 1
          return (
            <motion.span
              key={i}
              variants={child}
              className={`inline-block ${unitClassName}`}
              style={{ willChange: 'transform, opacity, filter' }}
            >
              {unit}
              {!isLast && ' '}
            </motion.span>
          )
        }
        // letter
        return (
          <motion.span
            key={i}
            variants={child}
            className={`inline-block ${unitClassName}`}
            style={{ willChange: 'transform, opacity, filter' }}
          >
            {unit === ' ' ? ' ' : unit}
          </motion.span>
        )
      })}
    </motion.span>
  )
}
