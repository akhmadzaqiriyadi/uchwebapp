import Hero from '@/components/fast-lab/hero'
import VisionMission from '@/components/fast-lab/vision-mission'
import Programs from '@/components/fast-lab/programs'
import Facilities from '@/components/fast-lab/facilities'
import Events from '@/components/fast-lab/events'
import Portfolio from '@/components/fast-lab/portfolio'
import Products from '@/components/fast-lab/products'
import Footer from '@/components/fast-lab/footer'
import Navbar from '@/components/fast-lab/navbar'

export default function FastLabPage() {
  return (
    <div className="min-h-screen bg-blueprint text-white overflow-x-hidden">
      <Navbar />
      <div className="blueprint-grid">
        <Hero />
        <VisionMission />
        <Programs />
        <Facilities />
        <Events />
        <Portfolio />
        <Products />
        <Footer />
      </div>
    </div>
  )
}
