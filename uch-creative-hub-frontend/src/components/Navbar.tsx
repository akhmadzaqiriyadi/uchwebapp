'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to check if path is active
  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Function to check if Program dropdown should be active
  const isProgramActive = () => {
    return pathname === '/fastlab' || pathname.startsWith('/programs');
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Mobile menu animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      height: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.nav 
        className={`transition-all duration-300 ${
          scrolled 
            ? 'bg-white/60 backdrop-blur-md mx-4 md:mx-12 mt-2 rounded-full shadow-lg'
            : 'bg-white shadow-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          duration: 0.8 
        }}
      >
        <div className={`container mx-auto px-4 ${scrolled ? 'px-6' : ''}`}>
          <div className="flex justify-between items-center h-20">
            {/* Logo with animation */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src="/images/uch.png"
                    alt="UTY Creative Hub Logo"
                    width={50}
                    height={50}
                    priority
                  />
                </motion.div>
                <motion.div 
                  className="ml-2 text-blue-950 font-bold text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="">UTY</div>
                  <div className="">CREATIVE</div>
                  <div className="">HUB</div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Desktop Navigation with staggered animations - tampil mulai dari md ke atas */}
            <div className="hidden md:flex items-center space-x-1 md:space-x-2 lg:space-x-4 xl:space-x-6">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/booking", label: "Booking" },
                { href: "/articles", label: "Artikel" },
                { href: "/events", label: "Events" },
              ].map((item, i) => {
                const isActive = isActivePath(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.5,
                      ease: [0.04, 0.62, 0.23, 0.98]
                    }}
                  >
                    <Link 
                      href={item.href} 
                      className={`relative text-xs md:text-sm lg:text-base whitespace-nowrap transition-colors ${
                        isActive 
                          ? 'text-blue-600 font-semibold' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                      >
                        {item.label}
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                            layoutId="activeIndicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.span>
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Program Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 2 * 0.1,
                  duration: 0.5,
                  ease: [0.04, 0.62, 0.23, 0.98]
                }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`relative text-xs md:text-sm lg:text-base whitespace-nowrap flex items-center gap-1 focus:outline-none transition-colors ${
                      isProgramActive() 
                        ? 'text-blue-600 font-semibold' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}>
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative flex items-center gap-1"
                      >
                        Program
                        <ChevronDown size={16} className="transition-transform duration-200" />
                        {/* Active indicator for Program dropdown */}
                        {isProgramActive() && (
                          <motion.div
                            className="absolute -bottom-1 left-0 right-6 h-0.5 bg-blue-600 rounded-full"
                            layoutId="activeIndicatorProgram"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem asChild>
                      <Link 
                        href="https://bit.ly/PKMCornerUTY" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full cursor-pointer"
                      >
                        <span>Pendampingan Kreativitas Mahasiswa</span>
                        <ExternalLink size={14} className="text-gray-400" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="https://sentra-hki.uty.ac.id/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full cursor-pointer"
                      >
                        <span>Sentra Kekayaan Intelektual</span>
                        <ExternalLink size={14} className="text-gray-400" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <span className="text-gray-400">Hilirisasi Riset</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/fastlab" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between w-full cursor-pointer ${
                          pathname === '/fastlab' ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                      >
                        <span>UTY Fastlab Academy</span>
                        <ExternalLink size={14} className="text-gray-400" />
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </div>

            {/* Grup Tombol Aksi dengan animasi - tampil mulai dari md ke atas */}
            <motion.div 
              className="hidden md:flex items-center gap-1 lg:gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* Tombol Cek Jadwal (Sekunder) */}
              <Link 
                href="/schedule" 
                className={`text-[#2E417A] bg-white border border-[#2E417A] px-2 lg:px-3 xl:px-4 rounded-xl hover:bg-blue-50 transition-colors flex items-center text-xs md:text-sm whitespace-nowrap ${
                  scrolled ? 'py-1.5 md:py-2' : 'py-2 md:py-2.5'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  Cek Jadwal
                </motion.div>
              </Link>

              {/* Tombol Book Now (Primer) */}
              <Link 
                href="/login"
                className={`bg-[#2E417A] text-white px-2 lg:px-3 xl:px-4 rounded-xl hover:bg-blue-950 transition-colors flex items-center text-xs md:text-sm whitespace-nowrap ${
                  scrolled ? 'py-2 md:py-2.5' : 'py-2.5 md:py-3'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  <Calendar size={14} className="mr-1 lg:mr-2" />
                  Book Now
                </motion.div>
              </Link>
            </motion.div>

            {/* Mobile menu button - hanya tampil di sm ke bawah */}
            <motion.div 
              className="md:hidden flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.button
                className="outline-none mobile-menu-button"
                onClick={toggleMenu}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu with animations - hanya muncul di mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden fixed top-24 left-0 right-0 z-40"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className={`mx-4 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border border-gray-200`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-6 space-y-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About Us" },
                  { href: "/booking", label: "Booking" },
                  { href: "/articles", label: "Artikel" },
                  { href: "/events", label: "Events" }
                ].map((item, i) => {
                  const isActive = isActivePath(item.href);
                  return (
                    <motion.div
                      key={item.href}
                      variants={menuItemVariants}
                      custom={i}
                    >
                      <Link 
                        href={item.href} 
                        className={`block px-4 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-blue-100 text-blue-600 font-semibold border-l-4 border-blue-600' 
                            : 'text-gray-700 hover:bg-blue-100'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Program Dropdown untuk Mobile */}
                <motion.div variants={menuItemVariants}>
                  <div className={`px-4 py-2 ${
                    isProgramActive() ? 'bg-blue-50 rounded-lg border-l-4 border-blue-600' : ''
                  }`}>
                    <div className={`font-medium mb-2 ${
                      isProgramActive() ? 'text-blue-600' : 'text-gray-700'
                    }`}>Program</div>
                    <div className="ml-4 space-y-2">
                      <Link 
                        href="https://bit.ly/PKMCornerUTY" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 py-1"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>Pendampingan Kreativitas Mahasiswa</span>
                        <ExternalLink size={12} className="text-gray-400" />
                      </Link>
                      <Link 
                        href="https://sentra-hki.uty.ac.id/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 py-1"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>Sentra Kekayaan Intelektual</span>
                        <ExternalLink size={12} className="text-gray-400" />
                      </Link>
                      <div className="text-sm text-gray-400 py-1">
                        Hilirisasi Riset
                      </div>
                      <Link 
                        href="/fastlab" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between text-sm py-1 ${
                          pathname === '/fastlab' 
                            ? 'text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded' 
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>UTY Fastlab Academy</span>
                        <ExternalLink size={12} className="text-gray-400" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
                {/* Grup Tombol Aksi untuk Mobile */}
                <motion.div variants={menuItemVariants} className="!mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Tombol Cek Jadwal (Sekunder) */}
                    <Link 
                      href="/schedule"
                      className="flex-1 text-center py-2.5 px-3 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cek Jadwal
                    </Link>

                    {/* Tombol Book Now (Primer) */}
                    <Link 
                      href="/login"
                      className="flex-1 flex items-center justify-center py-2.5 px-3 bg-[#2E417A] text-white rounded-lg text-sm font-semibold hover:bg-blue-950 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Calendar size={16} className="mr-1.5" />
                      Book Now
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;