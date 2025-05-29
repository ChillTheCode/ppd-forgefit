import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pengecekanStokService from "../../services/PengecekanStok";

// Interface definitions
interface PengecekanStokItem {
  kodeBarang: string;
  namaBarang: string;
  kategoriBarang: string;
  stokSistem: number;
  stokAktual: number | null;
  satuan: string; // This was missing in the API response mapping
  catatanPengecekan: string;
  statusPengecekan: string;
  statusKesesuaian: string | null;
  idPengajuan?: string;
  // Add these properties that seem to be coming from API
  hargaBarang?: number;
  bentuk?: string;
  namaCabang?: string; // Add this to fix the namaCabang error
}

interface UpdateStokAktualRequest {
  stokAktual: number;
  catatan: string;
}

function PengecekanStokCabang() {
  const navigate = useNavigate();
  const { nomorCabang, idPengajuan } = useParams<{ 
    nomorCabang: string; 
    idPengajuan: string; 
  }>();
  
  const [items, setItems] = useState<PengecekanStokItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PengecekanStokItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [namaCabang, setNamaCabang] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string>("semua");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fetch items from the branch
  useEffect(() => {
    if (!nomorCabang || !idPengajuan) {
      setError("Nomor cabang atau ID pengajuan tidak valid");
      setLoading(false);
      return;
    }
    
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await pengecekanStokService.fetchCabangItems(nomorCabang);
        
        if (response.status === 200 && response.data) {
          // Initialize items with null actual stock and ensure all required properties exist
          const initializedItems: PengecekanStokItem[] = response.data.map((item: any) => ({ 
            kodeBarang: item.kodeBarang,
            namaBarang: item.namaBarang,
            kategoriBarang: item.kategoriBarang,
            stokSistem: item.stokSistem,
            stokAktual: null,
            satuan: item.satuan || "pcs", // Provide default value if missing
            catatanPengecekan: "",
            statusPengecekan: item.statusPengecekan || "pending",
            statusKesesuaian: null,
            idPengajuan: item.idPengajuan,
            // Include optional properties that might exist
            hargaBarang: item.hargaBarang,
            bentuk: item.bentuk,
            namaCabang: item.namaCabang
          }));
          
          setItems(initializedItems);
          setFilteredItems(initializedItems);
          
          // Extract branch name - use namaCabang from item or fall back to nomorCabang
          if (initializedItems.length > 0 && initializedItems[0].namaCabang) {
            setNamaCabang(initializedItems[0].namaCabang);
          }
        } else {
          setError(response.message || "Gagal memuat data barang");
        }
      } catch (err) {
        console.error("Error fetching branch items:", err);
        setError("Terjadi kesalahan saat mengambil data barang. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [nomorCabang, idPengajuan]);
  
  // Filter items when search term or filter changes
  useEffect(() => {
    let result = [...items];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.namaBarang.toLowerCase().includes(lowerSearchTerm) || 
        item.kodeBarang.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply status filter
    if (filter !== "semua") {
      if (filter === "terverifikasi") {
        result = result.filter(item => item.stokAktual !== null);
      } else if (filter === "belum") {
        result = result.filter(item => item.stokAktual === null);
      } else if (filter === "masalah") {
        result = result.filter(item => 
          item.stokAktual !== null && 
          item.stokAktual !== item.stokSistem
        );
      }
    }
    
    setFilteredItems(result);
  }, [items, searchTerm, filter]);
  
  // Handle input change for actual stock
  const handleStokAktualChange = (index: number, value: string) => {
    const numValue = value === "" ? null : parseInt(value, 10);
    
    const updatedItems = [...items];
    updatedItems[index].stokAktual = numValue;
    
    // Check if the stocks match and update the status
    if (numValue !== null) {
      updatedItems[index].statusKesesuaian = 
        numValue === updatedItems[index].stokSistem ? "sesuai" : "tidak_sesuai";
    } else {
      updatedItems[index].statusKesesuaian = null;
    }
    
    setItems(updatedItems);
  };
  
  // Handle note change
  const handleCatatanChange = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index].catatanPengecekan = value;
    setItems(updatedItems);
  };
  
  // Submit pengecekan stok - update all items at once
  const handleSubmit = async () => {
    // Validate all items have been checked
    const uncheckedItems = items.filter(item => item.stokAktual === null);
    if (uncheckedItems.length > 0) {
      setError(`Masih ada ${uncheckedItems.length} barang yang belum diperiksa stoknya.`);
      return;
    }

    // Validate idPengajuan exists
    if (!idPengajuan) {
      setError("ID Pengajuan tidak valid. Silakan periksa URL atau coba lagi.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Update each item individually using UpdateStokAktualRequest
      const updatePromises = items.map(async (item) => {
        const request: UpdateStokAktualRequest = {
          stokAktual: item.stokAktual as number,
          catatan: item.catatanPengecekan
        };

        return pengecekanStokService.updateStokAktual(
          idPengajuan,
          item.kodeBarang,
          request
        );
      });

      // Wait for all updates to complete
      const responses = await Promise.all(updatePromises);
      
      // Check if all updates were successful
      const failedUpdates = responses.filter(response => response.status !== 200);
      
      if (failedUpdates.length > 0) {
        setError(`Gagal memperbarui ${failedUpdates.length} item. Silakan coba lagi.`);
        return;
      }

      setSuccessMessage("Semua stok barang telah berhasil diperbarui.");
      
      // Redirect to history page after 2 seconds
      setTimeout(() => {
        navigate("/inisiasi-pengecekan");
      }, 2000);

    } catch (err) {
      console.error("Error updating stock items:", err);
      setError("Terjadi kesalahan saat memperbarui stok barang. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Calculate summary statistics
  const totalItems = items.length;
  const checkedItems = items.filter(item => item.stokAktual !== null).length;
  // Remove unused variable 'problemItems' - it was assigned but never used
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pengecekan Stok Cabang</h1>
          <p className="mt-2 text-sm text-gray-600">
            {namaCabang ? `Cabang ${namaCabang} (${nomorCabang})` : `Cabang ${nomorCabang}`}
          </p>
          {idPengajuan && (
            <p className="mt-1 text-xs text-gray-500">
              ID Pengajuan: {idPengajuan}
            </p>
          )}
          
          {/* Progress summary */}
          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-blue-800">Total Barang</h3>
                <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-green-800">Telah Diperiksa</h3>
                <p className="text-2xl font-bold text-green-600">{checkedItems}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-yellow-800">Belum Diperiksa</h3>
                <p className="text-2xl font-bold text-yellow-600">{totalItems - checkedItems}</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 ease-in-out"
                  style={{ width: `${(checkedItems / totalItems) * 100}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 text-right">
                {checkedItems} dari {totalItems} barang ({Math.round((checkedItems / totalItems) * 100) || 0}%)
              </p>
            </div>
          </div>
        </div>
        
        {/* Search and filter */}
        <div className="mb-4 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Cari nama atau kode barang"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mr-2">
                Filter:
              </label>
              <select
                id="filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="semua">Semua</option>
                <option value="terverifikasi">Terverifikasi</option>
                <option value="belum">Belum Diperiksa</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Success message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Memuat data barang...</span>
          </div>
        )}
        
        {/* Items table */}
        {!loading && filteredItems.length > 0 && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode Barang
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok Aktual
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const originalIndex = items.findIndex(i => i.kodeBarang === item.kodeBarang);
                  
                  return (
                    <tr key={item.kodeBarang}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.kodeBarang}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.namaBarang}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.kategoriBarang}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          className="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={item.stokAktual === null ? "" : item.stokAktual}
                          onChange={(e) => handleStokAktualChange(originalIndex, e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Catatan (opsional)"
                          value={item.catatanPengecekan}
                          onChange={(e) => handleCatatanChange(originalIndex, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filteredItems.length === 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter !== "semua" || searchTerm 
                ? "Tidak ada data yang sesuai dengan filter atau pencarian" 
                : "Belum ada data barang untuk cabang ini"
              }
            </p>
          </div>
        )}
        
        {/* Submit button */}
        {!loading && filteredItems.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || checkedItems < totalItems}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white 
                ${submitting || checkedItems < totalItems 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
            >
              {submitting ? (
                <>
                  <span className="inline-block mr-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Menyimpan...
                </>
              ) : checkedItems < totalItems ? (
                `Selesaikan pengecekan ${totalItems - checkedItems} barang lagi`
              ) : (
                "Selesai Pengecekan Stok"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PengecekanStokCabang;