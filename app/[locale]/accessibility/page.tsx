import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isHe = locale === 'he'
  return {
    title: isHe ? 'הצהרת נגישות | UpsideDown Retreat' : 'Accessibility Statement | UpsideDown Retreat',
    description: isHe
      ? 'הצהרת הנגישות של אתר UpsideDown Retreat בהתאם לתקן WCAG 2.1 AA ותקן ישראלי SI 5568.'
      : 'UpsideDown Retreat accessibility statement — WCAG 2.1 AA and Israeli Standard SI 5568 compliance.',
    alternates: {
      canonical: `/${locale}/accessibility`,
      languages: { en: '/en/accessibility', he: '/he/accessibility' },
    },
  }
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = (locale === 'he' ? 'he' : 'en') as Locale
  const isHe = loc === 'he'

  const bg = '#0B1D2A'
  const text = '#E8D5B7'
  const gold = '#D4A853'
  const muted = 'rgba(232,213,183,0.82)'
  const border = 'rgba(232,213,183,0.3)'

  return (
    <main id="main-content" style={{ background: bg, minHeight: '100vh', color: text }}>
      <Nav locale={loc} />

      <div
        dir={isHe ? 'rtl' : 'ltr'}
        style={{
          maxWidth: '740px',
          margin: '0 auto',
          padding: 'clamp(100px, 15vh, 160px) 1.5rem clamp(60px, 8vh, 100px)',
        }}
      >
        {/* Page heading */}
        <h1
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            color: text,
            marginBottom: '0.5rem',
          }}
        >
          {isHe ? 'הצהרת נגישות' : 'Accessibility Statement'}
        </h1>

        {/* Date */}
        <p style={{ fontSize: '13px', color: muted, marginBottom: '2.5rem', letterSpacing: '0.08em' }}>
          {isHe ? 'עדכון אחרון: 2026' : 'Last updated: 2026'}
        </p>

        <div style={{ height: '1px', background: border, marginBottom: '2.5rem' }} />

        {/* Commitment */}
        <section style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 400,
              color: gold,
              marginBottom: '0.75rem',
            }}
          >
            {isHe ? 'מחויבות לנגישות' : 'Our commitment'}
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: text }}>
            {isHe
              ? 'UpsideDown Retreat מחויבת לנגישות דיגיטלית עבור אנשים עם מוגבלויות. אנו שואפים לעמוד ברמת הנגישות AA של WCAG 2.1 ובתקן הישראלי SI 5568 (תקנות שוויון זכויות לאנשים עם מוגבלות, תקנות נגישות לשירות), ומתחייבים לשפר ברציפות את חוויית המשתמש לכולם.'
              : 'UpsideDown Retreat is committed to digital accessibility for people with disabilities. We aim to conform to WCAG 2.1 Level AA and Israeli Standard SI 5568 (Equal Rights for Persons with Disabilities — Accessibility of Service), and we continually work to improve the user experience for everyone.'}
          </p>
        </section>

        {/* Measures taken */}
        <section style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 400,
              color: gold,
              marginBottom: '0.75rem',
            }}
          >
            {isHe ? 'אמצעים שננקטו' : 'Measures taken'}
          </h2>
          <ul style={{ fontSize: '15px', lineHeight: 1.9, color: text, paddingInlineStart: '1.4rem' }}>
            {isHe ? (
              <>
                <li>ניווט מקלדת מלא עם טבעות פוקוס גלויות</li>
                <li>קישור "דלג לתוכן הראשי" בראש כל עמוד</li>
                <li>תמיכה בקוראי מסך (ARIA landmarks, role, label)</li>
                <li>טקסט חלופי לכל התמונות</li>
                <li>הכתובית הטקסטואלית זמינה לכל התכנים</li>
                <li>יחס ניגוד צבעים עומד בדרישות AA</li>
                <li>כלי נגישות מובנה לשינוי גופן וניגודיות גבוהה</li>
                <li>תמיכה בהפחתת תנועה (prefers-reduced-motion)</li>
              </>
            ) : (
              <>
                <li>Full keyboard navigation with visible focus rings</li>
                <li>"Skip to main content" link on every page</li>
                <li>Screen reader support via ARIA landmarks, roles, and labels</li>
                <li>Descriptive alt text on all images</li>
                <li>Sufficient colour contrast ratios meeting AA requirements</li>
                <li>Built-in accessibility widget for font size and high contrast</li>
                <li>Respects prefers-reduced-motion user preference</li>
              </>
            )}
          </ul>
        </section>

        {/* Known limitations */}
        <section style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 400,
              color: gold,
              marginBottom: '0.75rem',
            }}
          >
            {isHe ? 'מגבלות ידועות' : 'Known limitations'}
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: text }}>
            {isHe
              ? 'ייתכן שחלק מהתכנים המוטמעים (כגון פוסטים מאינסטגרם) אינם עומדים במלוא דרישות הנגישות. אנו פועלים לשיפור מתמיד.'
              : 'Some embedded third-party content (such as Instagram posts) may not fully meet accessibility requirements. We are actively working to improve these areas.'}
          </p>
        </section>

        <div style={{ height: '1px', background: border, marginBottom: '2.5rem' }} />

        {/* Contact */}
        <section style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 400,
              color: gold,
              marginBottom: '0.75rem',
            }}
          >
            {isHe ? 'צור קשר בנושא נגישות' : 'Contact us about accessibility'}
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: text, marginBottom: '0.75rem' }}>
            {isHe
              ? 'אם נתקלתם בבעיית נגישות באתר, נשמח לשמוע. צרו קשר:'
              : 'If you experience any accessibility barriers on this site, please reach out:'}
          </p>
          <a
            href="mailto:upsidedownretreat@gmail.com"
            style={{
              color: gold,
              fontSize: '15px',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            upsidedownretreat@gmail.com
          </a>
          <p style={{ fontSize: '13px', color: muted, marginTop: '0.75rem', lineHeight: 1.65 }}>
            {isHe
              ? 'אנו מתחייבים להשיב בתוך 5 ימי עסקים.'
              : 'We aim to respond within 5 business days.'}
          </p>
        </section>
      </div>

      <Footer locale={loc} />
    </main>
  )
}
