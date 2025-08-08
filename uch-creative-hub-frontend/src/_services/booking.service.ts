// src/_services/booking.service.ts
import api from "@/_lib/api";

// Definisikan tipe data untuk sebuah booking, sesuaikan dengan backend Anda
export interface Booking {
  id: number;
  room: string;
  purpose: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Checked-in';
  user: {
    name: string;
    npm: string;
  };
}

// Definisikan tipe data untuk respons dari API
interface AllBookingsResponse {
  success: boolean;
  data: Booking[];
}

// Fungsi untuk mengambil semua data booking dari backend
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get<AllBookingsResponse>('/admin/bookings');
    return response.data.data;
  } catch (error) {
    // React Query akan menangani error ini, kita hanya perlu melemparnya
    throw new Error('Gagal mengambil data booking');
  }
};


interface UpdateStatusPayload {
  bookingId: number;
  status: 'Approved' | 'Rejected';
}

// Fungsi baru untuk mengupdate status booking
export const updateBookingStatus = async ({ bookingId, status }: UpdateStatusPayload): Promise<Booking> => {
  try {
    const response = await api.patch(`/admin/bookings/${bookingId}/status`, { status });
    return response.data.data;
  } catch (error) {
    // Tangkap pesan error spesifik dari backend jika ada
    const errorMessage = (error as any).response?.data?.message || 'Gagal memperbarui status booking';
    throw new Error(errorMessage);
  }
};


// Tipe data untuk respons dari API generate-qr
interface QRCodeResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

// Fungsi baru untuk meminta token QR Code
export const generateQRCodeForBooking = async (bookingId: number): Promise<string> => {
  try {
    const response = await api.post<QRCodeResponse>(`/admin/bookings/${bookingId}/generate-qr`);
    return response.data.data.token;
  } catch (error) {
    const errorMessage = (error as any).response?.data?.message || 'Gagal membuat QR Code';
    throw new Error(errorMessage);
  }
};


// Tipe data untuk form booking baru
export interface NewBookingPayload {
  room: string;
  purpose: string;
  audience: number;
  date: string;       // Format: 'YYYY-MM-DD'
  startTime: string;  // Format: 'HH:MM'
  endTime: string;    // Format: 'HH:MM'
}

// Fungsi untuk mengirim data booking baru ke backend
export const createNewBooking = async (payload: NewBookingPayload): Promise<Booking> => {
  try {
    // Ubah audience menjadi integer sebelum dikirim
    const dataToSend = {
      ...payload,
      audience: Number(payload.audience),
    };
    const response = await api.post('/bookings', dataToSend);
    return response.data.data;
  } catch (error) {
    const errorMessage = (error as any).response?.data?.message || 'Gagal membuat booking baru';
    throw new Error(errorMessage);
  }
};

export interface MyBookingHistoryItem {
  id: number;
  room: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Checked-in';
}

// Tipe data untuk respons dari API
interface MyHistoryResponse {
    success: boolean;
    data: MyBookingHistoryItem[];
}

// Fungsi untuk mengambil riwayat booking milik user yang login
export const getMyBookingHistory = async (): Promise<MyBookingHistoryItem[]> => {
    try {
        const response = await api.get<MyHistoryResponse>('/bookings/my-history');
        return response.data.data;
    } catch (error) {
        throw new Error('Gagal mengambil riwayat booking');
    }
}

// Tipe data untuk respons dari API available-slots
export interface AvailableSlotsResponse {
  success: boolean;
  data: {
    operatingHours: { start: number; end: number };
    bookedRanges: { start: number; end: number }[];
    availableIntervals: { start: number; end: number }[];
  };
}

// Fungsi baru untuk mengambil slot waktu yang tersedia
export const getAvailableSlots = async (
  date: string,
  room: string
): Promise<AvailableSlotsResponse> => {
  if (!date || !room) {
    // Kembalikan data default jika parameter tidak lengkap agar tidak error
    return {
      success: true,
      data: {
        operatingHours: { start: 0, end: 0 },
        bookedRanges: [],
        availableIntervals: [],
      },
    };
  }
  try {
    const response = await api.get<AvailableSlotsResponse>(
      `/bookings/available-slots`,
      {
        params: { date, room },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as any).response?.data?.message || "Gagal mengambil slot waktu";
    throw new Error(errorMessage);
  }
};


export interface ScheduleItem {
  room: string;
  startTime: string;
  endTime: string;
  user: {
    name: string;
  };
  // Tambahkan properti lain jika ada, sesuaikan dengan respons API Anda
}

// Tipe data untuk respons dari API jadwal
interface ScheduleResponse {
  success: boolean;
  data: ScheduleItem[];
}

// Fungsi baru untuk mengambil jadwal publik berdasarkan tanggal
export const getPublicSchedule = async (date: string): Promise<ScheduleItem[]> => {
  try {
    const response = await api.get<ScheduleResponse>('/bookings/schedule', {
      params: { date },
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Gagal mengambil data jadwal');
  }
};