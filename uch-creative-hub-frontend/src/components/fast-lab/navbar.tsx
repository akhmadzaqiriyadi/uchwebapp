'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const navItems = [
  { name: 'HOME', href: '#home' },
  { name: 'VISI & MISI', href: '#vision' },
  { name: 'PROGRAM', href: '#programs' },
  { name: 'FASILITAS', href: '#facilities' },
  { name: 'EVENT', href: '#events' },
  { name: 'PORTFOLIO', href: '#portfolio' },
  { name: 'PRODUK', href: '#products' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-blueprint/95 backdrop-blur-md border-b border-cyan-300/30' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => scrollToSection('#home')}
            >
              <Image
                src="/fablab-logo.png"
                alt="FASTLAB Logo"
                width={42}
                height={42}
                className="object-contain bg-white rounded-full"
              />
              <span className="text-xl font-mono font-bold text-cyan-300">
                FAST<span className="text-accent">LAB</span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-mono font-bold text-gray-300 hover:text-accent transition-colors relative group"
                >
                  {item.name}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></div>
                </motion.button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <button className="bg-accent hover:bg-accent/80 text-blueprint px-6 py-2 font-mono font-bold text-sm transition-colors border border-accent">
                HUBUNGI KAMI
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-cyan-300 hover:text-accent transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-blueprint/98 backdrop-blur-md border-t border-cyan-300/30"
            >
              <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="grid gap-4">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => scrollToSection(item.href)}
                      className="flex items-center justify-between p-3 text-left font-mono font-bold text-gray-300 hover:text-accent hover:bg-cyan-300/5 transition-colors border border-transparent hover:border-cyan-300/20"
                    >
                      <span>{item.name}</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  ))}
                  <div className="pt-4 border-t border-cyan-300/30">
                    <button className="w-full bg-accent hover:bg-accent/80 text-blueprint px-6 py-3 font-mono font-bold text-sm transition-colors border border-accent">
                      HUBUNGI KAMI
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>
    </>
  )
}
