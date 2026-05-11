import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import AboutPage from '@/components/sections/AboutPage'
import type { TeamMember } from '@/lib/supabase/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isHe = locale === 'he'
  return {
    title: isHe ? 'אודות | UpsideDown Retreat' : 'About | UpsideDown Retreat',
    description: isHe
      ? 'הכירו את המייסדים והצוות של UpsideDown Retreat.'
      : 'Meet the founders and team behind UpsideDown Retreat.',
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: '/en/about', he: '/he/about' },
    },
  }
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = (locale === 'he' ? 'he' : 'en') as Locale

  let teamMembers: TeamMember[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true })
    teamMembers = (data as TeamMember[]) ?? []
  } catch {
    teamMembers = []
  }

  return (
    <>
      <Nav locale={loc} />
      <AboutPage locale={loc} teamMembers={teamMembers} />
      <Footer locale={loc} />
    </>
  )
}
