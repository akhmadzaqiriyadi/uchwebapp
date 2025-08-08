'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Target, Lightbulb } from 'lucide-react'

export default function VisionMission() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="vision" ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-cyan-300">
            VISI & MISI
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border border-cyan-300/30 p-8 relative"
          >
            <div className="absolute -top-4 -left-4 bg-blueprint p-2">
              <Target className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-mono font-bold mb-6 text-accent">VISI</h3>
            <p className="text-gray-300 leading-relaxed">
              Menjadi Pusat Laboratorium yang Unggul, Adaptif-inovatif dan Berdampak dalam 
              Mencerdaskan Kehidupan Bangsa dan Peningkatan Kesejahteraan Masyarakat melalui 
              Pengembangan STEAM (Science, Technology, Engineering, Arts, and Mathematics)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="border border-cyan-300/30 p-8 relative"
          >
            <div className="absolute -top-4 -left-4 bg-blueprint p-2">
              <Lightbulb className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-mono font-bold mb-6 text-accent">MISI</h3>
            <ul className="text-gray-300 leading-relaxed space-y-3">
              <li>• Menyelenggarakan kegiatan untuk menumbuhkembangkan daya dan minat sivitas akademika dalam pengembangan produk inovasi berbasis STEAM</li>
              <li>• Menyelenggarakan layanan fasilitasi akses terhadap teknologi fabrikasi digital dalam riset dan pengembangan produk inovasi</li>
              <li>• Menyelenggarakan layanan pendampingan dan pemberdayaan talenta muda dalam bidang STEAM</li>
              <li>• Mengoptimalkan peran serta seluruh pemangku kepentingan untuk mendukung tercapainya visi</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
