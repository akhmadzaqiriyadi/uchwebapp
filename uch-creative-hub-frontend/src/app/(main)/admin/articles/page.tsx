// src/app/(main)/admin/articles/page.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Settings, Edit3 } from 'lucide-react';
import ArticleForm from '@/components/articles/ArticleForm';
import ArticleList from '@/components/articles/ArticleList';
import CategoryManager from '@/components/articles/CategoryManager';
import TagManager from '@/components/articles/TagManager';
import ArticleStats from '@/components/articles/ArticleStats';
import { Article } from '@/_services/article.service';
import { motion } from 'framer-motion';

export default function AdminArticlesPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleCreateNew = () => {
    setEditingArticle(null);
    setActiveTab('form');
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setActiveTab('form');
  };

  const handleFormSuccess = (article: Article) => {
    setActiveTab('list');
    setEditingArticle(null);
  };

  const handleFormCancel = () => {
    setActiveTab('list');
    setEditingArticle(null);
  };

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* IMPROVEMENT: Header Section yang lebih menarik */}
        <motion.div variants={itemVariants} className="text-center mb-8 lg:mb-12">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-gradient-to-r from-[#2E417A] to-blue-700 flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg shadow-blue-500/25">
            <Edit3 className="w-6 h-6 lg:w-10 lg:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 lg:mb-4">
            Manajemen Artikel
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Buat, edit, dan kelola semua konten artikel untuk website UTY Creative Hub.
          </p>
        </motion.div>

        {/* IMPROVEMENT: Main Card dengan gaya yang konsisten */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border-0 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-4 sm:p-6 border-b border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* IMPROVEMENT: Desain Tabs yang lebih modern */}
                <TabsList className="grid w-full grid-cols-3 sm:w-auto bg-slate-100 rounded-xl p-1">
                  <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Daftar Artikel
                  </TabsTrigger>
                  <TabsTrigger value="form" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2">
                    {editingArticle ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {editingArticle ? 'Edit' : 'Buat Baru'}
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Pengaturan
                  </TabsTrigger>
                </TabsList>

                {/* IMPROVEMENT: Tombol utama dengan gaya konsisten */}
                <Button
                  onClick={handleCreateNew}
                  className="w-full sm:w-auto h-11 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Artikel Baru
                </Button>
              </div>

              <div className="p-4 sm:p-6">
                <TabsContent value="list" className="mt-0">
                  <ArticleList
                    showActions={true}
                    isAdminView={true}
                    onEdit={handleEdit}
                    onDelete={(id) => {
                      // Handle delete success if needed
                    }}
                  />
                </TabsContent>

                <TabsContent value="form" className="mt-0">
                  <ArticleForm
                    article={editingArticle || undefined}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                  />
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <div className="space-y-6">
                    <ArticleStats />
                    <CategoryManager />
                    <TagManager />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}