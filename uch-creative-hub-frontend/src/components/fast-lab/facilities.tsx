'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Wrench, Users, Code, Video, Theater } from 'lucide-react'

const facilities = [
  {
    icon: Brain,
    title: 'Think Tank Room',
    description: 'Ruang brainstorming dan diskusi untuk mengembangkan ide-ide inovatif',
    image: '/placeholder.svg?height=200&width=300&text=Think+Tank+Room'
  },
  {
    icon: Wrench,
    title: 'Prototyping Room',
    description: 'Ruang lengkap dengan peralatan fabrikasi digital untuk membuat prototipe',
    image: '/placeholder.svg?height=200&width=300&text=Prototyping+Room'
  },
  {
    icon: Users,
    title: 'Coworking Space',
    description: 'Area kerja bersama yang nyaman untuk kolaborasi tim',
    image: '/placeholder.svg?height=200&width=300&text=Coworking+Space'
  },
  {
    icon: Code,
    title: 'Software House Space',
    description: 'Ruang khusus untuk pengembangan software dan aplikasi',
    image: '/placeholder.svg?height=200&width=300&text=Software+House'
  },
  {
    icon: Video,
    title: 'Video Production Room',
    description: 'Studio produksi video dengan peralatan profesional',
    image: '/placeholder.svg?height=200&width=300&text=Video+Production'
  },
  {
    icon: Theater,
    title: 'Mini Theater Room',
    description: 'Ruang presentasi dan screening dengan fasilitas audio visual',
    image: '/placeholder.svg?height=200&width=300&text=Mini+Theater'
  }
]

export default function Facilities() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="facilities" ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-cyan-300">
            FASILITAS
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border border-cyan-300/30 overflow-hidden hover:border-accent/50 transition-colors group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={facility.image || "/placeholder.svg"} 
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-blueprint/60 group-hover:bg-blueprint/40 transition-colors"></div>
                <div className="absolute top-4 left-4 bg-accent/20 p-2">
                  <facility.icon className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-mono font-bold mb-2 text-accent">
                  {facility.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {facility.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
