/**
 * Company logos shown next to the company name (projects, experience).
 * Logos are trademarks of their owners and are used here only to say where the work was done.
 * A company without an entry (e.g. the tax administration) gets a neutral icon instead.
 */
export interface CompanyLogo {
  src: string
  /** `plate`: logo has a transparent/white background and sits on a white chip. `tile`: full-bleed square. */
  kind: 'plate' | 'tile'
  name: string
}

const logos: Record<string, CompanyLogo> = {
  kontiki: { src: '/images/companies/kontiki.webp', kind: 'plate', name: 'Kontiki Service' },
  neoshore: { src: '/images/companies/neoshore.webp', kind: 'tile', name: 'Neoshore' },
  thegreenshot: { src: '/images/companies/thegreenshot.webp', kind: 'plate', name: 'The Greenshot' },
}

/** Logos for a company string such as "Neoshore Madagascar / Thegreenshot" (order is kept). */
export function logosFor(company: string): CompanyLogo[] {
  const text = company.toLowerCase()
  return Object.entries(logos)
    .filter(([key]) => text.includes(key))
    .sort(([a], [b]) => text.indexOf(a) - text.indexOf(b))
    .map(([, logo]) => logo)
}
