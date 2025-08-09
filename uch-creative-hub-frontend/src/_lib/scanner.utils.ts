// src/_lib/scanner.utils.ts

export interface ScanResult {
  text: string;
  format: string;
}

export interface ScanError {
  message: string;
  code: string;
}

/**
 * Validate file type for image scanning
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const validTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/bmp',
    'image/gif'
  ];

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format file tidak didukung. Gunakan JPG, PNG, WEBP, BMP, atau GIF'
    };
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Ukuran file terlalu besar. Maksimal 10MB'
    };
  }

  return { isValid: true };
}

/**
 * Get user-friendly error messages for scanner errors
 */
export function getScannerErrorMessage(error: any): string {
  const errorString = error?.message || error?.toString() || '';
  
  if (errorString.includes('Permission denied')) {
    return 'Akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser';
  }
  
  if (errorString.includes('NotFoundError')) {
    return 'Kamera tidak ditemukan. Pastikan perangkat memiliki kamera';
  }
  
  if (errorString.includes('NotAllowedError')) {
    return 'Akses kamera tidak diizinkan. Periksa pengaturan browser';
  }
  
  if (errorString.includes('NotReadableError')) {
    return 'Kamera sedang digunakan aplikasi lain';
  }
  
  if (errorString.includes('OverconstrainedError')) {
    return 'Kamera tidak mendukung konfigurasi yang diminta';
  }

  if (errorString.includes('No QR code found') || errorString.includes('NotFoundException')) {
    return 'QR/Barcode tidak terdeteksi dalam gambar';
  }

  if (errorString.includes('Unable to decode')) {
    return 'Gagal membaca QR/Barcode. Pastikan kode terlihat jelas';
  }

  return errorString || 'Terjadi kesalahan tidak terduga';
}

/**
 * Check if device supports camera
 */
export async function checkCameraSupport(): Promise<{ 
  isSupported: boolean; 
  hasCamera: boolean; 
  error?: string 
}> {
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        isSupported: false,
        hasCamera: false,
        error: 'Browser tidak mendukung akses kamera'
      };
    }

    // Check if camera devices are available
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    
    return {
      isSupported: true,
      hasCamera: cameras.length > 0,
      error: cameras.length === 0 ? 'Tidak ada kamera yang terdeteksi' : undefined
    };
  } catch (error) {
    return {
      isSupported: false,
      hasCamera: false,
      error: getScannerErrorMessage(error)
    };
  }
}

/**
 * Request camera permission
 */
export async function requestCameraPermission(): Promise<{
  granted: boolean;
  error?: string;
}> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    
    // Stop the stream immediately since we only needed to check permission
    stream.getTracks().forEach(track => track.stop());
    
    return { granted: true };
  } catch (error) {
    return {
      granted: false,
      error: getScannerErrorMessage(error)
    };
  }
}
