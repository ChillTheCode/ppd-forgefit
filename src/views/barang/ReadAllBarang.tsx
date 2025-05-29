"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BarangService, { type Barang } from "../../services/barang.ts"

const ReadAllBarang = () => {
  const navigate = useNavigate()
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const itemsPerPage = 10

  // Get the access token from storage
  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  useEffect(() => {
    const fetchBarangData = async () => {
      try {
        setLoading(true)
        const accessToken = getAccessToken()
        const data = await BarangService.getAllBarang(accessToken)
        setBarangList(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      } catch (err) {
        console.error("Error fetching barang data:", err)
        setError("Gagal memuat data barang")
      } finally {
        setLoading(false)
      }
    }

    fetchBarangData()
  }, [])

  // Get current items for pagination
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return barangList.slice(indexOfFirstItem, indexOfLastItem)
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

  // Format date to DD/MM/YY
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`
  }

  // Handler for navigating to detail page
  const handleViewDetail = (id: number) => {
    navigate(`/barang/${id}`)
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Daftar Informasi Barang</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
            onClick={() => navigate("/barang/create")}
          >
            Tambah Barang
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded text-sm flex items-center gap-2 text-gray-600">
            <span>Filters</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
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
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Nomor Barang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Nama Barang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Kategori Barang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Harga Barang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Bentuk</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentItems().map((barang, index) => (
                  <tr
                    key={barang.kodeBarang}
                    className={`hover:bg-gray-50 cursor-pointer ${index !== getCurrentItems().length - 1 ? "border-b border-gray-100" : ""}`}
                    onClick={() => handleViewDetail(barang.kodeBarang)}
                  >
                    <td className="py-4 text-sm text-gray-800">{barang.kodeBarang}</td>
                    <td className="py-4 text-sm text-gray-800">{barang.namaBarang}</td>
                    <td className="py-4 text-sm text-gray-800">{barang.kategoriBarang}</td>
                    <td className="py-4 text-sm text-gray-800">Rp {barang.hargaBarang.toLocaleString("id-ID")}</td>
                    <td className="py-4 text-sm text-gray-800 capitalize">{barang.bentuk}</td>
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

export default ReadAllBarang
