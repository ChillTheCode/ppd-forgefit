import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStokMenipis, getKategoriStokMenipis } from "../../services/stokMenipis";
import { StokMenipisResponse } from "../../interface/StokMenipis";
import { 
  getUnderstockedItems, 
  getKategoriOptions, 
  getCabangOptions 
} from "../../services/understockedItemService";
import { UnderstockedItemDTO, CabangDTO } from "../../interface/UnderstockedItem";

const StokRekomendasi: React.FC = () => {
  const navigate = useNavigate();
  
  // State for tabs
  const [activeTab, setActiveTab] = useState<string>("menipis");
  
  // Shared states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;
  
  // State for Stok Menipis tab
  const [stokMenipisList, setStokMenipisList] = useState<StokMenipisResponse[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<string[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  
  // State for Understocked Items tab
  const [understockedItems, setUnderstockedItems] = useState<UnderstockedItemDTO[]>([]);
  const [understockedKategoriOptions, setUnderstockedKategoriOptions] = useState<string[]>([]);
  const [cabangOptions, setCabangOptions] = useState<CabangDTO[]>([]);
  const [selectedUnderstockedKategori, setSelectedUnderstockedKategori] = useState<string>("");
  const [selectedCabang, setSelectedCabang] = useState<string>("");

  // Fetch StokMenipis data
  useEffect(() => {
    if (activeTab === "menipis") {
      const fetchStokData = async () => {
        try {
          setLoading(true);
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            navigate("/login");
            return;
          }
          // Get stock data
          const stokData = await getStokMenipis(accessToken);
          if (Array.isArray(stokData.data)) {
            setStokMenipisList(stokData.data as StokMenipisResponse[]);
            setTotalPages(Math.ceil(stokData.data.length / itemsPerPage));
          } else {
            throw new Error("Invalid response format");
          }
          
          // Get kategori options
          const kategoriData = await getKategoriStokMenipis(accessToken);
          if (Array.isArray(kategoriData.data)) {
            setKategoriOptions(kategoriData.data);
          }
        } catch (err) {
          console.error("Error fetching stok menipis data:", err);
          setError("Gagal memuat data. Silakan coba lagi nanti.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchStokData();
    }
  }, [activeTab, selectedKategori]);
  
  // Fetch UnderstockedItems data
  useEffect(() => {
    if (activeTab === "understocked") {
      const fetchUnderstockedData = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("accessToken");
          
          if (!token) {
            navigate("/login");
            return;
          }
          
          // Fetch filter options and items
          const [kategoriResponse, cabangResponse, itemsResponse] = await Promise.all([
            getKategoriOptions(token),
            getCabangOptions(token),
            getUnderstockedItems(token, selectedUnderstockedKategori, selectedCabang)
          ]);
          
          if (kategoriResponse.status === 200 && Array.isArray(kategoriResponse.data)) {
            setUnderstockedKategoriOptions(kategoriResponse.data);
          }
          
          if (cabangResponse.status === 200 && Array.isArray(cabangResponse.data)) {
            setCabangOptions(cabangResponse.data);
          }
          
          if (itemsResponse.status === 200 && Array.isArray(itemsResponse.data)) {
            setUnderstockedItems(itemsResponse.data);
            setTotalPages(Math.ceil(itemsResponse.data.length / itemsPerPage));
          } else {
            setError(itemsResponse.message || "Failed to fetch data");
          }
        } catch (err) {
          console.error("Error fetching understocked data:", err);
          setError("Gagal memuat data. Silakan coba lagi nanti.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchUnderstockedData();
    }
  }, [activeTab, selectedUnderstockedKategori, selectedCabang, navigate]);
  
  // Filter handlers
  const handleKategoriChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKategori(e.target.value);
    setCurrentPage(1);
  };
  
  const handleUnderstockedKategoriChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnderstockedKategori(e.target.value);
    setCurrentPage(1);
  };
  
  const handleCabangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCabang(e.target.value);
    setCurrentPage(1);
  };
  
  // Shared handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const clearFilters = () => {
    if (activeTab === "menipis") {
      setSelectedKategori("");
    } else {
      setSelectedUnderstockedKategori("");
      setSelectedCabang("");
    }
    setCurrentPage(1);
  };
  
  const handleViewDetail = (kodeBarang: string) => {
    navigate(`/barang/${kodeBarang}`);
  };
  
  // Get current items for pagination
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    if (activeTab === "menipis") {
      const filtered = selectedKategori 
        ? stokMenipisList.filter(item => item.kategoriBarang === selectedKategori)
        : stokMenipisList;
      return filtered.slice(startIndex, endIndex);
    } else {
      const filtered = understockedItems;
      return filtered.slice(startIndex, endIndex);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Rekomendasi Stok</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 ${activeTab === "menipis" ? "border-b-2 border-blue-500 font-medium" : ""}`}
          onClick={() => setActiveTab("menipis")}
        >
          Stok Menipis
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "understocked" ? "border-b-2 border-blue-500 font-medium" : ""}`}
          onClick={() => setActiveTab("understocked")}
        >
          Understocked Items
        </button>
      </div>
      
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {activeTab === "menipis" ? (
            <div className="flex items-center">
              <label htmlFor="kategori" className="mr-2">Kategori:</label>
              <select
                id="kategori"
                value={selectedKategori}
                onChange={handleKategoriChange}
                className="border rounded p-2"
              >
                <option value="">Semua Kategori</option>
                {kategoriOptions.map((kategori, index) => (
                  <option key={index} value={kategori}>{kategori}</option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <label htmlFor="understockedKategori" className="mr-2">Kategori:</label>
                <select
                  id="understockedKategori"
                  value={selectedUnderstockedKategori}
                  onChange={handleUnderstockedKategoriChange}
                  className="border rounded p-2"
                >
                  <option value="">Semua Kategori</option>
                  {understockedKategoriOptions.map((kategori, index) => (
                    <option key={index} value={kategori}>{kategori}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label htmlFor="cabang" className="mr-2">Cabang:</label>
                <select
                  id="cabang"
                  value={selectedCabang}
                  onChange={handleCabangChange}
                  className="border rounded p-2"
                >
                  <option value="">Semua Cabang</option>
                  {cabangOptions.map((cabang, index) => (
                    <option key={index} value={cabang.nomorCabang}>{cabang.namaCabang}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <button
            onClick={clearFilters}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="text-center py-8">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {activeTab === "menipis" ? (
                    <>
                      <th className="py-2 px-4 border">Kode Barang</th>
                      <th className="py-2 px-4 border">Nama Barang</th>
                      <th className="py-2 px-4 border">Kategori</th>
                      <th className="py-2 px-4 border">Stok Tersedia</th>
                      <th className="py-2 px-4 border">Stok Minimum</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Aksi</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2 px-4 border">Kode Barang</th>
                      <th className="py-2 px-4 border">Nama Barang</th>
                      <th className="py-2 px-4 border">Kategori</th>
                      <th className="py-2 px-4 border">Stok Diminta</th>
                      <th className="py-2 px-4 border">Stok Pusat</th>
                      <th className="py-2 px-4 border">Cabang</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Aksi</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {getCurrentItems().length > 0 ? (
                  getCurrentItems().map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {activeTab === "menipis" ? (
                        // Stok Menipis row
                        <>
                          <td className="py-2 px-4 border">{(item as StokMenipisResponse).kodeBarang}</td>
                          <td className="py-2 px-4 border">{(item as StokMenipisResponse).namaBarang}</td>
                          <td className="py-2 px-4 border">{(item as StokMenipisResponse).kategoriBarang}</td>
                          <td className="py-2 px-4 border">{(item as StokMenipisResponse).stokBarang}</td>
                          <td className="py-2 px-4 border">{(item as StokMenipisResponse).stokMinimum}</td>
                          <td className="py-2 px-4 border">
                            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                              Stok Menipis
                            </span>
                          </td>
                          <td className="py-2 px-4 border">
                            <button
                              onClick={() => handleViewDetail((item as StokMenipisResponse).kodeBarang)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Detail
                            </button>
                          </td>
                        </>
                      ) : (
                        // Understocked Items row
                        <>
                          <td className="py-2 px-4 border">{(item as UnderstockedItemDTO).kodeBarang}</td>
                          <td className="py-2 px-4 border">{(item as UnderstockedItemDTO).namaBarang}</td>
                          <td className="py-2 px-4 border">{(item as UnderstockedItemDTO).kategoriBarang}</td>
                          <td className="py-2 px-4 border">{(item as UnderstockedItemDTO).stokDiminta}</td>
                          <td className="py-2 px-4 border">{(item as UnderstockedItemDTO).stokPusat}</td>
                          <td className="py-2 px-4 border">{(item as UnderstockedItemDTO).namaCabang}</td>
                          <td className="py-2 px-4 border">
                            <span className={`px-2 py-1 rounded ${
                              (item as UnderstockedItemDTO).status === 'CRITICAL' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {(item as UnderstockedItemDTO).status}
                            </span>
                          </td>
                          <td className="py-2 px-4 border">
                            <button
                              onClick={() => handleViewDetail((item as UnderstockedItemDTO).kodeBarang)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Detail
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={activeTab === "menipis" ? 7 : 8} className="py-4 text-center border">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div>
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StokRekomendasi;

