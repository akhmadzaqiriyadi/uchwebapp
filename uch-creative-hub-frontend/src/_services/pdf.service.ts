// src/_services/pdf.service.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Booking } from './booking.service';

export interface PDFOptions {
  title?: string;
  subtitle?: string;
  includeStats?: boolean;
}

export class PDFService {
  private static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  private static formatTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private static getStatusColor(status: string): [number, number, number] {
    switch (status) {
      case 'Approved': return [34, 197, 94]; // green-500
      case 'Rejected': return [239, 68, 68]; // red-500
      case 'Pending': return [245, 158, 11]; // amber-500
      case 'Checked-in': return [59, 130, 246]; // blue-500
      default: return [107, 114, 128]; // gray-500
    }
  }

  static generateBookingReport(bookings: Booking[], options: PDFOptions = {}): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(options.title || 'Laporan Data Booking UCH Creative Hub', pageWidth / 2, 20, { align: 'center' });
    
    if (options.subtitle) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(options.subtitle, pageWidth / 2, 30, { align: 'center' });
    }

    // Date generated
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Intl.DateTimeFormat("id-ID", {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
    doc.text(`Dibuat pada: ${currentDate}`, pageWidth - 14, 15, { align: 'right' });

    let yPosition = options.subtitle ? 40 : 35;

    // Statistics (if enabled)
    if (options.includeStats) {
      const stats = {
        total: bookings.length,
        approved: bookings.filter(b => b.status === 'Approved').length,
        pending: bookings.filter(b => b.status === 'Pending').length,
        rejected: bookings.filter(b => b.status === 'Rejected').length,
        checkedIn: bookings.filter(b => b.status === 'Checked-in').length
      };

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Ringkasan Statistik', 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const statsText = [
        `Total Booking: ${stats.total}`,
        `Disetujui: ${stats.approved}`,
        `Pending: ${stats.pending}`,
        `Ditolak: ${stats.rejected}`,
        `Check-in: ${stats.checkedIn}`
      ];

      statsText.forEach((text, index) => {
        doc.text(text, 14 + (index * 40), yPosition);
      });

      yPosition += 15;
    }

    // Table data
    const tableData = bookings.map(booking => [
      booking.user.name,
      booking.room,
      this.formatDate(booking.bookingDate),
      `${this.formatTime(booking.startTime)} - ${this.formatTime(booking.endTime)}`,
      booking.status,
      booking.purpose || '-'
    ]);

    // Generate table
    autoTable(doc, {
      head: [['Nama Pengguna', 'Ruangan', 'Tanggal', 'Waktu', 'Status', 'Keperluan']],
      body: tableData,
      startY: yPosition,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [46, 65, 122], // UCH primary color
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Nama Pengguna
        1: { cellWidth: 25 }, // Ruangan
        2: { cellWidth: 25 }, // Tanggal
        3: { cellWidth: 30 }, // Waktu
        4: { cellWidth: 20 }, // Status
        5: { cellWidth: 'auto' } // Keperluan
      },
      didParseCell: function(data) {
        // Color coding for status column
        if (data.column.index === 4 && data.section === 'body') {
          const status = data.cell.raw as string;
          const color = PDFService.getStatusColor(status);
          data.cell.styles.textColor = color;
          data.cell.styles.fontStyle = 'bold';
        }
      },
      margin: { top: 10, left: 14, right: 14 },
      tableWidth: 'auto',
      theme: 'striped'
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Halaman ${i} dari ${pageCount} | UCH Creative Hub`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    const fileName = `booking-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  static generateSingleBookingPDF(booking: Booking): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Detail Booking UCH Creative Hub', pageWidth / 2, 20, { align: 'center' });

    // Booking details
    const details = [
      ['Nama Pengguna:', booking.user.name],
      ['NPM:', booking.user.npm],
      ['Ruangan:', booking.room],
      ['Tanggal Booking:', this.formatDate(booking.bookingDate)],
      ['Waktu:', `${this.formatTime(booking.startTime)} - ${this.formatTime(booking.endTime)}`],
      ['Status:', booking.status],
      ['Keperluan:', booking.purpose || '-']
    ];

    let yPosition = 40;
    doc.setFontSize(12);

    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 70, yPosition);
      yPosition += 10;
    });

    // Status badge
    const statusColor = this.getStatusColor(booking.status);
    doc.setFillColor(...statusColor);
    doc.rect(70, yPosition - 5, 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.status, 72, yPosition);

    // Footer
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Intl.DateTimeFormat("id-ID", {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
    doc.text(
      `Dibuat pada: ${currentDate} | UCH Creative Hub`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );

    // Save
    const fileName = `booking-${booking.user.name.replace(/\s+/g, '-')}-${booking.room.replace(/\s+/g, '-')}.pdf`;
    doc.save(fileName);
  }
}
