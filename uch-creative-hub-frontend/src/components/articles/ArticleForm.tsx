"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { X, Upload, Plus, Image as ImageIcon, Folder, Tag as TagIcon, Send, Save, Loader2 } from 'lucide-react';
import QuillEditor, { QuillEditorRef } from './QuillEditor';
import { articleService, Category, Tag, Article } from '@/_services/article.service';
import { getImageUrl } from '@/_lib/image.utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const articleSchema = z.object({
  title: z.string().min(3, 'Judul artikel minimal 3 karakter'),
  published: z.boolean(),
  categoryIds: z.array(z.number()).min(1, 'Minimal pilih satu kategori'),
  tagNames: z.array(z.string()).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  article?: Article;
  onSuccess?: (article: Article) => void;
  onCancel?: () => void;
}

export default function ArticleForm({ article, onSuccess, onCancel }: ArticleFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const editorRef = useRef<QuillEditorRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    mode: 'onChange',
    defaultValues: {
      title: article?.title || '',
      published: article?.published || false,
      categoryIds: article?.categories.map(c => c.id) || [],
      tagNames: article?.tags.map(t => t.name) || [],
    },
  });

  const watchedCategoryIds = watch('categoryIds');

  useEffect(() => {
    loadInitialData();
    if (article) {
      if (article.imageUrl) setImagePreview(getImageUrl(article.imageUrl) || '');
      if (editorRef.current) editorRef.current.setContent(article.content || '');
      setSelectedTags(article.tags.map(t => t.name));
    }
  }, [article]);

  const loadInitialData = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        articleService.getCategories(),
        articleService.getTags(),
      ]);
      if (catRes.success) setCategories(catRes.data);
      if (tagRes.success) setTags(tagRes.data);
    } catch (error) {
      toast.error('Gagal memuat data awal (kategori/tag)');
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file tidak didukung. Gunakan JPEG, PNG, atau GIF.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Ukuran file terlalu besar. Maksimal 5MB.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      const updatedTags = [...selectedTags, trimmedTag];
      setSelectedTags(updatedTags);
      setValue('tagNames', updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    setValue('tagNames', updatedTags);
  };

  const handleSelectExistingTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      const updatedTags = [...selectedTags, tagName];
      setSelectedTags(updatedTags);
      setValue('tagNames', updatedTags);
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    try {
      const content = editorRef.current?.getContent() || '';
      if (!content.trim() || content === '<p><br></p>') {
        toast.error('Konten artikel tidak boleh kosong');
        setIsSubmitting(false);
        return;
      }
      if (!article && !selectedImage) {
        toast.error('Gambar utama wajib diupload');
        setIsSubmitting(false);
        return;
      }
      const articleData = {
        title: data.title,
        content,
        published: data.published,
        categoryIds: data.categoryIds,
        tagNames: selectedTags,
        image: selectedImage || undefined,
      };
      const response = article ? await articleService.updateArticle({ id: article.id, ...articleData }) : await articleService.createArticle(articleData);
      if (response.success) {
        toast.success(response.message);
        onSuccess?.(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <Label htmlFor="title" className="text-lg font-semibold text-slate-800">Judul Artikel</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Buat judul yang menarik..."
                className="mt-2 h-12 text-lg rounded-xl border-slate-200 focus:border-[#2E417A] focus:ring-[#2E417A]/20"
              />
              {errors.title && <p className="text-sm text-red-500 mt-2">{errors.title.message}</p>}
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <Label className="text-lg font-semibold text-slate-800">Konten Artikel</Label>
              <div className="mt-2">
                <QuillEditor
                  ref={editorRef}
                  value={article?.content}
                  placeholder="Tulis cerita Anda di sini..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Send className="w-5 h-5 text-blue-600" /> Publikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                <Checkbox
                  id="published"
                  checked={watch('published')}
                  onCheckedChange={(checked) => setValue('published', checked === true)}
                />
                <Label htmlFor="published" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Publikasikan artikel ini
                </Label>
              </div>
<div className="flex gap-3 mt-4">
  <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Batal</Button>
  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#2E417A] hover:bg-blue-800">
    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
    <span className="ml-2">{article ? 'Update' : 'Simpan'}</span>
  </Button>
</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-blue-600" /> Gambar Utama</CardTitle>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="relative w-full h-40 bg-slate-100 rounded-lg overflow-hidden group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>Ganti</Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => { setImagePreview(''); setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="text-center text-slate-500">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Upload Gambar</p>
                    <p className="text-xs">Max 5MB</p>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/gif" onChange={handleImageSelect} className="hidden" />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Folder className="w-5 h-5 text-blue-600" /> Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-40">
                <div className="space-y-3 pr-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 transition-colors">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={watchedCategoryIds?.includes(category.id)}
                        onCheckedChange={(checked) => {
                          const currentIds = watchedCategoryIds || [];
                          const newIds = checked ? [...currentIds, category.id] : currentIds.filter(id => id !== category.id);
                          setValue('categoryIds', newIds, { shouldValidate: true });
                        }}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer flex-1">{category.name}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {errors.categoryIds && <p className="text-sm text-red-500 mt-2">{errors.categoryIds.message}</p>}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TagIcon className="w-5 h-5 text-blue-600" /> Tag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-500"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Tambah tag..." onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} />
                <Button type="button" onClick={handleAddTag}><Plus className="h-4 w-4" /></Button>
              </div>
              {tags.length > 0 && (
                <ScrollArea className="h-24 mt-4">
                  <div className="flex flex-wrap gap-2 pr-4">
                    {tags.filter(t => !selectedTags.includes(t.name)).map((tag) => (
                      <button key={tag.id} type="button" onClick={() => handleSelectExistingTag(tag.name)} className="px-2 py-1 text-xs rounded-full border bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}