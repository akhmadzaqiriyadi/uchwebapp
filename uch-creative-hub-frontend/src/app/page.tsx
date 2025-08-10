"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  Lightbulb,
  Target,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";
import ArticleList from "@/components/articles/ArticleList";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Your 'programs', 'events', and 'news' arrays remain unchanged...
  const programs = [
    {
      title: "Workshop & Training",
      description:
        "Pelatihan desain, teknologi, kewirausahaan, dan keterampilan kreatif",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Incubation Program",
      description: "Pendampingan ide bisnis dan startup mahasiswa",
      icon: Lightbulb,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Creative Challenge",
      description: "Kompetisi inovasi dan ide kreatif",
      icon: Target,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Mentoring & Networking",
      description: "Akses ke mentor profesional dan jejaring industri",
      icon: Users,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const events = [
    {
      title: "Tech Innovation Summit 2024",
      date: "15 Februari 2024",
      time: "09:00 - 17:00",
      location: "Think Tank Room",
      category: "Teknologi",
      status: "upcoming",
    },
    {
      title: "Creative Design Workshop",
      date: "22 Februari 2024",
      time: "13:00 - 16:00",
      location: "Coworking Space",
      category: "Seni",
      status: "upcoming",
    },
    {
      title: "Startup Pitch Competition",
      date: "8 Februari 2024",
      time: "10:00 - 15:00",
      location: "Prototyping Room",
      category: "Bisnis",
      status: "past",
    },
  ];

  const news = [
    {
      title: "Mahasiswa UTY Raih Juara 1 Kompetisi Inovasi Nasional",
      excerpt:
        "Tim dari UTY Creative Hub berhasil meraih prestasi gemilang dalam kompetisi inovasi teknologi tingkat nasional...",
      date: "10 Februari 2024",
      category: "Prestasi",
      image: "/winning-students.png",
    },
    {
      title: "Kolaborasi dengan Google Developer Student Club",
      excerpt:
        "UTY Creative Hub menjalin kerjasama strategis dengan Google DSC untuk program pengembangan teknologi...",
      date: "8 Februari 2024",
      category: "Kolaborasi",
      image: "/collaboration-meeting.png",
    },
    {
      title: "Peluncuran Program Inkubasi Startup Batch 3",
      excerpt:
        "Program inkubasi startup terbaru dibuka dengan fokus pada solusi teknologi untuk masalah sosial...",
      date: "5 Februari 2024",
      category: "Program",
      image: "/startup-incubation.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* ====================================================================== */}
      {/* Hero Section - FIXED CONTAINER LAYOUT                               */}
      {/* ====================================================================== */}
      <motion.section
        className="relative flex items-center pt-32 pb-20 lg:pt-24 lg:pb-24 overflow-hidden min-h-screen"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Texture */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20"></div>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url('/images/texture-herobg.svg')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center">
              
              {/* Left Side: Text Content */}
              <motion.div
                variants={itemVariants}
                className="text-center lg:text-left lg:w-1/2 relative z-20"
              >
                <Badge className="mb-6 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white border-0 px-4 py-2 text-sm font-semibold">
                  🚀 Innovate. Collaborate. Create.
                </Badge>
                <h1 className="text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#2E417A] to-blue-700 leading-tight font-bold">
                  UCH
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                  UTY{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E417A] to-blue-700">
                    Creative Hub
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Pusat kreativitas dan inovasi resmi Universitas Teknologi
                  Yogyakarta! wadah bagi mahasiswa dan komunitas untuk
                  mengembangkan ide-ide brilian di bidang kreativitas, inovasi,
                  dan teknologi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="h-14 px-8 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Link href="/programs">
                      Jelajahi Program
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Hero Illustration - Full width on mobile, positioned on desktop */}
          <motion.div
            variants={itemVariants}
            className="mt-16 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-0 lg:w-1/2 xl:w-[45%] 2xl:w-[40%] -mx-4 sm:-mx-6 lg:mx-0"
          >
            <div className="w-full flex justify-center lg:justify-end lg:pr-0">
              <Image
                src="/images/hero.svg"
                alt="UTY Creative Hub Innovation"
                width={795}
                height={653}
                className="w-full h-auto  max-w-[450px] lg:max-w-none"
                priority
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ====================================================================== */}
      {/* Latest Articles Section                                             */}
      {/* ====================================================================== */}
      <motion.section
        variants={containerVariants}
        className="py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white border-0 px-4 py-2 text-sm font-semibold">
              📚 Artikel Terbaru
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              Wawasan &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E417A] to-blue-700">
                Inspirasi
              </span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Temukan artikel-artikel inspiratif, panduan praktis, dan insight terkini 
              dari komunitas kreatif UTY Creative Hub.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <ArticleList limit={6} />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}