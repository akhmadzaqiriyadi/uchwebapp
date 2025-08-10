"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Tag, Folder, X, ZoomIn, Share2, Clock, Twitter, Linkedin, Facebook } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Article, articleService } from '@/_services/article.service';
import { getImageUrl } from '@/_lib/image.utils';
import { toast } from 'sonner';
import ArticleList from '@/components/articles/ArticleList';

export default function ArticleDetail() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const params = useParams();
  const router = useRouter();
  
  const slug = typeof params.slug === 'string' ? params.slug : '';

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleService.getArticleBySlug(slug);
      if (response.success) {
        setArticle(response.data);
      }
    } catch (err: any) {
      setError(err.response?.status === 404 ? 'Artikel tidak ditemukan' : 'Gagal memuat artikel');
      if (err.response?.status !== 404) toast.error('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'clipboard') => {
    const url = window.location.href;
    const text = `Baca artikel menarik: ${article?.title}`;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(article?.title || '')}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'clipboard':
        navigator.clipboard.writeText(url);
        toast.success('Link berhasil disalin!');
        return;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 animate-pulse">
          <div className="h-10 bg-slate-200 rounded-lg w-32 mb-8"></div>
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-slate-200 rounded w-full mb-6"></div>
          <div className="h-80 bg-slate-200 rounded-2xl mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-slate-200/80 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-100 flex items-center justify-center">
                <X className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-3">{error || 'Artikel Tidak Ditemukan'}</h1>
              <p className="text-slate-600 mb-8">Halaman yang Anda cari mungkin tidak ada atau telah dipindahkan.</p>
              <Button onClick={() => router.back()} className="h-12 px-8 bg-[#2E417A] hover:bg-blue-800 text-white rounded-xl font-semibold">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali
              </Button>
            </div>
          </div>
        </div>
      );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-12">
        <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
          
          {/* Back Button and Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="ghost" onClick={() => router.back()} className="mb-8 h-14 px-6 rounded-xl hover:bg-white/80">
              <ArrowLeft className="h-5 w-5 mr-2"/>
              Kembali ke Artikel
            </Button>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {article.categories.map((category) => (
                  <Badge key={category.id} className="bg-[#2E417A]/10 text-[#2E417A] border-0 px-4 py-2 rounded-xl font-semibold text-sm">
                    {category.name}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-slate-600">
                <div className="flex items-center gap-2"><User className="h-4 w-4 text-[#2E417A]" /> <span className="font-medium">{article.author.name}</span></div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#2E417A]" /> <span>{format(new Date(article.createdAt), 'dd MMMM yyyy', { locale: id })}</span></div>
                {article.updatedAt !== article.createdAt && (
                  <div className="flex items-center gap-2 text-slate-500"><Clock className="h-4 w-4 text-amber-600" /> <span className="text-sm">Diperbarui: {format(new Date(article.updatedAt), 'dd MMM yyyy', { locale: id })}</span></div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="my-8 md:my-12">
            {article.imageUrl && (
              <div className="relative h-64 md:h-80 lg:h-[500px] bg-slate-200 rounded-2xl lg:rounded-3xl overflow-hidden group cursor-pointer shadow-xl" onClick={() => setShowImagePreview(true)}>
                <Image src={getImageUrl(article.imageUrl) || '/placeholder.jpg'} alt={article.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" priority />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3"><ZoomIn className="h-6 w-6 text-[#2E417A]" /></div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Main Content with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
                className="prose prose-lg max-w-none article-content bg-white/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200/60"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />
            </div>

            {/* Sticky Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                  <Card className="shadow-lg border-0 rounded-2xl">
                    <CardHeader><CardTitle>Tentang Penulis</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xl text-slate-600">{article.author.name.charAt(0)}</div>
                        <div>
                          <p className="font-semibold text-slate-800">{article.author.name}</p>
                          <p className="text-sm text-slate-500">{article.author.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                {article.tags.length > 0 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                    <Card className="shadow-lg border-0 rounded-2xl">
                      <CardHeader><CardTitle className="flex items-center gap-2"><Tag className="w-5 h-5 text-blue-600" /> Topik Terkait</CardTitle></CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <Badge key={tag.id} className="bg-blue-100 text-blue-700 border-0 px-3 py-1 rounded-full font-medium">#{tag.name}</Badge>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                  <Card className="shadow-lg border-0 rounded-2xl">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Share2 className="w-5 h-5 text-blue-600" /> Bagikan Artikel</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-around">
                      <Button variant="ghost" size="icon" onClick={() => handleShare('twitter')}><Twitter className="w-5 h-5 text-sky-500" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleShare('linkedin')}><Linkedin className="w-5 h-5 text-blue-700" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleShare('facebook')}><Facebook className="w-5 h-5 text-blue-800" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleShare('clipboard')}><Share2 className="w-5 h-5 text-slate-500" /></Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </aside>
          </div>
          
          {/* Related Articles Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} className="mt-16 lg:mt-24 pt-12 border-t border-slate-200">
             <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Artikel Lainnya</h2>
             <ArticleList limit={3} />
          </motion.div>

        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && article.imageUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowImagePreview(false)}>
          <button onClick={() => setShowImagePreview(false)} className="absolute top-4 right-4 text-white hover:text-slate-300"><X className="h-8 w-8" /></button>
          <Image src={getImageUrl(article.imageUrl) || '/placeholder.jpg'} alt={article.title} width={1200} height={800} className="max-w-full max-h-[90vh] object-contain rounded-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      <style jsx global>{`
        /* Styling untuk konten yang dirender dari HTML */
        .article-content h1, .article-content h2, .article-content h3 {
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #1e293b;
        }
        .article-content p {
          line-height: 1.75;
          margin-bottom: 1em;
          color: #334155;
        }
        .article-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .article-content ul, .article-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1em;
        }
        .article-content li {
          margin-bottom: 0.5em;
        }
        .article-content blockquote {
          border-left: 4px solid #93c5fd;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #475569;
        }
        .article-content img {
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }
      `}</style>
    </>
  );
}