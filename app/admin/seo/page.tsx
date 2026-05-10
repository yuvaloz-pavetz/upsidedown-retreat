import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import { analyzeRetreat, getSiteChecks } from '@/lib/seo'
import type { RetreatRow } from '@/lib/supabase/types'

function scoreColor(score: number) {
  if (score >= 80) return '#4ade80'
  if (score >= 50) return '#D4A853'
  return '#f87171'
}

function severityIcon(severity: string) {
  if (severity === 'error') return '✕'
  if (severity === 'warning') return '⚠'
  return '·'
}

function severityColor(severity: string) {
  if (severity === 'error') return '#f87171'
  if (severity === 'warning') return '#D4A853'
  return 'rgba(226,232,240,0.4)'
}

function statusIcon(status: string) {
  if (status === 'ok') return '✓'
  if (status === 'warning') return '⚠'
  return '✕'
}

function statusColor(status: string) {
  if (status === 'ok') return '#4ade80'
  if (status === 'warning') return '#D4A853'
  return '#f87171'
}

export default async function SEOPage() {
  const supabase = await createClient()
  const { data: retreats } = await supabase
    .from('retreats')
    .select('*')
    .order('sort_order', { ascending: true })

  const reports = (retreats as RetreatRow[] ?? []).map(analyzeRetreat)
  const siteChecks = getSiteChecks()

  const siteScore = Math.round(
    siteChecks.filter(c => c.status === 'ok').length / siteChecks.length * 100
  )

  return (
    <AdminShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', margin: 0 }}>SEO</h1>
        <p style={{ color: 'rgba(226,232,240,0.35)', fontSize: '0.78rem' }}>
          Live analysis — refresh page to update
        </p>
      </div>

      {/* Site-wide checks */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(226,232,240,0.6)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Site-wide
          </h2>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: scoreColor(siteScore) }}>
            {siteScore}%
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.5rem' }}>
          {siteChecks.map(item => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: statusColor(item.status), flexShrink: 0, marginTop: '1px' }}>
                {statusIcon(item.status)}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.2rem' }}>
                  {item.label}
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', lineHeight: 1.4 }}>
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Per-retreat reports */}
      <section>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(226,232,240,0.6)', marginBottom: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Retreat Pages
        </h2>

        {reports.length === 0 ? (
          <p style={{ color: 'rgba(226,232,240,0.35)', fontSize: '0.9rem' }}>No retreats found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reports.map(report => (
              <div
                key={report.slug}
                style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  {/* Score ring */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: `2px solid ${scoreColor(report.score)}`,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: scoreColor(report.score),
                  }}>
                    {report.score}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 500, color: '#e2e8f0', fontSize: '0.9rem' }}>{report.title}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)' }}>/events/{report.slug}</p>
                  </div>
                  <Link
                    href={`/admin/retreats/${report.slug}`}
                    style={{ color: 'rgba(212,168,83,0.7)', fontSize: '0.78rem', textDecoration: 'none' }}
                  >
                    Edit
                  </Link>
                </div>

                {/* Issues */}
                {report.issues.length > 0 && (
                  <div style={{ padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {report.issues.map((issue, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: severityColor(issue.severity), flexShrink: 0, marginTop: '2px' }}>
                          {severityIcon(issue.severity)}
                        </span>
                        <div>
                          <span style={{ fontSize: '0.82rem', color: 'rgba(226,232,240,0.75)' }}>{issue.message}</span>
                          <span style={{ fontSize: '0.78rem', color: 'rgba(226,232,240,0.35)', marginLeft: '0.5rem' }}>
                            — {issue.action}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {report.issues.length === 0 && (
                  <div style={{ padding: '0.75rem 1.25rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#4ade80' }}>✓ All checks passed</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  )
}
