'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { i18n, type Locale } from '@/lib/i18n'
import type { TeamMember } from '@/lib/supabase/types'

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

interface AboutPageProps {
  locale: Locale
  teamMembers: TeamMember[]
}

const founders = [
  {
    key: 'yuval' as const,
    photo: '/images/yuval-portrait.jpg',
    discipline: 'Handstands',
  },
  {
    key: 'gil' as const,
    photo: '/images/gil-portrait.jpeg',
    discipline: 'Freediving',
  },
]

function FounderCard({
  name,
  role,
  bio,
  photo,
  discipline,
  flip,
  index,
}: {
  name: string
  role: string
  bio: string
  photo: string
  discipline: string
  flip: boolean
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: index * 0.1, ease }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-0`}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      dir="ltr"
    >
      {/* Photo */}
      <div
        className={flip ? 'lg:order-2' : 'lg:order-1'}
        style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: '#0a1825' }}
      >
        <Image
          src={photo}
          alt={name}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center top', opacity: 0.88 }}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: flip
              ? 'linear-gradient(to right, rgba(11,29,42,0.25) 0%, transparent 50%)'
              : 'linear-gradient(to left, rgba(11,29,42,0.25) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            right: '2rem',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#D4A853',
              fontWeight: 500,
              background: 'rgba(11,29,42,0.6)',
              padding: '0.35rem 0.75rem',
              backdropFilter: 'blur(8px)',
            }}
          >
            {discipline}
          </span>
        </div>
      </div>

      {/* Bio */}
      <div
        className={flip ? 'lg:order-1' : 'lg:order-2'}
        style={{
          padding: 'clamp(2.5rem, 6vw, 5rem) clamp(2rem, 5vw, 4.5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#0B1D2A',
        }}
      >
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#D4A853',
            marginBottom: '1.25rem',
            fontWeight: 500,
          }}
        >
          Founder
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
            fontWeight: 400,
            color: '#F7F4EF',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            marginBottom: '0.5rem',
          }}
        >
          {name}
        </h2>
        <p
          style={{
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(232,213,183,0.5)',
            marginBottom: '2rem',
            fontWeight: 400,
          }}
        >
          {role}
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {bio.split('\n\n').map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                lineHeight: 1.8,
                color: 'rgba(232,213,183,0.65)',
                fontWeight: 300,
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease }}
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {member.photo_url && (
        <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top', opacity: 0.85 }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div style={{ padding: '1.5rem 1.75rem 2rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#F7F4EF',
            marginBottom: '0.25rem',
            letterSpacing: '-0.01em',
          }}
        >
          {member.name}
        </h3>
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#D4A853',
            marginBottom: '1rem',
            fontWeight: 500,
          }}
        >
          {member.role}
        </p>
        {member.bio && (
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.75,
              color: 'rgba(232,213,183,0.55)',
              fontWeight: 300,
            }}
          >
            {member.bio}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function AboutPage({ locale, teamMembers }: AboutPageProps) {
  const t = i18n[locale].about

  return (
    <div style={{ background: '#0B1D2A', minHeight: '100vh' }}>
      {/* Top gradient for nav contrast */}
      <div
        style={{
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(5,12,20,0.95) 0%, rgba(11,29,42,0) 100%)',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        style={{
          padding: 'clamp(1rem, 4vw, 3rem) clamp(1.5rem, 8vw, 6rem) clamp(3rem, 6vw, 5rem)',
        }}
        dir="ltr"
      >
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#D4A853',
            marginBottom: '1rem',
            fontWeight: 500,
          }}
        >
          UpsideDown Retreat
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(3rem, 7vw, 7rem)',
            fontWeight: 400,
            color: '#F7F4EF',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {t.pageTitle}
        </h1>
      </motion.div>

      {/* Founders */}
      <section>
        <div
          style={{
            padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 8vw, 6rem) 1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
          dir="ltr"
        >
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(232,213,183,0.4)',
              fontWeight: 500,
            }}
          >
            {t.foundersLabel}
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {founders.map((f, i) => (
            <FounderCard
              key={f.key}
              name={t[f.key].name}
              role={t[f.key].role}
              bio={t[f.key].bio}
              photo={f.photo}
              discipline={f.discipline}
              flip={i % 2 === 1}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Team */}
      {teamMembers.length > 0 && (
        <section style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 8vw, 6rem)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}
            dir="ltr"
          >
            <p
              style={{
                fontSize: '10px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#D4A853',
                marginBottom: '1rem',
                fontWeight: 500,
              }}
            >
              {t.teamLabel}
            </p>
            <p
              style={{
                fontSize: 'clamp(14px, 1.5vw, 17px)',
                color: 'rgba(232,213,183,0.5)',
                fontWeight: 300,
                maxWidth: '48ch',
                lineHeight: 1.7,
              }}
            >
              {t.teamSubtext}
            </p>
          </motion.div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: '2px' }}
            dir="ltr"
          >
            {teamMembers.map((m, i) => (
              <TeamMemberCard key={m.id} member={m} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom padding */}
      <div style={{ height: 'clamp(4rem, 8vw, 7rem)' }} />
    </div>
  )
}
