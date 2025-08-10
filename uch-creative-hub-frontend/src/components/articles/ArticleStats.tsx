"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Users, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { articleService } from '@/_services/article.service';

interface ArticleStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalCategories: number;
  totalTags: number;
  totalAuthors: number;
  recentArticles: number;
}

export default function ArticleStats() {
  const [stats, setStats] = useState<ArticleStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalCategories: 0,
    totalTags: 0,
    totalAuthors: 0,
    recentArticles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Load articles, categories, and tags
      const [articlesResponse, categoriesResponse, tagsResponse] = await Promise.all([
        articleService.getArticles(),
        articleService.getCategories(),
        articleService.getTags(),
      ]);

      if (articlesResponse.success && categoriesResponse.success && tagsResponse.success) {
        const articles = articlesResponse.data;
        const categories = categoriesResponse.data;
        const tags = tagsResponse.data;

        // Calculate stats
        const publishedArticles = articles.filter(article => article.published).length;
        const draftArticles = articles.filter(article => !article.published).length;
        
        // Get unique authors
        const uniqueAuthors = new Set(articles.map(article => article.author.name));
        
        // Recent articles (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentArticles = articles.filter(article => 
          new Date(article.createdAt) >= thirtyDaysAgo
        ).length;

        setStats({
          totalArticles: articles.length,
          publishedArticles,
          draftArticles,
          totalCategories: categories.length,
          totalTags: tags.length,
          totalAuthors: uniqueAuthors.size,
          recentArticles,
        });
      }
    } catch (error) {
      console.error('Gagal memuat statistik:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Artikel',
      value: stats.totalArticles,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Semua artikel di sistem',
    },
    {
      title: 'Artikel Published',
      value: stats.publishedArticles,
      icon: Eye,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      description: 'Artikel yang sudah dipublikasi',
    },
    {
      title: 'Draft',
      value: stats.draftArticles,
      icon: FileText,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Artikel belum dipublikasi',
    },
    {
      title: 'Kategori',
      value: stats.totalCategories,
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Total kategori tersedia',
    },
    {
      title: 'Tag',
      value: stats.totalTags,
      icon: TrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Total tag tersedia',
    },
    {
      title: 'Penulis',
      value: stats.totalAuthors,
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Kontributor aktif',
    },
    {
      title: 'Artikel Baru (30 hari)',
      value: stats.recentArticles,
      icon: Calendar,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Artikel dalam 30 hari terakhir',
    },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistik Artikel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-24"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Statistik Artikel</CardTitle>
          <Button onClick={loadStats} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg ${stat.bgColor} border border-gray-100`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm font-medium text-gray-700">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-gray-800 mb-2">Ringkasan</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              • Tingkat publikasi: {stats.totalArticles > 0 ? Math.round((stats.publishedArticles / stats.totalArticles) * 100) : 0}% 
              ({stats.publishedArticles} dari {stats.totalArticles} artikel)
            </p>
            <p>
              • Rata-rata artikel per penulis: {stats.totalAuthors > 0 ? Math.round(stats.totalArticles / stats.totalAuthors) : 0} artikel
            </p>
            <p>
              • Aktivitas bulan ini: {stats.recentArticles} artikel baru dalam 30 hari terakhir
            </p>
            <p>
              • Rata-rata tag per artikel: {stats.totalArticles > 0 ? Math.round(stats.totalTags / stats.totalArticles) : 0} tag
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
