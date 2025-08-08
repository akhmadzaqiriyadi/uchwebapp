'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ShoppingCart, Eye } from 'lucide-react'

const products = [
  {
    title: 'Custom 3D Printed Parts',
    price: 'Rp 50.000 - 500.000',
    image: '/placeholder.svg?height=200&width=250&text=3D+Printed+Parts',
    description: 'Komponen custom hasil 3D printing dengan berbagai material'
  },
  {
    title: 'Laser Cut Acrylic Display',
    price: 'Rp 75.000 - 300.000',
    image: '/placeholder.svg?height=200&width=250&text=Laser+Cut+Display',
    description: 'Display acrylic custom dengan laser cutting precision'
  },
  {
    title: 'PCB Prototype Board',
    price: 'Rp 25.000 - 150.000',
    image: '/placeholder.svg?height=200&width=250&text=PCB+Prototype',
    description: 'Prototype PCB untuk pengembangan elektronik'
  },
  {
    title: 'CNC Machined Parts',
    price: 'Rp 100.000 - 800.000',
    image: '/placeholder.svg?height=200&width=250&text=CNC+Parts',
    description: 'Komponen presisi hasil CNC machining'
  },
  {
    title: 'Custom Mug Printing',
    price: 'Rp 35.000 - 75.000',
    image: '/placeholder.svg?height=200&width=250&text=Custom+Mug',
    description: 'Mug custom dengan printing berkualitas tinggi'
  },
  {
    title: 'IoT Sensor Kit',
    price: 'Rp 200.000 - 500.000',
    image: '/placeholder.svg?height=200&width=250&text=IoT+Sensor+Kit',
    description: 'Kit sensor IoT untuk project development'
  }
]

export default function Products() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="products" ref={ref} className="py-20 px-4 bg-blueprint/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-cyan-300">
            DAFTAR PRODUK
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mb-4"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Katalog produk hasil karya FastLab UTY - dari prototipe hingga produk jadi
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border border-cyan-300/30 overflow-hidden hover:border-accent/50 transition-colors group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image || "/placeholder.svg"} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-blueprint/60 group-hover:bg-blueprint/40 transition-colors"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="bg-cyan-300/20 hover:bg-cyan-300/30 p-2 transition-colors">
                    <Eye className="w-4 h-4 text-cyan-300" />
                  </button>
                  <button className="bg-accent/20 hover:bg-accent/30 p-2 transition-colors">
                    <ShoppingCart className="w-4 h-4 text-accent" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-mono font-bold mb-2 text-accent">
                  {product.title}
                </h3>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300 font-mono font-bold">
                    {product.price}
                  </span>
                  <button className="bg-accent hover:bg-accent/80 text-blueprint px-4 py-2 text-sm font-mono font-bold transition-colors">
                    ORDER
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
