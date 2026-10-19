// Renders og.html to public/og.png (1200x630) and the favicon to
// public/apple-touch-icon.png (180x180) with headless Chrome.
// Run against a running dev server: npm run og -- http://localhost:5173
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const origin = (process.argv[2] ?? 'http://localhost:5173').replace(/\/$/, '')
const profile = mkdtempSync(join(tmpdir(), 'cv-og-'))

// iOS rounds the corners itself, so the touch icon is a full square
const touchIcon =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" fill="#1a2540"/>' +
      '<circle cx="32" cy="32" r="17" fill="none" stroke="#f2f5f9" stroke-width="5"/>' +
      '<circle cx="32" cy="32" r="8" fill="#c3f07a"/></svg>',
  )

const shots = [
  { out: 'public/og.png', size: '1200,630', url: `${origin}/cv/og.html` },
  { out: 'public/apple-touch-icon.png', size: '180,180', url: touchIcon },
]

try {
  for (const shot of shots) {
    execFileSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      `--user-data-dir=${profile}`,
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${shot.size}`,
      '--virtual-time-budget=10000',
      `--screenshot=${shot.out}`,
      shot.url,
    ])
    console.log(`saved ${shot.out}`)
  }
} finally {
  rmSync(profile, { recursive: true, force: true })
}
