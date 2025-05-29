import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import logoLia from "../../assets/logo_lia.png";
import { ReturnResponseDTO } from "../../interface/Return";

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Function to generate approval report PDF
export const generateApprovalPDF = (returnData: ReturnResponseDTO, userRole: string): void => {
  if (!returnData) {
    alert("Tidak ada data untuk di-export.");
    return;
  }

  // Create a standard jsPDF instance
  const doc = new jsPDF();

  // Check if autoTable was imported correctly
  if (typeof autoTable !== 'function') {
    console.error("Error: jspdf-autotable was not imported as a function.");
    alert("PDF Export failed: autoTable function not available.");
    return;
  }

  // Define document properties
  const title = "Laporan Persetujuan Return Barang";
  const subtitle = `ID Return: ${returnData.idInputStokBarangReturn}`;
  const now = new Date();
  const currentDate = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const currentTime = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Add logo
  const logoWidth = 30;
  const logoHeight = 30;
  const logoX = 14;
  const logoY = 10;
  doc.addImage(logoLia, 'PNG', logoX, logoY, logoWidth, logoHeight);

  // Add title and subtitle
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, logoX + logoWidth + 10, logoY + 15);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, logoX + logoWidth + 10, logoY + 25);
  doc.text(`Tanggal: ${currentDate}`, logoX + logoWidth + 10, logoY + 35);
  doc.text(`Pukul: ${currentTime} WIB`, logoX + logoWidth + 10, logoY + 45);

  // Define table data
  const tableData = [
    ['Kode Barang', returnData.kodeBarang?.toString() || '-'],
    ['Nama Barang', returnData.namaBarang || '-'],
    ['Stok Saat Ini', returnData.stokBarangSaatIni.toString()],
    ['Stok Return', returnData.stokInput.toString()],
    ['Perlakuan', returnData.perlakuan],
    ['Harga Barang', returnData.hargaBarang ? formatCurrency(returnData.hargaBarang) : '-'],
    ['Alasan Return', returnData.alasanReturn || '-'],
    ['Status Approval', returnData.statusApproval],
    ['Status Retur', returnData.statusRetur],
  ];

  // Define autoTable options
  const autoTableOptions: UserOptions = {
    startY: logoY + logoHeight + 40,
    head: [['Informasi', 'Detail']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
    didDrawPage: (data) => {
      try {
        interface InternalWithPages {
          getNumberOfPages: () => number;
        }

        const pageCount = (doc.internal as unknown as InternalWithPages).getNumberOfPages();

        doc.setFontSize(8);
        doc.text(`Halaman ${data.pageNumber} dari ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      } catch (e) {
        console.error("Error drawing page footer:", e);
      }
    },
  };

  // Generate table
  autoTable(doc, autoTableOptions);

  // Add signature section
  const finalY = (doc as any).lastAutoTable?.finalY || 200;
  const signatureStartY = finalY + 30;

  doc.setFontSize(10);
  doc.text("Disetujui oleh:", 14, signatureStartY);
  doc.text("Tanggal: " + currentDate, 14, signatureStartY + 10);

  doc.line(14, signatureStartY + 40, 80, signatureStartY + 40); // Signature line
  doc.text(userRole, 14, signatureStartY + 50);

  // Save the PDF
  const fileName = `persetujuan_return_${returnData.idInputStokBarangReturn}.pdf`;
  doc.save(fileName);
};

// Function to generate confirmation report PDF
export const generateConfirmationPDF = (returnData: ReturnResponseDTO, userRole: string): void => {
  if (!returnData) {
    alert("Tidak ada data untuk di-export.");
    return;
  }

  // Create a standard jsPDF instance
  const doc = new jsPDF();

  // Check if autoTable was imported correctly
  if (typeof autoTable !== 'function') {
    console.error("Error: jspdf-autotable was not imported as a function.");
    alert("PDF Export failed: autoTable function not available.");
    return;
  }

  // Define document properties
  const title = "Laporan Konfirmasi Penerimaan Return";
  const subtitle = `ID Return: ${returnData.idInputStokBarangReturn}`;
  const now = new Date();
  const currentDate = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const currentTime = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Add logo
  const logoWidth = 30;
  const logoHeight = 30;
  const logoX = 14;
  const logoY = 10;
  doc.addImage(logoLia, 'PNG', logoX, logoY, logoWidth, logoHeight);

  // Add title and subtitle
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, logoX + logoWidth + 10, logoY + 15);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, logoX + logoWidth + 10, logoY + 25);
  doc.text(`Tanggal: ${currentDate}`, logoX + logoWidth + 10, logoY + 35);
  doc.text(`Pukul: ${currentTime} WIB`, logoX + logoWidth + 10, logoY + 45);

  // Define table data
  const tableData = [
    ['Kode Barang', returnData.kodeBarang?.toString() || '-'],
    ['Nama Barang', returnData.namaBarang || '-'],
    ['Stok Saat Ini', returnData.stokBarangSaatIni.toString()],
    ['Stok Return', returnData.stokInput.toString()],
    ['Jumlah Dikonfirmasi', returnData.jumlahDikonfirmasi?.toString() || '-'],
    ['Perlakuan', returnData.perlakuan],
    ['Harga Barang', returnData.hargaBarang ? formatCurrency(returnData.hargaBarang) : '-'],
    ['Alasan Return', returnData.alasanReturn || '-'],
    ['Status Approval', returnData.statusApproval],
    ['Status Retur', returnData.statusRetur],
  ];

  // Define autoTable options
  const autoTableOptions: UserOptions = {
    startY: logoY + logoHeight + 40,
    head: [['Informasi', 'Detail']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
    didDrawPage: (data) => {
      try {
        interface InternalWithPages {
          getNumberOfPages: () => number;
        }

        const pageCount = (doc.internal as unknown as InternalWithPages).getNumberOfPages();

        doc.setFontSize(8);
        doc.text(`Halaman ${data.pageNumber} dari ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      } catch (e) {
        console.error("Error drawing page footer:", e);
      }
    },
  };

  // Generate table
  autoTable(doc, autoTableOptions);

  // Add signature section
  const finalY = (doc as any).lastAutoTable?.finalY || 200;
  const signatureStartY = finalY + 30;

  doc.setFontSize(10);
  doc.text("Dikonfirmasi oleh:", 14, signatureStartY);
  doc.text("Tanggal: " + currentDate, 14, signatureStartY + 10);

  doc.line(14, signatureStartY + 40, 80, signatureStartY + 40); // Signature line
  doc.text(userRole, 14, signatureStartY + 50);

  // Save the PDF
  const fileName = `konfirmasi_return_${returnData.idInputStokBarangReturn}.pdf`;
  doc.save(fileName);
};
