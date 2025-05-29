import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getUnderstockedItems, 
  getKategoriOptions, 
  getCabangOptions,
  UnderstockedItemDTO,
  CabangDTO,
  hasUnderstockedItemsAccess
} from "../../services/understockedItemService";
import { getToken, isTokenValid, getRoleFromToken } from "../../views/authentication/authUtils";

const UnderstockedItems: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<UnderstockedItemDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  
  // Filter states
  const [kategoriOptions, setKategoriOptions] = useState<string[]>([]);
  const [cabangOptions, setCabangOptions] = useState<CabangDTO[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [selectedCabang, setSelectedCabang] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Check if user has permission to access this page
  useEffect(() => {
    const token = getToken();
    if (!token || !isTokenValid()) {
      navigate("/login");
      return;
    }

    const userRole = getRoleFromToken();
    const allowedRoles = ["Direktur Utama", "Kepala Departemen SDM dan Umum"];
    
    if (!allowedRoles.includes(userRole)) {
      navigate("/unauthorized");
      return;
    }
  }, [navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch filter options
        const [kategoriResponse, cabangResponse, itemsResponse] = await Promise.all([
          getKategoriOptions(token),
          getCabangOptions(token),
          getUnderstockedItems(token, selectedKategori, selectedCabang)
        ]);

        // Check for authorization errors
        if (kategoriResponse.status === 403 || cabangResponse.status === 403 || itemsResponse.status === 403) {
          navigate("/unauthorized");
          return;
        }

        if (kategoriResponse.status === 200 && Array.isArray(kategoriResponse.data)) {
          setKategoriOptions(kategoriResponse.data);
        }

        if (cabangResponse.status === 200 && Array.isArray(cabangResponse.data)) {
          setCabangOptions(cabangResponse.data);
        }

        if (itemsResponse.status === 200 && Array.isArray(itemsResponse.data)) {
          setItems(itemsResponse.data);
        } else {
          setError(itemsResponse.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedKategori, selectedCabang, navigate]);

  // Handle filter changes
  const handleKategoriChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKategori(e.target.value);
    setCurrentPage(1);
  };

  const handleCabangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCabang(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedKategori("");
    setSelectedCabang("");
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Export to Excel/CSV
  const exportReport = () => {
    // Implementation for exporting data
    // This would typically use a library like xlsx or create a CSV string
    alert("Export functionality would be implemented here");
  };

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "valid":
        return "text-green-500";
      case "understocked":
        return "text-red-500";
      case "overstocked":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">
          Barang dengan Stok Kurang Berdasarkan Request Cabang
        </h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gray-100 rounded-md text-gray-600 flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="mr-2">Filters</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={exportReport}
          >
            Ekspor Laporan
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={selectedKategori}
                onChange={handleKategoriChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Kategori</option>
                {kategoriOptions.map((kategori, index) => (
                  <option key={index} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cabang
              </label>
              <select
                value={selectedCabang}
                onChange={handleCabangChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Cabang</option>
                {cabangOptions.map((cabang, index) => (
                  <option key={index} value={cabang.nomorCabang}>
                    {cabang.namaCabang} ({cabang.type})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Tidak ada data yang ditemukan
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok Diminta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok Terkini
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Cabang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Permintaan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.namaBarang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.stokDiminta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.stokPusat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.namaCabang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`capitalize ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UnderstockedItems;
