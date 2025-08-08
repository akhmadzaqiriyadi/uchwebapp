// src/_services/checkin.service.ts
import api from "@/_lib/api";

// Tipe data untuk payload yang dikirim ke backend
interface CheckinPayload {
  token: string;
}

// Tipe data untuk respons sukses dari API
interface CheckinResponse {
  success: boolean;
  message: string;
}

// Fungsi untuk memproses check-in dengan mengirim token ke backend
export const processCheckin = async (payload: CheckinPayload): Promise<CheckinResponse> => {
  try {
    const response = await api.post<CheckinResponse>('/checkin', payload);
    return response.data;
  } catch (error) {
    // Tangkap pesan error spesifik dari backend jika ada
    const errorMessage = (error as any).response?.data?.message || 'Terjadi kesalahan saat check-in';
    throw new Error(errorMessage);
  }
};