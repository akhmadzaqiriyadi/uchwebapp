"use client"
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Users, Wifi, Monitor, CheckCircle, Star, X } from 'lucide-react';
import { motion } from 'framer-motion';

const rooms = [
  {
    id: "think-tank",
    title: "Think Tank Room",
    description: "Ruangan ideal untuk diskusi dan brainstorming, mendukung aktivitas kolaboratif dengan fasilitas papan tulis dan meja diskusi.",
    image: "/images/think-tank-room.jpg",
    capacity: "8-12 orang",
    facilities: ["Papan Tulis", "Meja Diskusi", "AC", "Proyektor"],
    available: true
  },
  {
    id: "prototyping",
    title: "Prototyping Room", 
    description: "Ruangan yang dirancang untuk pembuatan prototype dan pengembangan project dengan peralatan dan area kerja yang memadai.",
    image: "/images/prototyping-room.jpg",
    capacity: "6-10 orang",
    facilities: ["Peralatan Prototyping", "Area Kerja", "AC", "WiFi"],
    available: false
  },
  {
    id: "coworking",
    title: "Coworking Space",
    description: "Area kerja bersama yang nyaman untuk kolaborasi, diskusi kelompok, atau pengerjaan tugas dengan suasana yang kondusif.",
    image: "/images/coworking-space.jpg", 
    capacity: "15-20 orang",
    facilities: ["WiFi", "Meja Kerja", "AC", "Area Diskusi"],
    available: true
  }
];

const operationalHours = [
  { day: "Senin - Jumat", hours: "09.00 - 16.00" },
  { day: "Sabtu", hours: "09.00 - 12.00" },
  { day: "Minggu & Hari Libur", hours: "Tutup" }
];

export default function BookingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-32 py-28"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Room Information */}
        <div className="mb-16">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Ruangan UCH</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Setiap ruangan dirancang khusus untuk mendukung produktivitas dan kreativitas Mahasiswa
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {rooms.map((room, index) => (
              <motion.div 
                key={room.id} 
                className={`group relative rounded-2xl overflow-hidden bg-white shadow-lg transition-all duration-300 ${
                  room.available 
                    ? 'hover:shadow-2xl cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                variants={cardVariants}
                whileHover={room.available ? "hover" : {}}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {room.available ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 shadow-lg">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Tersedia
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 shadow-lg">
                      <X className="w-3 h-3 mr-1" />
                      Tidak Tersedia
                    </span>
                  )}
                </div>

                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    room.available 
                      ? 'from-black/60 via-black/20 to-transparent' 
                      : 'from-gray-600/80 via-gray-400/50 to-gray-300/30'
                  } z-10`}></div>
                  <Image
                    src={room.image || "/placeholder.svg"}
                    alt={room.title}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      room.available 
                        ? 'group-hover:scale-110' 
                        : 'grayscale'
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className={`text-2xl font-bold mb-2 ${
                      room.available ? 'text-white' : 'text-gray-300'
                    }`}>{room.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className={`mb-6 leading-relaxed ${
                    room.available ? 'text-gray-600' : 'text-gray-400'
                  }`}>{room.description}</p>

                  {/* Room Details */}
                  <div className="space-y-4 mb-6">
                    <div className={`flex items-center ${
                      room.available ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        room.available ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          room.available ? 'text-[#2E417A]' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <span className="font-medium">Kapasitas</span>
                        <div className="text-sm text-gray-500">{room.capacity}</div>
                      </div>
                    </div>
                    
                    <div className={`flex items-start ${
                      room.available ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 mt-0.5 ${
                        room.available ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Monitor className={`w-5 h-5 ${
                          room.available ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium block mb-1">Fasilitas</span>
                        <div className="flex flex-wrap gap-1">
                          {room.facilities.map((facility, index) => (
                            <span key={index} className={`inline-block px-2 py-1 text-xs rounded-md ${
                              room.available 
                                ? 'bg-gray-100 text-gray-600' 
                                : 'bg-gray-200 text-gray-400'
                            }`}>
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  {room.available ? (
                    <Link
                      href="/login"
                      className="group/btn w-full flex items-center justify-center py-4 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      Pesan Ruangan
                      <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  ) : (
                    <div className="w-full flex items-center justify-center py-4 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed">
                      Sedang Dalam Perbaikan
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Operational Hours & Information */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 mb-12"
          variants={containerVariants}
        >
          {/* Operational Hours */}
          <motion.div className="bg-white rounded-2xl p-8 shadow-lg" variants={itemVariants}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-[#2E417A]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Jam Operasional</h3>
            </div>
            <div className="space-y-4">
              {operationalHours.map((schedule, index) => (
                <motion.div 
                  key={index} 
                  className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <span className="font-medium text-gray-700">{schedule.day}</span>
                  <span className={`font-semibold ${schedule.hours === 'Tutup' ? 'text-red-500' : 'text-green-600'}`}>
                    {schedule.hours}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Booking Information */}
          <motion.div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100" variants={itemVariants}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-[#2E417A]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Informasi Pemesanan</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Cara Pemesanan
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {[
                    "Login ke akun Anda",
                    "Pilih ruangan yang diinginkan", 
                    "Tentukan tanggal dan waktu",
                    "Konfirmasi pemesanan"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-500" />
                  Ketentuan Peminjaman
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {[
                    "Pemesanan minimal H-1",
                    "Maksimal 4 jam per pemesanan",
                    "Wajib menjaga kebersihan ruangan", 
                    "Dilarang membawa makanan berat"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-[#2E417A] to-blue-700 rounded-2xl p-12 text-white"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-3xl font-bold mb-4">Siap Memulai Project Anda?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan tim yang telah mempercayai UCH untuk mendukung kolaborasi dan inovasi mereka
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/login"
              className="inline-flex items-center md:px-4 px-6 py-4 bg-white text-[#2E417A] rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Mulai Pesan Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
