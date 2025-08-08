'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Users } from 'lucide-react'

const events = [
  {
    title: 'Workshop 3D Printing untuk Pemula',
    date: '15 Januari 2024',
    location: 'FastLab UTY',
    participants: '25 peserta',
    image: '/placeholder.svg?height=200&width=300&text=3D+Printing+Workshop',
    status: 'Selesai'
  },
  {
    title: 'Pelatihan Laser Cutting & Engraving',
    date: '22 Januari 2024',
    location: 'FastLab UTY',
    participants: '20 peserta',
    image: '/placeholder.svg?height=200&width=300&text=Laser+Cutting+Training',
    status: 'Selesai'
  },
  {
    title: 'Seminar IoT dan Smart City',
    date: '5 Februari 2024',
    location: 'Mini Theater Room',
    participants: '50 peserta',
    image: '/placeholder.svg?height=200&width=300&text=IoT+Seminar',
    status: 'Mendatang'
  },
  {
    title: 'Bootcamp AI & Machine Learning',
    date: '12 Februari 2024',
    location: 'FastLab UTY',
    participants: '30 peserta',
    image: '/placeholder.svg?height=200&width=300&text=AI+Bootcamp',
    status: 'Mendatang'
  }
]

export default function Events() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="events" ref={ref} className="py-20 px-4 bg-blueprint/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-cyan-300">
            EVENT
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border border-cyan-300/30 overflow-hidden hover:border-accent/50 transition-colors group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image || "/placeholder.svg"} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-blueprint/60 group-hover:bg-blueprint/40 transition-colors"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-mono font-bold ${
                    event.status === 'Selesai' 
                      ? 'bg-gray-600 text-gray-300' 
                      : 'bg-accent text-blueprint'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-mono font-bold mb-4 text-accent">
                  {event.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-300" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-300" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-300" />
                    <span>{event.participants}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
