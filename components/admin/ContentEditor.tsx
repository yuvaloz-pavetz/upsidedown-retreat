'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ContentRow = { key: string; locale: string; value: string }

type ContentField = { key: string; label: string; multiline?: boolean; hint?: string }
type ContentSection = { id: string; title: string; fields: ContentField[] }

const SECTIONS: ContentSection[] = [
  {
    id: 'hero',
    title: 'Hero',
    fields: [
      { key: 'hero.eyebrow', label: 'Eyebrow', hint: 'Tiny text above the main title (e.g. "Crete, Greece · June 2025")' },
      { key: 'hero.subtitle', label: 'Subtitle', hint: 'Italic line below "UpsideDown Retreat" — the one-line description of the retreat' },
      { key: 'hero.cta', label: 'CTA Button', hint: 'Currently unused — hero button now links to Upcoming Events' },
    ],
  },
  {
    id: 'experience',
    title: 'Experience',
    fields: [
      { key: 'experience.above.eyebrow', label: 'Above — Eyebrow', hint: 'Small label above the handstands heading (left column)' },
      { key: 'experience.above.heading', label: 'Above — Heading', hint: 'Main heading for the handstands side, e.g. "Above the surface"' },
      { key: 'experience.above.body', label: 'Above — Body text', multiline: true, hint: 'Paragraph describing handstand training' },
      { key: 'experience.below.eyebrow', label: 'Below — Eyebrow', hint: 'Small label above the freediving heading (right column)' },
      { key: 'experience.below.heading', label: 'Below — Heading', hint: 'Main heading for the freediving side, e.g. "Below the surface"' },
      { key: 'experience.below.body', label: 'Below — Body text', multiline: true, hint: 'Paragraph describing freediving' },
    ],
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    fields: [
      { key: 'testimonials.heading', label: 'Section heading', hint: 'Large heading above the testimonial quotes' },
    ],
  },
  {
    id: 'instructors',
    title: 'Instructors',
    fields: [
      { key: 'instructors.yuvalBio', label: 'Yuval — Bio', multiline: true, hint: 'Short bio paragraph under Yuval\'s name and title' },
      { key: 'instructors.gilBio', label: 'Gil — Bio', multiline: true, hint: 'Short bio paragraph under Gil\'s name and title' },
    ],
  },
  {
    id: 'newsletter',
    title: 'Newsletter',
    fields: [
      { key: 'newsletter.heading', label: 'Heading', hint: 'Large text above the email signup form' },
      { key: 'newsletter.subtext', label: 'Subtext', hint: 'Small text below the heading, above the email input' },
    ],
  },
  {
    id: 'retreat',
    title: 'Retreat Section',
    fields: [
      { key: 'retreat.cta', label: 'CTA Button', hint: 'Button text on the upcoming retreat card, e.g. "Secure Your Place"' },
      { key: 'retreat.disclaimer', label: 'Disclaimer', hint: 'Small text below the button, e.g. about payment or refund policy' },
    ],
  },
  {
    id: 'events',
    title: 'Events Page',
    fields: [
      { key: 'events.pageTitle', label: 'Page title', hint: 'Main heading on the /events listing page' },
      { key: 'events.pageSubtext', label: 'Page subtext', hint: 'Subtitle below the heading on the /events page' },
      { key: 'events.noEvents', label: 'Empty state message', hint: 'Shown when there are no upcoming events listed' },
    ],
  },
  {
    id: 'footer',
    title: 'Footer',
    fields: [
      { key: 'footer.copyright', label: 'Copyright', hint: 'Small copyright line at the very bottom of every page' },
    ],
  },
]

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '6px',
  color: '#e2e8f0',
  fontSize: '0.875rem',
  padding: '0.6rem 0.75rem',
  outline: 'none',
  resize: 'vertical' as const,
  fontFamily: 'inherit',
  lineHeight: 1.5,
}

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'rgba(226,232,240,0.4)',
  marginBottom: '0.4rem',
}

const hintStyle = {
  fontSize: '0.75rem',
  color: 'rgba(226,232,240,0.25)',
  margin: '0 0 0.6rem',
  lineHeight: 1.5,
  fontStyle: 'italic' as const,
}

export default function ContentEditor({ initialRows }: { initialRows: ContentRow[] }) {
  const [activeSection, setActiveSection] = useState('hero')
  const [rows, setRows] = useState<ContentRow[]>(initialRows)
  const [saving, setSaving] = useState(false)
  const [savedSection, setSavedSection] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function getValue(key: string, locale: string): string {
    return rows.find(r => r.key === key && r.locale === locale)?.value ?? ''
  }

  function setValue(key: string, locale: string, value: string) {
    setRows(prev => {
      const idx = prev.findIndex(r => r.key === key && r.locale === locale)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { key, locale, value }
        return next
      }
      return [...prev, { key, locale, value }]
    })
  }

  async function saveSection(sectionId: string) {
    const section = SECTIONS.find(s => s.id === sectionId)
    if (!section) return
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const upserts = section.fields.flatMap(field =>
      ['en', 'he'].map(locale => ({
        key: field.key,
        locale,
        value: getValue(field.key, locale),
      }))
    ).filter(r => r.value.trim().length > 0)

    const { error: err } = await supabase
      .from('site_content')
      .upsert(upserts, { onConflict: 'key,locale' })

    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      setSavedSection(sectionId)
      setTimeout(() => setSavedSection(null), 2500)
    }
  }

  const currentSection = SECTIONS.find(s => s.id === activeSection)!

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', margin: 0 }}>Content</h1>
        <p style={{ color: 'rgba(226,232,240,0.35)', fontSize: '0.78rem' }}>
          Changes go live immediately on save
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Section nav */}
        <div style={{ width: '160px', flexShrink: 0 }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                textAlign: 'left',
                padding: '0.55rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                background: activeSection === s.id ? 'rgba(255,255,255,0.07)' : 'transparent',
                color: activeSection === s.id ? '#e2e8f0' : 'rgba(226,232,240,0.45)',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '0.15rem',
                transition: 'all 0.15s',
              }}
            >
              {savedSection === s.id && (
                <span style={{ color: '#4ade80', fontSize: '0.65rem' }}>✓</span>
              )}
              {s.title}
            </button>
          ))}
        </div>

        {/* Editor panel */}
        <div style={{ flex: 1, maxWidth: '760px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 500, color: '#e2e8f0', margin: 0 }}>
              {currentSection.title}
            </h2>
            <button
              onClick={() => saveSection(activeSection)}
              disabled={saving}
              style={{
                padding: '0.5rem 1.4rem',
                background: savedSection === activeSection ? '#4ade80' : '#D4A853',
                color: '#0d1520',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
            >
              {saving ? 'Saving…' : savedSection === activeSection ? '✓ Saved' : 'Save'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {(['en', 'he'] as const).map(loc => (
              <span key={loc} style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'rgba(212,168,83,0.1)',
                color: '#D4A853',
                border: '1px solid rgba(212,168,83,0.25)',
              }}>
                {loc === 'en' ? 'English' : 'עברית'}
              </span>
            ))}
          </div>

          {currentSection.fields.map(field => (
            <div key={field.key} style={{ marginBottom: '2rem' }}>
              <p style={{ ...labelStyle, marginBottom: field.hint ? '0.3rem' : '0.75rem' }}>{field.label}</p>
              {field.hint && <p style={hintStyle}>{field.hint}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {(['en', 'he'] as const).map(locale => (
                  <div key={locale}>
                    <span style={{ ...labelStyle, fontSize: '0.6rem', marginBottom: '0.3rem' }}>
                      {locale === 'en' ? 'EN' : 'HE'}
                    </span>
                    {field.multiline ? (
                      <textarea
                        value={getValue(field.key, locale)}
                        onChange={e => setValue(field.key, locale, e.target.value)}
                        rows={4}
                        dir={locale === 'he' ? 'rtl' : 'ltr'}
                        style={inputStyle}
                      />
                    ) : (
                      <input
                        type="text"
                        value={getValue(field.key, locale)}
                        onChange={e => setValue(field.key, locale, e.target.value)}
                        dir={locale === 'he' ? 'rtl' : 'ltr'}
                        style={inputStyle}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
