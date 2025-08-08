import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './fastlab.css'

export const metadata: Metadata = {
  title: 'FastLab UTY',
  description: 'Empowering creativity through digital fabrication',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function FastLabLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div 
      className={`fastlab-container ${GeistSans.variable} ${GeistMono.variable}`}
      style={{
        fontFamily: GeistSans.style.fontFamily,
        // @ts-ignore
        '--font-sans': GeistSans.variable,
        '--font-mono': GeistMono.variable,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
