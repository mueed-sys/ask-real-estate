// Site-protection deterrents — disabled in dev so working with the codebase
// stays sane. These are deterrents, not security: any determined user can
// disable JS or use browser menus to bypass.

const isDev = import.meta.env.DEV

// Allow right-click and standard shortcuts inside form inputs so users can
// still copy / paste / spell-check / use context-aware browser features.
function isInteractive(el) {
  if (!el) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  return false
}

function blockContextMenu(e) {
  if (isInteractive(e.target)) return
  e.preventDefault()
}

function blockShortcuts(e) {
  // Allow when user is typing in a form field
  if (isInteractive(e.target)) return

  // F12 — DevTools
  if (e.key === 'F12') {
    e.preventDefault()
    return
  }

  // Use ctrlKey OR metaKey so we catch Mac (⌘) and Windows/Linux (Ctrl) alike
  const cmd = e.ctrlKey || e.metaKey

  // Ctrl/Cmd+U — view source
  if (cmd && (e.key === 'u' || e.key === 'U')) {
    e.preventDefault()
    return
  }

  // Ctrl/Cmd+Shift+I — DevTools / Inspector
  // Ctrl/Cmd+Shift+J — DevTools console
  // Ctrl/Cmd+Shift+C — DevTools element picker
  if (cmd && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
    e.preventDefault()
    return
  }

  // Cmd+Option+I/J/C — Mac DevTools
  if (e.metaKey && e.altKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
    e.preventDefault()
    return
  }
}

// Console warning — proprietary notice. Styled so it stands out if anyone
// does open the console.
function printConsoleWarning() {
  const big = [
    'background: #0a0b14',
    'color: #d4af37',
    'font-size: 18px',
    'font-weight: 700',
    'padding: 12px 16px',
    'border-radius: 4px',
    'border: 1px solid rgba(212, 175, 55, 0.4)',
    'font-family: Georgia, serif',
  ].join(';')

  const body = [
    'background: #0a0b14',
    'color: #e0e3ee',
    'font-size: 13px',
    'padding: 8px 16px',
    'line-height: 1.6',
  ].join(';')

  console.log('%cASK Real Estate — Stop.', big)
  console.log(
    '%cThis site is proprietary software of MSS Tech.\nUnauthorized copying or reproduction is prohibited.\nCR 182156.',
    body
  )
}

export function installProtection() {
  if (isDev) return

  // Right-click
  document.addEventListener('contextmenu', blockContextMenu, { capture: true })

  // Keyboard shortcuts
  document.addEventListener('keydown', blockShortcuts, { capture: true })

  // Console warning — fires on first paint
  printConsoleWarning()
}
