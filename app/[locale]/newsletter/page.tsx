import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import NewsletterLanding from '@/components/sections/NewsletterLanding'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isHe = locale === 'he'
  return {
    title: isHe ? 'הצטרפו לרשימת התפוצה | UpsideDown Retreat' : 'Join the List | UpsideDown Retreat',
    description: isHe
      ? 'תאריכים חדשים לפני שהם מתפרסמים בכל מקום אחר, ורשמים אמיתיים מהמים. בלי ספאם.'
      : 'New retreat dates before they go public, plus honest notes from the water. No spam.',
    alternates: {
      canonical: `/${locale}/newsletter`,
      languages: { en: '/en/newsletter', he: '/he/newsletter' },
    },
  }
}

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = (locale === 'he' ? 'he' : 'en') as Locale

  return (
    <>
      <Nav locale={loc} />
      <NewsletterLanding locale={loc} />
      <Footer locale={loc} />
    </>
  )
}
