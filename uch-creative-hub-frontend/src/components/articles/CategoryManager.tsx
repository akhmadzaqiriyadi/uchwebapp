// src/components/articles/CategoryManager.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Folder, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Category, articleService } from '@/_services/article.service';
import LoadingSpinner from '../ui/loading-spinner';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await articleService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error('Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Nama kategori tidak boleh kosong');
      return;
    }

    try {
      const response = await articleService.createCategory(newCategoryName.trim());
      if (response.success) {
        toast.success(response.message);
        setCategories(prev => [...prev, response.data]);
        setNewCategoryName('');
        setIsCreateDialogOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat kategori');
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryName.trim() || !editingCategory) {
      toast.error('Nama kategori tidak boleh kosong');
      return;
    }

    try {
      const response = await articleService.updateCategory(editingCategory.id, editCategoryName.trim());
      if (response.success) {
        toast.success(response.message);
        setCategories(prev => 
          prev.map(cat => cat.id === editingCategory.id 
            ? { ...cat, name: editCategoryName.trim() } 
            : cat
          )
        );
        setEditingCategory(null);
        setEditCategoryName('');
        setIsEditDialogOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate kategori');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const response = await articleService.deleteCategory(categoryId);
      if (response.success) {
        toast.success(response.message);
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus kategori');
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setIsEditDialogOpen(true);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
              <Folder className="h-5 w-5 text-blue-600" />
              Manajemen Kategori
            </CardTitle>
            <CardDescription className="mt-2">Tambah, edit, atau hapus kategori artikel.</CardDescription>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#2E417A] hover:bg-blue-800 text-white rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Kategori Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Nama Kategori</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Contoh: Teknologi"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Batal</Button>
                  <Button onClick={handleCreateCategory} className="bg-[#2E417A] hover:bg-blue-800">Tambah</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner text="Memuat kategori..." />
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl">
            <Folder className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="font-medium">Belum ada kategori</p>
            <p className="text-sm">Klik "Tambah Kategori" untuk membuat yang pertama.</p>
          </div>
        ) : (
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-2/3">Nama Kategori</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-slate-500">{category.id}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => openEditDialog(category)}>
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
                              <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus kategori "{category.name}"? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="bg-red-600 hover:bg-red-700">
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
              <DialogTitle>Edit Kategori</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCategoryName">Nama Kategori</Label>
                <Input
                  id="editCategoryName"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEditCategory()}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
                <Button onClick={handleEditCategory} className="bg-[#2E417A] hover:bg-blue-800">Update</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}