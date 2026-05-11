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
  { key: 'yuval' as const, photo: '/images/yuval-portrait.jpg',  discipline: 'Handstands', index: '01' },
  { key: 'gil'   as const, photo: '/images/gil-portrait.jpeg',   discipline: 'Freediving', index: '02' },
]

function FounderPanel({
  name,
  role,
  bio,
  photo,
  discipline,
  idx,
  flip,
  i,
}: {
  name: string
  role: string
  bio: string
  photo: string
  discipline: string
  idx: string
  flip: boolean
  i: number
}) {
  const firstName = name.split(' ')[0].toUpperCase()

  return (
    <div
      className="relative"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      dir="ltr"
    >
      {/* Giant name watermark — desktop only */}
      <div
        className="hidden lg:block"
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: flip ? 'auto' : '2rem',
          right: flip ? '2rem' : 'auto',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: 'clamp(8rem, 18vw, 18rem)',
          fontWeight: 600,
          letterSpacing: '-0.04em',
          color: 'rgba(255,255,255,0.03)',
          lineHeight: 1,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {firstName}
      </div>

      <div className={`relative z-10 grid grid-cols-1 lg:grid-cols-2`}>

        {/* Portrait column */}
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1, ease }}
          className={flip ? 'lg:order-2' : 'lg:order-1'}
          style={{
            position: 'relative',
            height: 'clamp(480px, 75svh, 800px)',
            overflow: 'hidden',
            background: '#060e17',
          }}
        >
          <Image
            src={photo}
            alt={name}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top', opacity: 0.82 }}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Gradient toward text side */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: flip
                ? 'linear-gradient(to left, rgba(11,29,42,0.6) 0%, transparent 55%)'
                : 'linear-gradient(to right, rgba(11,29,42,0.6) 0%, transparent 55%)',
            }}
          />
          {/* Bottom fade */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(11,29,42,0.55) 0%, transparent 40%)',
            }}
          />

          {/* Index + discipline tag */}
          <div
            style={{
              position: 'absolute',
              top: '2rem',
              left: flip ? 'auto' : '2rem',
              right: flip ? '2rem' : 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.35)',
                fontWeight: 400,
              }}
            >
              {idx}
            </span>
            <span
              style={{
                display: 'inline-block',
                fontSize: '9px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#D4A853',
                fontWeight: 600,
                border: '1px solid rgba(212,168,83,0.35)',
                padding: '0.25rem 0.65rem',
              }}
            >
              {discipline}
            </span>
          </div>

          {/* Name on photo — mobile */}
          <div
            className="lg:hidden"
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '2rem',
              right: '2rem',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(2.5rem, 10vw, 4rem)',
                fontWeight: 400,
                color: '#F7F4EF',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              {name}
            </h2>
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(232,213,183,0.45)', marginTop: '0.35rem' }}>
              {role}
            </p>
          </div>
        </motion.div>

        {/* Text column */}
        <motion.div
          initial={{ opacity: 0, x: flip ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className={flip ? 'lg:order-1' : 'lg:order-2'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(2.5rem, 6vw, 5rem) clamp(2rem, 5vw, 4.5rem)',
            background: '#0B1D2A',
          }}
        >
          {/* Name — desktop */}
          <div className="hidden lg:block" style={{ marginBottom: '2rem' }}>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(3rem, 5vw, 5rem)',
                fontWeight: 400,
                color: '#F7F4EF',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
              }}
            >
              {name}
            </h2>
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(232,213,183,0.4)',
                marginTop: '0.75rem',
                fontWeight: 400,
              }}
            >
              {role}
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: '40px', height: '1px', background: 'rgba(212,168,83,0.5)', marginBottom: '2rem' }} />

          {/* Bio paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {bio.split('\n\n').map((para, j) => (
              <p
                key={j}
                style={{
                  fontSize: 'clamp(14px, 1.35vw, 16px)',
                  lineHeight: 1.85,
                  color: j === 0 ? 'rgba(232,213,183,0.72)' : 'rgba(232,213,183,0.5)',
                  fontWeight: j === 0 ? 300 : 300,
                  maxWidth: '46ch',
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease }}
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {member.photo_url && (
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top', opacity: 0.82 }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div style={{ padding: '1.5rem 1.75rem 2rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '1.6rem',
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
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#D4A853',
            marginBottom: '1rem',
            fontWeight: 600,
          }}
        >
          {member.role}
        </p>
        {member.bio && (
          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.8,
              color: 'rgba(232,213,183,0.5)',
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
      {/* Nav gradient */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, rgba(5,12,20,0.9) 0%, transparent 100%)',
          zIndex: 40,
          pointerEvents: 'none',
        }}
      />

      {/* Page header */}
      <div style={{ paddingTop: 'clamp(7rem, 16svh, 10rem)' }} dir="ltr">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          style={{ padding: '0 clamp(1.5rem, 8vw, 6rem) clamp(3rem, 6vw, 5rem)' }}
        >
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#D4A853',
              marginBottom: '1.25rem',
              fontWeight: 600,
            }}
          >
            UpsideDown Retreat
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(4rem, 12vw, 11rem)',
              fontWeight: 400,
              color: '#F7F4EF',
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
            }}
          >
            {t.pageTitle}
          </h1>
        </motion.div>

        {/* Section label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem clamp(1.5rem, 8vw, 6rem)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span
            style={{
              fontSize: '9px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(232,213,183,0.3)',
              fontWeight: 600,
            }}
          >
            {t.foundersLabel}
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
        </div>
      </div>

      {/* Founders */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {founders.map((f, i) => (
          <FounderPanel
            key={f.key}
            name={t[f.key].name}
            role={t[f.key].role}
            bio={t[f.key].bio}
            photo={f.photo}
            discipline={f.discipline}
            idx={f.index}
            flip={i % 2 === 1}
            i={i}
          />
        ))}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(232,213,183,0.3)', fontWeight: 600 }}>
                {t.teamLabel}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            </div>
            <p
              style={{
                fontSize: 'clamp(14px, 1.5vw, 17px)',
                color: 'rgba(232,213,183,0.45)',
                fontWeight: 300,
                maxWidth: '48ch',
                lineHeight: 1.75,
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

      <div style={{ height: 'clamp(4rem, 8vw, 7rem)' }} />
    </div>
  )
}
