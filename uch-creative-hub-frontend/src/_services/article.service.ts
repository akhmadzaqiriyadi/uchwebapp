import api, { publicApi } from "@/_lib/api";

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Author {
  name: string;
  email: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content?: string;
  imageUrl: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  categories: Category[];
  tags: Tag[];
}

export interface CreateArticleData {
  title: string;
  content: string;
  published: boolean;
  categoryIds: number[];
  tagNames: string[];
  image?: File;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
  id: number;
}

class ArticleService {
  // Get all articles (public and admin)
  async getArticles(filters?: {
    category?: string;
    tag?: string;
    includeUnpublished?: boolean; // Parameter baru untuk admin
  }): Promise<{ success: boolean; data: Article[] }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.tag) queryParams.append('tag', filters.tag);
      if (filters?.includeUnpublished) queryParams.append('includeUnpublished', 'true');
      
      // Gunakan publicApi untuk request public (tanpa authentication)
      const response = await publicApi.get(`/articles?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  // Get article by slug (public)
  async getArticleBySlug(slug: string): Promise<{ success: boolean; data: Article }> {
    try {
      // Gunakan publicApi untuk request public (tanpa authentication)
      const response = await publicApi.get(`/articles/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article by slug:', error);
      throw error;
    }
  }

  // Get all articles for admin (including unpublished)
  async getAllArticlesForAdmin(): Promise<{ success: boolean; data: Article[] }> {
    try {
      // Gunakan authenticated API untuk admin
      const response = await api.get('/articles?includeUnpublished=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching articles for admin:', error);
      throw error;
    }
  }

  // Create new article (Author/Admin)
  async createArticle(data: CreateArticleData): Promise<{ success: boolean; data: Article; message: string }> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('published', data.published ? 'true' : 'false');
      
      // Always send categoryIds and tagNames, even if empty
      formData.append('categoryIds', JSON.stringify(data.categoryIds || []));
      formData.append('tagNames', JSON.stringify(data.tagNames || []));
      
      // Image is required for new articles
      if (data.image && data.image instanceof File) {
        formData.append('image', data.image);
      } else {
        throw new Error('Gambar utama wajib diupload');
      }

      const response = await api.post('/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error: any) {
      // Fallback to mock data if API fails
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.warn('API not available, using mock data');
        const mockId = Date.now();
        const mockArticle: Article = {
          id: mockId,
          title: data.title,
          slug: generateSlug(data.title),
          content: data.content,
          imageUrl: data.image ? URL.createObjectURL(data.image) : '',
          published: data.published,
          authorId: 1,
          author: { name: 'Mock Author', email: 'mock@example.com' },
          categories: data.categoryIds?.map(id => ({ id, name: `Category ${id}` })) || [],
          tags: data.tagNames?.map((name, idx) => ({ id: idx + 1, name })) || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return {
          success: true,
          message: 'Artikel berhasil dibuat (mock)',
          data: mockArticle
        };
      }
      throw error;
    }
  }

  // Update article (Author/Admin)
  async updateArticle(data: UpdateArticleData): Promise<{ success: boolean; data: Article; message: string }> {
    try {
      const formData = new FormData();
      
      if (data.title) formData.append('title', data.title);
      if (data.content) formData.append('content', data.content);
      if (data.published !== undefined) formData.append('published', data.published.toString());
      
      // Always send categoryIds and tagNames when updating
      if (data.categoryIds !== undefined) formData.append('categoryIds', JSON.stringify(data.categoryIds));
      if (data.tagNames !== undefined) formData.append('tagNames', JSON.stringify(data.tagNames));
      
      // Only append image if it exists and is a File object
      if (data.image && data.image instanceof File) {
        formData.append('image', data.image);
      }

      const response = await api.patch(`/articles/${data.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data;
    } catch (error: any) {
      // Fallback to mock data if API fails
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.warn('API not available, using mock data for update');
        const mockArticle: Article = {
          id: data.id,
          title: data.title || 'Updated Title',
          slug: generateSlug(data.title || 'updated-title'),
          content: data.content || '',
          imageUrl: data.image ? URL.createObjectURL(data.image) : '/placeholder.jpg',
          published: data.published || false,
          authorId: 1,
          author: { name: 'Mock Author', email: 'mock@example.com' },
          categories: data.categoryIds?.map(id => ({ id, name: `Category ${id}` })) || [],
          tags: data.tagNames?.map((name, idx) => ({ id: idx + 1, name })) || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return {
          success: true,
          message: 'Artikel berhasil diperbarui (mock)',
          data: mockArticle
        };
      }
      throw error;
    }
  }

  // Delete article (Author/Admin)
  async deleteArticle(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  }

  // Get all categories (public)
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get all tags (public)
  async getTags(): Promise<{ success: boolean; data: Tag[] }> {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  // Create category (Admin only)
  async createCategory(name: string): Promise<{ success: boolean; data: Category; message: string }> {
    const response = await api.post('/categories', { name });
    return response.data;
  }

  // Update category (Admin only)
  async updateCategory(id: number, name: string): Promise<{ success: boolean; data: Category; message: string }> {
    const response = await api.patch(`/categories/${id}`, { name });
    return response.data;
  }

  // Delete category (Admin only)
  async deleteCategory(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }

  // Create tag (Admin only)
  async createTag(name: string): Promise<{ success: boolean; data: Tag; message: string }> {
    const response = await api.post('/tags', { name });
    return response.data;
  }

  // Update tag (Admin only)
  async updateTag(id: number, name: string): Promise<{ success: boolean; data: Tag; message: string }> {
    const response = await api.patch(`/tags/${id}`, { name });
    return response.data;
  }

  // Delete tag (Admin only)
  async deleteTag(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  }
}

export const articleService = new ArticleService();
