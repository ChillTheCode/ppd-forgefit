import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pengecekanStokService from "../../services/PengecekanStok";
import { PengecekanStokItem } from "../../interface/PengecekanStok";
import { kirimNotifikasi } from "../../services/apiService";

// Simple date formatter function to avoid the external dependency


interface DetailHeaderInfo {
  idPengajuan?: string;
  nomorCabang?: string;
  namaCabang?: string; 
  tanggalPengecekan?: string;
  status?: string;
  namaPetugas?: string;
}

const PengecekanStokDetail: React.FC = () => {
  // Updated to include nomorCabang parameter
  const { nomorCabang, idPengajuan } = useParams<{ 
    nomorCabang: string; 
    idPengajuan: string; 
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<PengecekanStokItem[]>([]);
  const [headerInfo, setHeaderInfo] = useState<DetailHeaderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sendingNotification, setSendingNotification] = useState<boolean>(false);
  const [notificationSent, setNotificationSent] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!idPengajuan || !nomorCabang) {
        setError("Parameter tidak lengkap: ID Pengecekan dan Nomor Cabang diperlukan");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await pengecekanStokService.fetchPengecekanDetail(idPengajuan);
        
        if (response.status === 200 && response.data) {
          setItems(response.data);
          
          // Extract header info from response
          // This assumes your API returns the metadata in a separate field
          // or in the first item with additional fields
          // Adjust as needed based on your actual API response structure
          if (response.data.length > 0) {
            // Extract header info from response metadata or from additional fields in the API response
            // This is just a placeholder - adjust according to your actual API structure
            setHeaderInfo({
              idPengajuan: idPengajuan,
              nomorCabang: nomorCabang, // Use the nomorCabang from URL params
              // Other fields would be extracted from your API response
              // This is just a placeholder as we don't know the exact structure
            });
          }
        } else {
          setError(response.message || "Gagal mengambil data detail pengecekan");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data detail pengecekan");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [idPengajuan, nomorCabang]); // Added nomorCabang to dependency array

  const getStatusColor = (selisih: number): string => {
    if (selisih === 0) return "success";
    if (selisih < 0) return "error";
    return "warning";
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSendInspectionResult = async () => {
    if (!idPengajuan || !nomorCabang) {
      setError("Data pengajuan atau nomor cabang tidak ditemukan");
      return;
    }

    try {
      setSendingNotification(true);
      
      // Prepare inspection result summary
      const totalItems = items.length;
      const checkedItems = items.filter(item => item.stokAktual !== null);
      const itemsWithDiscrepancies = checkedItems.filter(item => {
        const selisih = (item.stokAktual ?? 0) - item.stokSistem;
        return selisih !== 0;
      });
      
      // Create detailed inspection result message
      let inspectionSummary = `Pengecekan stok ${idPengajuan} selesai - Cabang: ${nomorCabang}\n`;
      inspectionSummary += `Total: ${totalItems} item, ${itemsWithDiscrepancies.length} dengan selisih.\n\n`;
      
      if (itemsWithDiscrepancies.length > 0) {
        inspectionSummary += "ITEM DENGAN SELISIH:\n";
        
        itemsWithDiscrepancies.forEach(item => {
          inspectionSummary += `• ${item.namaBarang}: Stok Aktual ${item.stokAktual}\n`;
        });
        
        inspectionSummary += "\nStatus: PERLU REVIEW SEGERA";
      } else {
        inspectionSummary += "✅ Semua stok sesuai dengan sistem. Status: SELESAI";
      }

      // Send notification to Branch Operations Head
      await kirimNotifikasi(
        "Admin", // rolePengirim - adjust based on current user's role
        "Kepala Operasional Cabang", // rolePenerima
        inspectionSummary,
        nomorCabang, // Use nomorCabang from URL params
        idPengajuan
      );

      setNotificationSent(true);
      
      // Show success message temporarily
      setTimeout(() => {
        setNotificationSent(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error sending inspection result:", err);
      
      // More detailed error message for debugging
      let errorMessage = "Gagal mengirim hasil pengecekan. ";
      
      if (err instanceof Error) {
        if (err.message.includes('500')) {
          errorMessage += "Server mengalami masalah internal. Silakan coba lagi atau hubungi administrator sistem.";
        } else if (err.message.includes('404')) {
          errorMessage += "Endpoint tidak ditemukan. Silakan hubungi administrator sistem.";
        } else {
          errorMessage += `Detail: ${err.message}`;
        }
      } else {
        errorMessage += "Silakan coba lagi.";
      }
      
      setError(errorMessage);
      
      // Clear error after 10 seconds
      setTimeout(() => {
        setError(null);
      }, 10000);
    } finally {
      setSendingNotification(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <div className="flex justify-center items-center h-60">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleBack}
          >
            <span className="mr-2">←</span> Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      {/* Header with breadcrumb info */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-2">
          Cabang: {nomorCabang} | ID Pengajuan: {idPengajuan}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Detail Pengecekan Stok</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={handleBack}
        >
          <span className="mr-2">←</span> Kembali
        </button>
        
        <button
          className={`px-6 py-2 rounded flex items-center font-medium ${
            sendingNotification 
              ? "bg-gray-400 cursor-not-allowed" 
              : notificationSent
                ? "bg-green-500 hover:bg-green-600"
                : "bg-orange-500 hover:bg-orange-600"
          } text-white`}
          onClick={handleSendInspectionResult}
          disabled={sendingNotification}
        >
          {sendingNotification ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Mengirim...
            </>
          ) : notificationSent ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Terkirim!
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Kirim Hasil Pengecekan
            </>
          )}
        </button>
      </div>

      {notificationSent && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Hasil pengecekan telah berhasil dikirim ke Kepala Operasional Cabang
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Barang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Sistem</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Aktual</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Selisih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => {
              const selisih = (item.stokAktual ?? 0) - item.stokSistem;
              const statusColor = getStatusColor(selisih);
              
              return (
                <tr key={item.kodeBarang} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.kodeBarang}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.namaBarang}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.stokSistem}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.stokAktual !== null ? item.stokAktual : "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {item.stokAktual !== null ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColor === "success" ? "bg-green-100 text-green-800" : 
                        statusColor === "warning" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        {selisih}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.catatan || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PengecekanStokDetail;