// src/components/articles/TagManager.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tag, articleService } from '@/_services/article.service';
import LoadingSpinner from '../ui/loading-spinner';

export default function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [editTagName, setEditTagName] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await articleService.getTags();
      if (response.success) {
        setTags(response.data);
      }
    } catch (error) {
      toast.error('Gagal memuat tag');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Nama tag tidak boleh kosong');
      return;
    }

    try {
      const response = await articleService.createTag(newTagName.trim());
      if (response.success) {
        toast.success(response.message);
        setTags(prev => [...prev, response.data]);
        setNewTagName('');
        setIsCreateDialogOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat tag');
    }
  };

  const handleEditTag = async () => {
    if (!editTagName.trim() || !editingTag) {
      toast.error('Nama tag tidak boleh kosong');
      return;
    }

    try {
      const response = await articleService.updateTag(editingTag.id, editTagName.trim());
      if (response.success) {
        toast.success(response.message);
        setTags(prev => 
          prev.map(tag => tag.id === editingTag.id 
            ? { ...tag, name: editTagName.trim() } 
            : tag
          )
        );
        setEditingTag(null);
        setEditTagName('');
        setIsEditDialogOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate tag');
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      const response = await articleService.deleteTag(tagId);
      if (response.success) {
        toast.success(response.message);
        setTags(prev => prev.filter(tag => tag.id !== tagId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus tag');
    }
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
              <TagIcon className="h-5 w-5 text-blue-600" />
              Manajemen Tag
            </CardTitle>
            <CardDescription className="mt-2">Tambah, edit, atau hapus tag artikel.</CardDescription>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#2E417A] hover:bg-blue-800 text-white rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Tag Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tagName">Nama Tag</Label>
                  <Input
                    id="tagName"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Contoh: javascript"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Batal</Button>
                  <Button onClick={handleCreateTag} className="bg-[#2E417A] hover:bg-blue-800">Tambah</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner text="Memuat tag..." />
        ) : tags.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl">
            <TagIcon className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="font-medium">Belum ada tag</p>
            <p className="text-sm">Klik "Tambah Tag" untuk membuat yang pertama.</p>
          </div>
        ) : (
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-2/3">Nama Tag</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell className="text-slate-500">{tag.id}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => openEditDialog(tag)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Tag</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus tag "{tag.name}"? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteTag(tag.id)} className="bg-red-600 hover:bg-red-700">
                                Ya, Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTagName">Nama Tag</Label>
                <Input
                  id="editTagName"
                  value={editTagName}
                  onChange={(e) => setEditTagName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEditTag()}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
                <Button onClick={handleEditTag} className="bg-[#2E417A] hover:bg-blue-800">Update</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}