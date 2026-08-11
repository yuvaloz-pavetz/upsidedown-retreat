'use client'
import { useRef, useState, useImperativeHandle, forwardRef } from 'react'

export interface SigHandle {
  getDataUrl: () => string | null
  clear: () => void
  hasData: () => boolean
}

const SignaturePad = forwardRef<SigHandle>(function SignaturePad(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const [filled, setFilled] = useState(false)

  useImperativeHandle(ref, () => ({
    getDataUrl: () => (filled ? (canvasRef.current?.toDataURL('image/png') ?? null) : null),
    clear: () => {
      const c = canvasRef.current
      if (c) { c.getContext('2d')?.clearRect(0, 0, c.width, c.height); setFilled(false) }
    },
    hasData: () => filled,
  }))

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!
    const r = c.getBoundingClientRect()
    return {
      x: (e.clientX - r.left) * (c.width / r.width),
      y: (e.clientY - r.top) * (c.height / r.height),
    }
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = getPos(e)
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    const p = getPos(e)
    if (last.current) {
      ctx.beginPath()
      ctx.moveTo(last.current.x, last.current.y)
      ctx.lineTo(p.x, p.y)
      ctx.strokeStyle = '#1a2a3a'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
      setFilled(true)
    }
    last.current = p
  }

  function onUp() {
    drawing.current = false
    last.current = null
  }

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={130}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      style={{
        width: '100%', height: 130, display: 'block',
        border: '1px solid #d1d5db', borderRadius: 6,
        background: '#fafafa', cursor: 'crosshair', touchAction: 'none',
      }}
    />
  )
})

export default SignaturePad
