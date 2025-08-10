"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Users, TrendingUp } from "lucide-react";
import ArticleList from "@/components/articles/ArticleList";

export default function ArticlesPage() {
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

  const stats = [
    {
      icon: BookOpen,
      title: "Total Artikel",
      value: "150+",
      description: "Artikel informatif dan edukatif",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Kontributor",
      value: "25+",
      description: "Penulis dan kontributor aktif",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Calendar,
      title: "Update Berkala",
      value: "Mingguan",
      description: "Konten fresh setiap minggu",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: TrendingUp,
      title: "Trending Topics",
      value: "5+",
      description: "Topik populer dan terkini",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="py-12"
      >
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="mb-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white border-0 px-4 py-2 text-sm font-semibold">
              📚 Knowledge Hub
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              Artikel &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E417A] to-blue-700">
                Insight
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Temukan artikel inspiratif, panduan praktis, dan wawasan terkini seputar teknologi, 
              kreativitas, dan inovasi dari komunitas UTY Creative Hub.
            </p>
          </div>
        </motion.section>

        {/* ====================================================================== */}
        {/* PERUBAHAN UTAMA: BAGIAN ARTIKEL SEKARANG DI ATAS                       */}
        {/* ====================================================================== */}
        <motion.section variants={itemVariants}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Jelajahi Artikel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ArticleList />
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* ====================================================================== */}
        {/* PERUBAHAN UTAMA: BAGIAN STATS DIPINDAH KE BAWAH                       */}
        {/* ====================================================================== */}
        <motion.section variants={itemVariants} className="mt-16 lg:mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-slate-700">Sekilas Fakta</h2>
                <p className="text-slate-500 mt-2">Beberapa angka menarik dari Knowledge Hub kami.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <Card className="relative overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-sm font-semibold text-slate-700 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}