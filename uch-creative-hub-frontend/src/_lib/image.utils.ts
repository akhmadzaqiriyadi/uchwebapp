/**
 * Utility functions for handling image URLs
 */

// Extract base URL without /api suffix for static files
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

/**
 * Get the full image URL for display
 * @param imageUrl - The image URL from the backend (e.g., "/images/filename.jpg")
 * @returns Full URL to access the image
 */
export function getImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it starts with /public, use it as is with the API base
  if (imageUrl.startsWith('/public')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  
  // If it starts with /images, add /public prefix
  if (imageUrl.startsWith('/images')) {
    return `${API_BASE_URL}/public${imageUrl}`;
  }
  
  // Fallback: assume it needs /public/images prefix
  return `${API_BASE_URL}/public/images/${imageUrl}`;
}

/**
 * Get optimized image URL with optional sizing
 * @param imageUrl - The image URL from the backend
 * @param options - Optional sizing and quality parameters
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  imageUrl: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}
): string | null {
  const url = getImageUrl(imageUrl);
  if (!url) return null;
  
  // For now, return the basic URL
  // In the future, we could add image optimization parameters
  return url;
}
