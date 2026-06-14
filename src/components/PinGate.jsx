import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PIN = '2016'                       // ASK Real Estate founding year
const STORAGE_KEY = 'ask.access'         // localStorage token
const TTL_MS = 24 * 60 * 60 * 1000       // 24 hours

// Read + validate the access token. Returns true if unlocked and not expired.
function readToken() {
  if (typeof window === 'undefined') return false
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const { exp } = JSON.parse(raw)
    if (typeof exp !== 'number' || Date.now() > exp) {
      window.localStorage.removeItem(STORAGE_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

function writeToken() {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ exp: Date.now() + TTL_MS, v: 1 })
  )
}

// Fullscreen pin gate. Wraps the whole app — children only mount once unlocked.
export default function PinGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => readToken())

  // If a pinned-in user lets the page sit past 24h, drop them back to the gate.
  useEffect(() => {
    if (!unlocked) return
    const id = setInterval(() => {
      if (!readToken()) setUnlocked(false)
    }, 60_000)
    return () => clearInterval(id)
  }, [unlocked])

  return (
    <>
      <AnimatePresence>
        {!unlocked && (
          <Gate
            onUnlock={() => {
              writeToken()
              setUnlocked(true)
            }}
          />
        )}
      </AnimatePresence>
      {unlocked && children}
    </>
  )
}

function Gate({ onUnlock }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(0)
  const inputs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  // Focus the first empty box on mount
  useEffect(() => {
    inputs[0].current?.focus()
  }, [])

  const setDigit = (i, val) => {
    const v = val.replace(/\D/g, '').slice(0, 1)
    setDigits((d) => {
      const next = [...d]
      next[i] = v
      // Auto-advance to the next box on input
      if (v && i < 3) inputs[i + 1].current?.focus()
      // Auto-submit when all 4 filled
      if (v && i === 3 && next.every((x) => x !== '')) {
        // Defer one tick so React commits state before we read it
        setTimeout(() => attempt(next.join('')), 50)
      }
      return next
    })
    if (error) setError(false)
  }

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs[i - 1].current?.focus()
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const code = digits.join('')
      if (code.length === 4) attempt(code)
    }
  }

  const onPaste = (e) => {
    const txt = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 4)
    if (!txt) return
    e.preventDefault()
    const next = ['', '', '', '']
    for (let i = 0; i < txt.length; i++) next[i] = txt[i]
    setDigits(next)
    if (txt.length === 4) setTimeout(() => attempt(txt), 50)
    else inputs[txt.length]?.current?.focus()
  }

  const attempt = (code) => {
    if (code === PIN) {
      onUnlock()
    } else {
      setError(true)
      setShake((s) => s + 1)
      setDigits(['', '', '', ''])
      setTimeout(() => inputs[0].current?.focus(), 50)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink-950"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,175,55,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(212,175,55,0.10),transparent_55%)]" />

      <motion.div
        key={shake}
        animate={error ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src="/ask-logo.png" alt="ASK Real Estate" className="h-16 w-auto mx-auto mb-6" />
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500">
            Private Demo
          </p>
          <h1 className="mt-3 font-display text-3xl text-ink-100">
            ASK Real Estate
          </h1>
          <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-ink-200">
            Enter your ASK Real Estate access code to continue.
          </p>
        </div>

        {/* Pin input — 4 luxury digit boxes */}
        <div className="mt-10 flex justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={inputs[i]}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={onPaste}
              aria-label={`Access code digit ${i + 1}`}
              className={`h-16 w-14 rounded-md border bg-ink-900/60 text-center font-numbers text-3xl font-bold tabular-nums text-ink-100 outline-none transition-all sm:h-20 sm:w-16 sm:text-4xl ${
                error
                  ? 'border-red-500/60 shadow-[0_0_0_1px_rgba(239,68,68,0.4)]'
                  : d
                    ? 'border-gold-500/60 shadow-[0_0_0_1px_rgba(212,175,55,0.4)]'
                    : 'border-white/10 focus:border-gold-500/40'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        <div className="mt-4 flex h-5 items-center justify-center">
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium tracking-wide text-red-400"
              >
                ◆ Invalid code
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Enter button */}
        <button
          type="button"
          onClick={() => attempt(digits.join(''))}
          disabled={digits.join('').length < 4}
          className="btn-gold mt-2 w-full justify-center text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enter
        </button>

        {/* Footer note */}
        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.25em] text-ink-400">
          MSS Technology Company W.L.L · CR 182156
        </p>
      </motion.div>
    </motion.div>
  )
}
