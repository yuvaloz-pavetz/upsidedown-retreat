'use client'

// Two full wave cycles side-by-side → seamless translateX(-50%) loop
const W1 = 'M0,48 C180,18 420,18 600,48 C780,78 1020,78 1200,48 C1380,18 1620,18 1800,48 C1980,78 2220,78 2400,48 L2400,90 L0,90 Z'
const W2 = 'M0,54 C150,28 450,28 600,54 C750,80 1050,80 1200,54 C1350,28 1650,28 1800,54 C1950,80 2250,80 2400,54 L2400,90 L0,90 Z'
const W3 = 'M0,62 C170,48 430,48 600,62 C770,76 1030,76 1200,62 C1370,48 1630,48 1800,62 C1970,76 2230,76 2400,62 L2400,90 L0,90 Z'

const layers = [
  { d: W1, fill: 'rgba(11,28,44,0.72)',   height: 110, duration: '16s', direction: 'normal'  },
  { d: W2, fill: 'rgba(8,38,68,0.55)',    height: 95,  duration: '11s', direction: 'reverse' },
  { d: W3, fill: 'rgba(74,155,184,0.13)', height: 72,  duration: '8s',  direction: 'normal'  },
]

export default function WaterWaves() {
  return (
    <>
      <style>{`
        @keyframes waveScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
        style={{ height: 130 }}
      >
        {layers.map(({ d, fill, height, duration, direction }, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '200%',
              animation: `waveScroll ${duration} linear infinite ${direction}`,
            }}
          >
            <svg
              viewBox="0 0 2400 90"
              preserveAspectRatio="none"
              style={{ width: '100%', height, display: 'block' }}
            >
              <path d={d} fill={fill} />
            </svg>
          </div>
        ))}
      </div>
    </>
  )
}
