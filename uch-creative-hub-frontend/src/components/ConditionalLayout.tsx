'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Halaman yang tidak memerlukan navbar/footer global
  const noLayoutPages = ['/fastlab']
  
  const shouldShowLayout = !noLayoutPages.includes(pathname)

  if (!shouldShowLayout) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
}
