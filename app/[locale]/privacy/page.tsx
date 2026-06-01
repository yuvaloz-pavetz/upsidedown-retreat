import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: { index: false },
}

const CONTACT_EMAIL = 'upsidedownretreat@gmail.com'

const content = {
  en: {
    dir: 'ltr' as const,
    title: 'Privacy Policy',
    updated: 'Last updated: May 2026',
    contactLabel: 'For any questions about this privacy policy, contact us at ',
    sections: [
      {
        heading: '1. Who We Are',
        body: `UpsideDown Retreat ("we", "us", "our") is the data controller responsible for your personal data. We operate luxury handstand and freediving retreats.

Contact: upsidedownretreat@gmail.com`,
      },
      {
        heading: '2. Data We Collect',
        body: `We collect the following personal data:

• Newsletter sign-up: email address
• Event registration: first name, last name, email address, phone number (optional), chosen event and room type
• Waitlist: name, email address, requested event

We do not use tracking cookies or third-party analytics. Accessibility preferences (font size, contrast) are stored locally in your browser only and never transmitted to us.`,
      },
      {
        heading: '3. Why We Collect It (Legal Basis)',
        body: `• Newsletter: based on your explicit consent (GDPR Article 6(1)(a)). You can withdraw consent at any time by clicking "Unsubscribe" in any email or contacting us directly.
• Event registration and waitlist: based on pre-contractual steps at your request and our legitimate interest in managing participation (GDPR Article 6(1)(b) and 6(1)(f)).`,
      },
      {
        heading: '4. How We Use Your Data',
        body: `• To send you retreat updates and news (newsletter only, with consent)
• To process your event registration and communicate with you about your participation
• To notify you if a spot opens (waitlist)
• To send our team internal notifications about new registrations`,
      },
      {
        heading: '5. Third-Party Processors',
        body: `We share data with the following processors under data processing agreements:

• Supabase (database hosting) — data stored on EU-region servers
• Brevo (email and contact management) — EU-based platform, GDPR compliant

We do not sell your data to third parties.`,
      },
      {
        heading: '6. How Long We Keep Your Data',
        body: `• Newsletter subscribers: until you withdraw consent
• Registration data: for the duration of the retreat plus 12 months for administrative purposes
• Waitlist data: until the event is no longer available or you ask us to remove you

You can request deletion at any time by emailing us.`,
      },
      {
        heading: '7. Your Rights',
        body: `Under GDPR you have the right to:

• Access — request a copy of the personal data we hold about you
• Rectification — correct inaccurate or incomplete data
• Erasure — request deletion of your data ("right to be forgotten")
• Restriction — ask us to limit how we process your data
• Portability — receive your data in a machine-readable format
• Objection — object to processing based on legitimate interest
• Withdraw consent — at any time, for consent-based processing

To exercise any right, email us at: upsidedownretreat@gmail.com
We will respond within 30 days.`,
      },
      {
        heading: '8. Supervisory Authority',
        body: `If you believe we have not handled your data lawfully, you have the right to lodge a complaint with your local data protection authority. In Israel: the Privacy Protection Authority (PPA). In the EU: the supervisory authority in your country of residence.`,
      },
      {
        heading: '9. Changes to This Policy',
        body: `We may update this policy from time to time. The "Last updated" date at the top of this page will reflect any changes. Continued use of the site after changes constitutes acceptance of the revised policy.`,
      },
    ],
  },
  he: {
    dir: 'rtl' as const,
    title: 'מדיניות פרטיות',
    updated: 'עודכן לאחרונה: מאי 2026',
    contactLabel: 'לכל שאלה בנוגע למדיניות פרטיות זו, פנה/י אלינו ב-',
    sections: [
      {
        heading: '1. מי אנחנו',
        body: `UpsideDown Retreat ("אנחנו") הוא הגורם האחראי לעיבוד הנתונים האישיים שלך. אנו מפעילים ריטריטים יוקרתיים של עמידת ידיים וצלילה חופשית.

צור קשר: upsidedownretreat@gmail.com`,
      },
      {
        heading: '2. איזה מידע אנו אוספים',
        body: `אנו אוספים את המידע האישי הבא:

• הרשמה לניוזלטר: כתובת אימייל
• הרשמה לאירוע: שם פרטי, שם משפחה, אימייל, טלפון (אופציונלי), סוג חדר שנבחר
• רשימת המתנה: שם, אימייל, שם הריטריט

אנו לא משתמשים בעוגיות מעקב או כלי אנליטיקה של צד שלישי. הגדרות נגישות (גודל גופן, ניגודיות) נשמרות מקומית בדפדפן שלך בלבד ולעולם אינן מועברות אלינו.`,
      },
      {
        heading: '3. מדוע אנו אוספים מידע (בסיס משפטי)',
        body: `• ניוזלטר: על בסיס הסכמתך המפורשת (GDPR סעיף 6(1)(א)). ניתן לבטל הסכמה בכל עת דרך לחיצה על "הסרה מרשימה" בכל מייל, או בפנייה ישירה אלינו.
• הרשמה לאירוע ורשימת המתנה: על בסיס צעדים טרום-חוזיים לפי בקשתך ועניין לגיטימי שלנו בניהול ההשתתפות (GDPR סעיף 6(1)(ב) ו-6(1)(ו)).`,
      },
      {
        heading: '4. כיצד אנו משתמשים במידע',
        body: `• לשליחת עדכונים וחדשות על ריטריטים (ניוזלטר, בהסכמה בלבד)
• לניהול ההרשמה שלך ולתקשורת בנוגע להשתתפות
• להודעה אם יתפנה מקום (רשימת המתנה)
• להעברת הודעות פנימיות לצוות על הרשמות חדשות`,
      },
      {
        heading: '5. מעבד נתונים צד שלישי',
        body: `אנו משתפים נתונים עם הגורמים הבאים תחת הסכמי עיבוד נתונים:

• Supabase (אחסון מסד נתונים) — נתונים מאוחסנים בשרתים באזור האיחוד האירופי
• Brevo (ניהול אימייל ואנשי קשר) — פלטפורמה אירופאית, עומדת ב-GDPR

אנו לא מוכרים את הנתונים שלך לצדדים שלישיים.`,
      },
      {
        heading: '6. כמה זמן שומרים את המידע',
        body: `• מנויי ניוזלטר: עד לביטול ההסכמה
• נתוני הרשמה: למשך הריטריט ועוד 12 חודשים למטרות ניהוליות
• נתוני רשימת המתנה: עד שהאירוע אינו זמין יותר, או עד לבקשת מחיקה

ניתן לבקש מחיקה בכל עת בפנייה במייל.`,
      },
      {
        heading: '7. הזכויות שלך',
        body: `מכוח ה-GDPR יש לך זכות ל:

• גישה — לקבל עותק של הנתונים האישיים שאנו מחזיקים עליך
• תיקון — לתקן מידע שגוי או חסר
• מחיקה — לבקש מחיקת נתוניך ("הזכות להישכח")
• הגבלת עיבוד — לבקש מגבלות על אופן עיבוד הנתונים
• ניידות — לקבל את הנתונים שלך בפורמט קריא למחשב
• התנגדות — להתנגד לעיבוד המבוסס על עניין לגיטימי
• ביטול הסכמה — בכל עת, לגבי עיבוד מבוסס הסכמה

לממש כל זכות, שלח/י מייל ל: upsidedownretreat@gmail.com
נשיב תוך 30 יום.`,
      },
      {
        heading: '8. רשות פיקוח',
        body: `אם אתה סבור שלא טיפלנו בנתוניך כדין, יש לך זכות להגיש תלונה לרשות הגנת הפרטיות (ILPA) בישראל, או לרשות הפיקוח במדינת מגוריך באיחוד האירופי.`,
      },
      {
        heading: '9. שינויים במדיניות',
        body: `אנו עשויים לעדכן מדיניות זו מעת לעת. תאריך "עודכן לאחרונה" בראש הדף ישקף כל שינוי. המשך שימוש באתר לאחר שינויים מהווה הסכמה למדיניות המעודכנת.`,
      },
    ],
  },
}

function renderBody(body: string, linkStyle: React.CSSProperties, bodyStyle: React.CSSProperties) {
  const parts = body.split(CONTACT_EMAIL)
  if (parts.length === 1) {
    return <p style={bodyStyle}>{body}</p>
  }
  return (
    <p style={bodyStyle}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <a href={`mailto:${CONTACT_EMAIL}`} style={linkStyle}>{CONTACT_EMAIL}</a>
          )}
        </span>
      ))}
    </p>
  )
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params
  const lang: Locale = locale === 'he' ? 'he' : 'en'
  const c = content[lang]

  const linkStyle: React.CSSProperties = {
    color: '#D4A853',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  }

  const headingStyle: React.CSSProperties = {
    fontFamily: 'var(--font-cormorant), Georgia, serif',
    fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
    fontWeight: 500,
    color: '#E8D5B7',
    marginBottom: '0.85rem',
    lineHeight: 1.3,
  }

  const bodyStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    color: 'rgba(232,213,183,0.85)',
    lineHeight: 1.8,
    fontWeight: 400,
    whiteSpace: 'pre-line',
  }

  return (
    <>
      <Nav locale={lang} />
      <main
        id="main-content"
        dir={c.dir}
        style={{ background: '#0B1D2A', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '6rem' }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem' }}>
          <p
            style={{
              fontSize: '13px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#D4A853',
              marginBottom: '1.25rem',
              fontWeight: 600,
            }}
          >
            Legal
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#E8D5B7',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
            }}
          >
            {c.title}
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(232,213,183,0.5)',
              marginBottom: '3.5rem',
              letterSpacing: '0.04em',
            }}
          >
            {c.updated}
          </p>

          <div style={{ borderBottom: '1px solid rgba(232,213,183,0.08)', marginBottom: '3rem' }} />

          {c.sections.map((section) => (
            <div key={section.heading} style={{ marginBottom: '2.5rem' }}>
              <h2 style={headingStyle}>{section.heading}</h2>
              {renderBody(section.body, linkStyle, bodyStyle)}
            </div>
          ))}

          <div style={{ borderTop: '1px solid rgba(232,213,183,0.08)', marginTop: '3rem', paddingTop: '2rem' }}>
            <p style={{ fontSize: '14px', color: 'rgba(232,213,183,0.6)', lineHeight: 1.7 }}>
              {c.contactLabel}
              <a href={`mailto:${CONTACT_EMAIL}`} style={linkStyle}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        </div>
      </main>
      <Footer locale={lang} />
    </>
  )
}
