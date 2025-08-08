'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const portfolioItems = [
  {
    title: 'Pelatihan 3D Printing',
    category: 'Training',
    image: '/placeholder.svg?height=250&width=350&text=3D+Printing+Training',
    description: 'Workshop intensif 3D printing untuk mahasiswa dan umum'
  },
  {
    title: 'Prototype Smart Home',
    category: 'Prototyping',
    image: '/placeholder.svg?height=250&width=350&text=Smart+Home+Prototype',
    description: 'Pengembangan prototipe sistem smart home berbasis IoT'
  },
  {
    title: 'Robotics Competition',
    category: 'Event',
    image: '/placeholder.svg?height=250&width=350&text=Robotics+Competition',
    description: 'Kompetisi robotika tingkat nasional'
  },
  {
    title: 'AR/VR Workshop',
    category: 'Training',
    image: '/placeholder.svg?height=250&width=350&text=AR+VR+Workshop',
    description: 'Pelatihan pengembangan aplikasi AR dan VR'
  },
  {
    title: 'Digital Fabrication',
    category: 'Prototyping',
    image: '/placeholder.svg?height=250&width=350&text=Digital+Fabrication',
    description: 'Proyek fabrikasi digital untuk industri kreatif'
  },
  {
    title: 'STEAM Education',
    category: 'Academy',
    image: '/placeholder.svg?height=250&width=350&text=STEAM+Education',
    description: 'Program pendidikan STEAM untuk generasi muda'
  }
]

export default function Portfolio() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="portfolio" ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-cyan-300">
            PORTFOLIO
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border border-cyan-300/30 overflow-hidden hover:border-accent/50 transition-colors group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image || "/placeholder.svg"} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-blueprint/60 group-hover:bg-blueprint/40 transition-colors"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-accent/20 text-accent px-2 py-1 text-xs font-mono font-bold">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-mono font-bold mb-2 text-accent">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
