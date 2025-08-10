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
  
  // Remove /public if present in the path to avoid double /public
  const cleanPath = imageUrl.replace(/^\/public/, '');
  
  // For production, use /uploads/ path for artikel images
  if (cleanPath.startsWith('/images/image-')) {
    return `${API_BASE_URL}/uploads${cleanPath.replace('/images', '')}`;
  }
  
  // For static assets (hero.svg, etc), keep /images/ path
  if (cleanPath.startsWith('/images/')) {
    return cleanPath; // Will be handled by Next.js static files
  }
  
  // If it starts with /uploads, use as is
  if (cleanPath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  
  // Fallback: assume it's an uploaded file
  return `${API_BASE_URL}/uploads/${cleanPath}`;
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
