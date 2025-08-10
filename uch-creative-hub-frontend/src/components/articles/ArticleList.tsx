"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Eye, Search, Filter, Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { Article, Category, articleService } from '@/_services/article.service';
import { getImageUrl } from '@/_lib/image.utils';
import { toast } from 'sonner';

interface ArticleListProps {
  showActions?: boolean;
  limit?: number;
  onEdit?: (article: Article) => void;
  onDelete?: (articleId: number) => void;
  isAdminView?: boolean; // Parameter baru untuk menentukan apakah ini view admin
}

export default function ArticleList({ showActions = false, limit, onEdit, onDelete, isAdminView = false }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      
      // Gunakan method yang sesuai berdasarkan view
      const response = isAdminView 
        ? await articleService.getAllArticlesForAdmin()
        : await articleService.getArticles();
        
      if (response.success) {
        let articlesData = response.data;
        if (limit) {
          articlesData = articlesData.slice(0, limit);
        }
        setArticles(articlesData);
      }
    } catch (error) {
      toast.error('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await articleService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Gagal memuat kategori');
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(article =>
        article.categories.some(cat => cat.name === selectedCategory)
      );
    }

    setFilteredArticles(filtered);
  };

  const handleDelete = async (articleId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      try {
        const response = await articleService.deleteArticle(articleId);
        if (response.success) {
          toast.success(response.message);
          setArticles(prev => prev.filter(article => article.id !== articleId));
          onDelete?.(articleId);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Gagal menghapus artikel');
      }
    }
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-3xl overflow-hidden bg-white shadow animate-pulse">
            <div className="h-60 bg-gradient-to-br from-slate-200 to-slate-300"></div>
            <div className="p-6">
              <div className="h-4 bg-slate-200 rounded mb-3"></div>
              <div className="h-6 bg-slate-200 rounded mb-4"></div>
              <div className="h-3 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      {!limit && (
        <div className="rounded-3xl bg-white shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#2E417A] h-5 w-5" />
                <Input
                  placeholder="Cari artikel atau penulis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-slate-200 focus:border-[#2E417A] focus:ring-[#2E417A]/20"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-56 h-14 py-6 rounded-xl border-slate-200 focus:border-[#2E417A] focus:ring-[#2E417A]/20">
                  <Filter className="h-6 w-5 mr-2 text-[#2E417A]" />
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-3xl bg-white shadow-lg overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Eye className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg">Tidak ada artikel yang ditemukan.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div key={article.id} className="rounded-3xl overflow-hidden bg-white shadow hover:shadow-xl transition-all duration-300 group">
              {/* Article Image */}
              <div className="relative h-60 bg-gradient-to-br from-slate-100 to-slate-200">
                {article.imageUrl ? (
                  <Image
                    src={getImageUrl(article.imageUrl) || '/placeholder.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-[#2E417A]" />
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                {!article.published && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-amber-100 text-amber-800 border-0 px-3 py-1 rounded-xl font-medium">
                      Draft
                    </Badge>
                  </div>
                )}

                {/* Categories overlay */}
                {article.categories.length > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-[#2E417A] border-0 px-3 py-1 rounded-xl font-semibold shadow-sm">
                      {article.categories[0].name}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Title */}
                <h3 className="font-bold text-xl mb-3 text-slate-800 line-clamp-2 group-hover:text-[#2E417A] transition-colors">
                  {showActions ? (
                    article.title
                  ) : (
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  )}
                </h3>

                {/* Content Preview */}
                {article.content && (
                  <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                    {truncateContent(article.content)}
                  </p>
                )}

                {/* Author and Date */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-slate-500">
                    <User className="w-4 h-4 mr-2 text-[#2E417A]" />
                    <span className="text-sm">{article.author.name}</span>
                  </div>
                  <div className="flex items-center text-slate-500">
                    <Calendar className="w-4 h-4 mr-2 text-[#2E417A]" />
                    <span className="text-sm">
                      {format(new Date(article.createdAt), 'dd MMMM yyyy', { locale: id })}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span 
                        key={`tag-${article.id}-${tag.id || tag.name}-${tagIndex}`}
                        className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium"
                      >
                        #{tag.name}
                      </span>
                    ))}
                    {article.tags.length > 2 && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                        +{article.tags.length - 2} lagi
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                {showActions ? (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => onEdit?.(article)}
                      className="flex-1 h-12 bg-[#2E417A] hover:bg-blue-800 text-white rounded-xl font-semibold transition-all duration-300"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(article.id)}
                      variant="outline"
                      className="h-12 px-4 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link
                    href={`/articles/${article.slug}`}
                    className="w-full flex items-center justify-center py-3 bg-[#2E417A] text-white rounded-xl hover:bg-blue-800 transition-all duration-300 font-semibold group"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}