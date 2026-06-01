'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const BUCKET = 'retreat-media'

interface Props {
  folder: string
  value: string
  onChange: (url: string) => void
}

interface MultiProps {
  folder: string
  value: string[]
  onChange: (urls: string[]) => void
}

function extractPath(url: string): string {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  return idx === -1 ? url : url.slice(idx + marker.length)
}

async function uploadToStorage(supabase: ReturnType<typeof createClient>, folder: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${folder || 'uploads'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) return null
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return publicUrl
}

const overlayX: React.CSSProperties = {
  position: 'absolute', top: 4, right: 4,
  width: 22, height: 22, borderRadius: '50%',
  background: 'rgba(0,0,0,0.72)', border: 'none',
  color: '#fff', fontSize: 14, lineHeight: 1,
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
}

const uploadArea: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)',
  borderRadius: 4, color: 'rgba(226,232,240,0.35)', fontSize: '0.8rem', cursor: 'pointer',
  transition: 'all 0.15s',
}

export function SingleImageUploader({ folder, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const supabase = createClient()

  async function handle(files: FileList | null) {
    if (!files?.length) return
    const file = files[0]
    if (file.size > 10 * 1024 * 1024) { setErr('Max 10 MB'); return }
    setErr(''); setBusy(true)
    const url = await uploadToStorage(supabase, folder, file)
    if (url) onChange(url)
    else setErr('Upload failed')
    setBusy(false)
  }

  async function remove() {
    if (value) void supabase.storage.from(BUCKET).remove([extractPath(value)])
    onChange('')
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handle(e.target.files)} />
      {value ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" style={{ height: 140, width: 220, objectFit: 'cover', borderRadius: 4, display: 'block' }} />
          <button type="button" onClick={remove} style={overlayX} title="Remove">×</button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.65)', border: 'none', borderRadius: 3, color: '#e2e8f0', fontSize: '0.65rem', padding: '3px 8px', cursor: 'pointer' }}
          >
            {busy ? '…' : 'Replace'}
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} style={{ ...uploadArea, width: 220, height: 140 }}>
          {busy ? 'Uploading…' : '+ Upload image'}
        </button>
      )}
      {err && <p style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.35rem' }}>{err}</p>}
    </div>
  )
}

export function MultiImageUploader({ folder, value, onChange }: MultiProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const supabase = createClient()

  async function handle(files: FileList | null) {
    if (!files?.length) return
    setErr(''); setBusy(true)
    const added: string[] = []
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) { setErr('One or more files exceed 10 MB'); continue }
      const url = await uploadToStorage(supabase, folder, file)
      if (url) added.push(url)
    }
    if (!added.length && !err) setErr('Upload failed')
    onChange([...value, ...added])
    setBusy(false)
  }

  async function remove(url: string) {
    void supabase.storage.from(BUCKET).remove([extractPath(url)])
    onChange(value.filter(u => u !== url))
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handle(e.target.files)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {value.map((url, i) => (
          <div key={url} style={{ position: 'relative', flexShrink: 0 }}>
            {i === 0 && (
              <span style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(212,168,83,0.85)', borderRadius: 2, fontSize: '0.55rem', padding: '2px 6px', color: '#0d1520', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Cover</span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4, display: 'block' }} />
            <button type="button" onClick={() => remove(url)} style={overlayX} title="Remove">×</button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} style={{ ...uploadArea, width: 120, height: 80, fontSize: '0.75rem' }}>
          {busy ? '…' : '+ Add'}
        </button>
      </div>
      {err && <p style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.35rem' }}>{err}</p>}
    </div>
  )
}
