'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Cpu, GraduationCap, Handshake, Rocket } from 'lucide-react'

const programs = [
  {
    icon: Cpu,
    title: 'PROTOTYPING',
    description: 'FastLab UTY menawarkan sumber daya dan dukungan bagi individu dan tim untuk merancang, membuat prototipe, dan menciptakan objek fisik sehingga memungkinkan pengguna untuk merealisasikan ide menjadi produk nyata melalui pengalaman langsung dengan berbagai alat dan teknologi canggih.'
  },
  {
    icon: GraduationCap,
    title: 'TRAINING',
    description: 'FastLab UTY menawarkan berbagai program pelatihan, lokakarya, dan kursus untuk membantu individu mengembangkan keterampilan fabrikasi digital, seperti: 3D Printer Training, 3D Scanner Training, Mini CNC Router Training, Laser Cutting Training, dan Mug Press Machine.'
  },
  {
    icon: Handshake,
    title: 'COOPERATION',
    description: 'FastLab UTY sangat terbuka dalam peluang kerjasama dengan seluruh pemangku kepentingan untuk mendukung pengembangan STEAM di Indonesia, mulai dari kegiatan pendidikan dan pelatihan, riset dan pengembangan, serta pemberdayaan masyarakat.'
  },
  {
    icon: Rocket,
    title: 'FASTLAB ACADEMY',
    description: 'Fastlab UTY menawarkan program intensif yang berfokus pada Project and Problem Based Learning bagi talenta muda Gen-Z yang minat dalam Pengembangan STEAM khususnya terkait teknologi robotika, IoT, kecerdasan buatan, augmented-virtual reality, sains data, desain manufaktur, konten digital, serta fabrikasi digital.'
  }
]

export default function Programs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="programs" ref={ref} className="py-20 px-4 bg-blueprint/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-cyan-300">
            PROGRAM KAMI
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="border border-cyan-300/30 p-6 hover:border-accent/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-accent/20 p-3 group-hover:bg-accent/30 transition-colors">
                  <program.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-mono font-bold mb-3 text-accent">
                    {program.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {program.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
