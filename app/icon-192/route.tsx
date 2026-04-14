import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F6E56',
          width: 192,
          height: 192,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '38px',
        }}
      >
        <span style={{ color: 'white', fontSize: 108, fontWeight: 700, fontFamily: 'sans-serif' }}>
          K
        </span>
      </div>
    ),
    { width: 192, height: 192 }
  )
}
