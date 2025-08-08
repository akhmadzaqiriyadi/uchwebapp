'use client'

import { motion } from 'framer-motion'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Wireframe, Text } from '@react-three/drei'
import { ChevronDown } from 'lucide-react'
import { TextureLoader } from 'three'
import { useRef } from 'react'

function WireframeModel() {
  const meshRef = useRef<any>(null)
  const logoTexture = useLoader(TextureLoader, '/fablab-logo.png')
  
  return (
    <group>
      {/* Main wireframe box */}
      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <Wireframe stroke="#87CEEB" thickness={0.02} />
      </mesh>
      
      {/* Logo on front face */}
      <mesh position={[0, 0, 1.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial 
          map={logoTexture} 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Logo on back face */}
      <mesh position={[0, 0, -1.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial 
          map={logoTexture} 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Logo on right face */}
      <mesh position={[1.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial 
          map={logoTexture} 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Logo on left face */}
      <mesh position={[-1.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial 
          map={logoTexture} 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Logo on top face */}
      <mesh position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial 
          map={logoTexture} 
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Logo on bottom face */}
      <mesh position={[0, -1.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial 
          map={logoTexture} 
          transparent 
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <WireframeModel />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-mono font-bold mb-6 text-cyan-300">
            FAST<span className="text-accent">LAB</span>
          </h1>
          <div className="h-1 w-32 bg-accent mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl mb-4 text-cyan-100">
            Empowering creativity through digital fabrication
          </p>
          <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-4xl mx-auto">
            Bersama Kami, Mari Wujudkan Ide Kreatif Mahasiswa Menjadi Nyata
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="bg-accent hover:bg-accent/80 text-blueprint px-8 py-4 rounded-none font-mono font-bold transition-colors border-2 border-accent">
            MULAI EKSPLORASI
          </button>
          <button className="border-2 border-cyan-300 text-cyan-300 hover:bg-cyan-300 hover:text-blueprint px-8 py-4 rounded-none font-mono font-bold transition-colors">
            PELAJARI LEBIH LANJUT
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-cyan-300 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
}
