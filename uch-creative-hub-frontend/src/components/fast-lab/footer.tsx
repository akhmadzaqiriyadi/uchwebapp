'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contact" className="bg-blueprint border-t border-cyan-300/30 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-2"
          >
            <h3 className="text-2xl font-mono font-bold text-accent mb-4">
              FASTLAB UTY
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering creativity through digital fabrication. 
              Bersama kami wujudkan ide kreatif Anda menjadi nyata melalui teknologi STEAM.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-cyan-300/20 hover:bg-cyan-300/30 p-2 transition-colors">
                <Facebook className="w-5 h-5 text-cyan-300" />
              </a>
              <a href="#" className="bg-cyan-300/20 hover:bg-cyan-300/30 p-2 transition-colors">
                <Instagram className="w-5 h-5 text-cyan-300" />
              </a>
              <a href="#" className="bg-cyan-300/20 hover:bg-cyan-300/30 p-2 transition-colors">
                <Twitter className="w-5 h-5 text-cyan-300" />
              </a>
              <a href="#" className="bg-cyan-300/20 hover:bg-cyan-300/30 p-2 transition-colors">
                <Linkedin className="w-5 h-5 text-cyan-300" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-mono font-bold text-cyan-300 mb-4">QUICK LINKS</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-accent transition-colors">Program</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Fasilitas</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Event</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Portfolio</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Produk</a></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-mono font-bold text-cyan-300 mb-4">KONTAK</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm">Universitas Teknologi Yogyakarta, Jl. Siliwangi, Yogyakarta</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-sm">+62 274 123456</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-sm">info@fastlab.uty.ac.id</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-cyan-300/30 pt-8 text-center"
        >
          <p className="text-gray-400 font-mono text-sm">
            © 2024 FastLab UTY. All rights reserved. | Designed with blueprint precision.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
