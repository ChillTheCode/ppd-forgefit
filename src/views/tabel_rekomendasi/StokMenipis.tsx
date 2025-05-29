"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getStokMenipis, getKategoriStokMenipis } from "../../services/stokMenipis"
import { StokMenipisResponse } from "../../interface/StokMenipis"

const StokMenipis = () => {
  const navigate = useNavigate()
  const [stokList, setStokList] = useState<StokMenipisResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [kategoriOptions, setKategoriOptions] = useState<string[]>([])
  const [selectedKategori, setSelectedKategori] = useState<string>("")
  const itemsPerPage = 10

  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  useEffect(() => {
    const fetchStokData = async () => {
      try {
        setLoading(true)
        const accessToken = getAccessToken()
        
        // Get stock data
        const stokData = await getStokMenipis(accessToken)
        if (Array.isArray(stokData.data)) {
          setStokList(stokData.data as StokMenipisResponse[])
          setTotalPages(Math.ceil(stokData.data.length / itemsPerPage))
        } else {
          throw new Error("Invalid response format")
        }
        
        // Get category options
        const kategoriData = await getKategoriStokMenipis(accessToken)
        if (Array.isArray(kategoriData.data)) {
          setKategoriOptions(kategoriData.data as string[])
        } else {
          throw new Error("Invalid kategori response format")
        }
        
      } catch (err) {
        console.error("Error fetching stok menipis data:", err)
        setError("Gagal memuat data stok menipis")
      } finally {
        setLoading(false)
      }
    }

    fetchStokData()
  }, [])

  // Get current items for pagination
  const getCurrentItems = () => {
    let filteredItems = stokList
    
    // Apply category filter if selected
    if (selectedKategori) {
      filteredItems = stokList.filter(item => 
        item.kategoriBarang === selectedKategori
      )
    }
    
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleKategoriChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKategori(e.target.value)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const clearFilters = () => {
    setSelectedKategori("")
    setCurrentPage(1)
  }

  const handleViewDetail = (kodeBarang: string) => {
    navigate(`/barang/${kodeBarang}`)
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    return status === 'KRITIS' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Daftar Barang dengan Stok Menipis</h1>
        <div className="flex gap-2">
          <label htmlFor="kategoriSelect" className="sr-only">Pilih Kategori</label>
          <select
            id="kategoriSelect"
            value={selectedKategori}
            onChange={handleKategoriChange}
            className="border border-gray-300 px-4 py-2 rounded text-sm text-gray-600"
          >
            <option value="">Semua Kategori</option>
            {kategoriOptions.map((kategori, index) => (
              <option key={index} value={kategori}>
                {kategori}
              </option>
            ))}
          </select>
          <button 
            onClick={clearFilters}
            className="border border-gray-300 px-4 py-2 rounded text-sm text-gray-600"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Kode Barang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Nama Barang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Kategori</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Stok Tersedia</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentItems().map((item, index) => (
                  <tr
                    key={item.kodeBarang}
                    className={`hover:bg-gray-50 cursor-pointer ${index !== getCurrentItems().length - 1 ? "border-b border-gray-100" : ""}`}
                    onClick={() => handleViewDetail(item.kodeBarang)}
                  >
                    <td className="py-4 text-sm text-gray-800">{item.kodeBarang}</td>
                    <td className="py-4 text-sm text-gray-800">{item.namaBarang}</td>
                    <td className="py-4 text-sm text-gray-800">{item.kategoriBarang}</td>
                    <td className="py-4 text-sm text-gray-800">{item.stokTerkini}</td>
                    <td className="py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 text-sm">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"}`}
            >
              Previous
            </button>
            <div className="text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"}`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default StokMenipis