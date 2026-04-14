import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F6E56',
          width: 512,
          height: 512,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '102px',
        }}
      >
        <span style={{ color: 'white', fontSize: 288, fontWeight: 700, fontFamily: 'sans-serif' }}>
          K
        </span>
      </div>
    ),
    { width: 512, height: 512 }
  )
}
