"use client";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutUsSection() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get current path
  const pathname = usePathname();

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Google Drive Video Embed URL (tanpa autoplay)
  const driveFileId = "16Ku7491nu4LqQccb5rvv6qx2VVESJpq0";
  const driveEmbedUrl = `https://drive.google.com/file/d/${driveFileId}/preview`;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className="py-24 pb-6 sm:pb-8 lg:py-24 lg:pb-8 xl:py-32 xl:pb-32 bg-[#2E417A] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            About Us
          </motion.h1>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-yellow-400 mx-auto mt-2"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-12">
          {/* Left side - About Us Text */}
          <motion.div
            className="w-full lg:w-1/2"
            variants={containerAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={itemAnimation}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center lg:text-left"
            >
              UTY Creative Hub
            </motion.h2>

            <motion.p
              variants={itemAnimation}
              className="text-gray-200 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed text-justify sm:text-left"
            >
              Selamat datang di UTY Creative Hub, pusat kreativitas dan inovasi
              resmi Universitas Teknologi Yogyakarta! Kami adalah wadah yang
              dirancang khusus untuk mahasiswa dan komunitas UTY dalam
              mengembangkan ide-ide brilian di bidang kreativitas, inovasi, dan
              teknologi.
            </motion.p>

            <motion.p
              variants={itemAnimation}
              className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed text-justify sm:text-left"
            >
              Dengan fasilitas modern dan program-program yang inspiratif, UTY
              Creative Hub menjadi rumah bagi para pemikir kreatif, inovator
              muda, dan calon pemimpin masa depan yang ingin membuat perubahan
              positif melalui karya-karya inovatif.
            </motion.p>

            {/* Button hanya tampil jika bukan di /about */}
            {pathname !== "/about" && (
              <motion.div variants={itemAnimation} className="text-center lg:text-left">
                <Link href="/about">
                  <motion.button
                    className="bg-yellow-400 text-[#2E417A] px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-yellow-500 transition-colors mt-2 sm:mt-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Kenal Lebih Dekat
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right side - Video Profile */}
          <motion.div
            className="w-full lg:w-1/2 relative overflow-hidden rounded-lg shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="aspect-w-16 aspect-h-10 relative">
              <iframe
                ref={videoRef}
                className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] rounded-lg"
                src={driveEmbedUrl}
                title="UTY Creative Hub Profile Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              {!isPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                  onClick={handlePlay}
                >
                  <div className="absolute inset-0 w-full h-full object-cover rounded-lg bg-blue-50" />
                  <div className="relative flex items-center justify-center">
                    <div className="bg-yellow-400 text-[#2E417A] px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium flex items-center gap-2 text-sm sm:text-base">
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>Let's Play</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}