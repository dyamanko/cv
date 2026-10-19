// Prints resume.html to PDF in both languages with headless Chrome.
// Run against a running dev or preview server:
//   npm run dev  &&  npm run pdf -- http://localhost:5173
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const origin = (process.argv[2] ?? 'http://localhost:5173').replace(/\/$/, '')
const profile = mkdtempSync(join(tmpdir(), 'cv-pdf-'))

try {
  for (const lang of ['ru', 'en']) {
    const out = `public/resume/dmitrii-iamanko-${lang}.pdf`
    execFileSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      `--user-data-dir=${profile}`,
      '--no-pdf-header-footer',
      '--virtual-time-budget=10000',
      `--print-to-pdf=${out}`,
      `${origin}/cv/resume.html?lang=${lang}`,
    ])
    console.log(`saved ${out}`)
  }
} finally {
  rmSync(profile, { recursive: true, force: true })
}
