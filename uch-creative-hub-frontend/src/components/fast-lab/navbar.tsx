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
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.replace('#', ''))
      const scrollPosition = window.scrollY + 100 // Add offset for navbar
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    
    const handleResize = () => {
      // Close mobile menu on resize to desktop
      if (window.innerWidth >= 1024) {
        setIsOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      // Close mobile menu when clicking outside
      const target = event.target as Element
      if (isOpen && !target.closest('nav')) {
        setIsOpen(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const scrollToSection = (href: string) => {
    // Remove the # from href to get the id
    const elementId = href.replace('#', '')
    
    // Close mobile menu immediately
    setIsOpen(false)
    
    // Wait for menu to close before scrolling
    setTimeout(() => {
      const element = document.getElementById(elementId)
      
      if (element) {
        // Simple scroll method that works consistently
        const yOffset = -80; // Negative offset for fixed navbar
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 300) // Wait for mobile menu animation to complete
  }

  const handleContactClick = () => {
    // Scroll to footer/contact section
    const footer = document.getElementById('contact') || document.querySelector('footer')
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' })
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
                src="/UTY.png"
                alt="UTY Logo"
                width={44}
                height={44}
                className="object-contain bg-white rounded-full"
              />
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
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.replace('#', '')
                return (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(item.href)}
                    className={`text-sm font-mono font-bold transition-colors relative group ${
                      isActive 
                        ? 'text-accent' 
                        : 'text-gray-300 hover:text-accent'
                    }`}
                  >
                    {item.name}
                    <div className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></div>
                  </motion.button>
                )
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <button 
                onClick={handleContactClick}
                className="bg-accent hover:bg-accent/80 text-blueprint px-6 py-2 font-mono font-bold text-sm transition-colors border border-accent"
              >
                HUBUNGI KAMI
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
              className="lg:hidden p-2 text-cyan-300 hover:text-accent transition-colors"
              aria-label="Toggle mobile menu"
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
                  {navItems.map((item, index) => {
                    const isActive = activeSection === item.href.replace('#', '')
                    return (
                      <motion.button
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          scrollToSection(item.href)
                        }}
                        className={`flex items-center justify-between p-3 text-left font-mono font-bold transition-colors border ${
                          isActive 
                            ? 'text-accent bg-accent/5 border-accent/30' 
                            : 'text-gray-300 hover:text-accent hover:bg-cyan-300/5 border-transparent hover:border-cyan-300/20'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )
                  })}
                  <div className="pt-4 border-t border-cyan-300/30">
                    <button 
                      onClick={handleContactClick}
                      className="w-full bg-accent hover:bg-accent/80 text-blueprint px-6 py-3 font-mono font-bold text-sm transition-colors border border-accent"
                    >
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
