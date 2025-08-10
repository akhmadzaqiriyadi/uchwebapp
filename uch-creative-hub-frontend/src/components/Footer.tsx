'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp 
} from 'lucide-react';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 300;
      if (isScrolled !== showScrollTop) {
        setShowScrollTop(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showScrollTop]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      y: -5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  } as const;

  return (
    <footer className="bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] pt-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <Image
          src="/images/pattern-bg.svg"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* About UTY Creative Hub */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <Image
                src="/images/uch.png"
                alt="UTY Creative Hub Logo"
                width={50}
                height={50}
              />
              <div className="ml-2 text-blue-950 font-bold text-xs">
                <div>UTY</div>
                <div>CREATIVE</div>
                <div>HUB</div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta. 
              Wadah bagi mahasiswa dan komunitas untuk mengembangkan ide-ide brilian 
              di bidang kreativitas, inovasi, dan teknologi.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-6">
              {[
                { Icon: Instagram, href: "https://instagram.com/creativehubuty", label: "Instagram" },
                { Icon: Facebook, href: "https://facebook.com/utycreativehub", label: "Facebook" },
                { Icon: Twitter, href: "https://twitter.com/utycreativehub", label: "Twitter" },
                { Icon: Youtube, href: "https://youtube.com/utycreativehub", label: "Youtube" }
              ].map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-[#2E417A] hover:text-white text-[#2E417A] p-2 rounded-full shadow-md transition-colors"
                  variants={socialIconVariants}
                  whileHover="hover"
                  aria-label={social.label}
                >
                  <social.Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold text-[#2E417A] mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/programs", label: "Programs" },
                { href: "/articles", label: "News" },
                { href: "/events", label: "Events" },
                { href: "https://uchbooking.vercel.app/", label: "Book Space" }
              ].map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  className="text-gray-700 hover:text-[#2E417A] transition-colors hover:translate-x-1 inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Programs */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold text-[#2E417A] mb-4">Our Programs</h3>
            <div className="flex flex-col space-y-3">
              {[
                { href: "/programs/workshops", label: "Workshops & Training" },
                { href: "/programs/startup", label: "Startup Incubation" },
                { href: "/programs/mentorship", label: "Mentorship" },
                { href: "/programs/competition", label: "Competition" },
                { href: "/programs/community", label: "Community Events" }
              ].map((program) => (
                <Link 
                  key={program.label} 
                  href={program.href}
                  className="text-gray-700 hover:text-[#2E417A] transition-colors hover:translate-x-1 inline-block"
                >
                  {program.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact Us */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold text-[#2E417A] mb-4">Contact Us</h3>
            <div className="flex flex-col space-y-4">
              <div className="flex items-start">
                <MapPin size={20} className="text-[#2E417A] mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  Gedung G6 Lantai 3, Universitas Teknologi Yogyakarta, Jl. Siliwangi, Ringroad Utara, Sleman, Yogyakarta
                </p>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="text-[#2E417A] mr-3 flex-shrink-0" />
                <p className="text-gray-700">+62 274 623310</p>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="text-[#2E417A] mr-3 flex-shrink-0" />
                <p className="text-gray-700">kreanovasi@uty.ac.id</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Horizontal Line */}
        <motion.div 
          className="border-t border-gray-300 my-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* Copyright and Bottom Links */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center py-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} UTY Creative Hub. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-600">
            <Link href="/privacy-policy" className="hover:text-[#2E417A]">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#2E417A]">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-[#2E417A]">Sitemap</Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll to top button */}
      <AnimatedScrollToTop show={showScrollTop} onClick={scrollToTop} />
    </footer>
  );
};

// Scroll to Top Button Component
const AnimatedScrollToTop: React.FC<{ show: boolean; onClick: () => void }> = ({ show, onClick }) => {
  return (
    <motion.button
      className={`fixed bottom-8 right-8 bg-[#2E417A] text-white p-3 rounded-full shadow-lg z-50 ${
        show ? 'flex' : 'hidden'
      }`}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: show ? 1 : 0,
        scale: show ? 1 : 0.5,
        y: show ? 0 : 20
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </motion.button>
  );
};

export default Footer;