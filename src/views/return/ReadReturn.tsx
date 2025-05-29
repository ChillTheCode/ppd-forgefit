"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ReturnService from "../../services/return"
import { ReturnResponseDTO } from "../../interface/Return"

const ReadReturn = () => {
  const navigate = useNavigate()
  const [returnList, setReturnList] = useState<ReturnResponseDTO[]>([])
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
    const fetchReturnData = async () => {
      try {
        setLoading(true)
        const accessToken = getAccessToken()
        const response = await ReturnService.getAllReturns(accessToken)
        setReturnList(response)
        setTotalPages(Math.ceil(response.length / itemsPerPage))
      } catch (err) {
        console.error("Error fetching return data:", err)
        setError("Gagal memuat data return")
      } finally {
        setLoading(false)
      }
    }

    fetchReturnData()
  }, [])

  // Get current items for pagination
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return returnList.slice(indexOfFirstItem, indexOfLastItem)
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

  // Handler for navigating to detail page
  const handleViewDetail = (id: string) => {
    navigate(`/return/${id}`)
  }

  // Get status color based on perlakuan
  const getPerlakuanColor = (perlakuan: string) => {
    switch (perlakuan) {
      case 'Dibuang':
        return 'text-red-600'
      case 'Dikembalikan':
        return 'text-blue-600'
      case 'Dijual':
        return 'text-green-600'
      case 'Disumbangkan':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Daftar Permintaan Retur Barang</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
            onClick={() => navigate("/return/create")}
          >
            Tambah Return
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
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Kode Barang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Nama Barang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Perlakuan Barang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Stok Return</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentItems().map((returnItem, index) => (
                  <tr
                    key={returnItem.idInputStokBarangReturn}
                    className={`hover:bg-gray-50 cursor-pointer ${index !== getCurrentItems().length - 1 ? "border-b border-gray-100" : ""}`}
                    onClick={() => handleViewDetail(returnItem.idInputStokBarangReturn)}
                  >
                    <td className="py-4 text-sm text-gray-800">{returnItem.kodeBarang || '-'}</td>
                    <td className="py-4 text-sm text-gray-800">{returnItem.namaBarang || '-'}</td>
                    <td className={`py-4 text-sm font-medium ${getPerlakuanColor(returnItem.perlakuan)}`}>
                      {returnItem.perlakuan}
                    </td>
                    <td className="py-4 text-sm text-gray-800">{returnItem.stokInput} Packets</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {returnList.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Tidak ada data return yang tersedia
            </div>
          )}

          {returnList.length > 0 && (
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
          )}
        </>
      )}
    </div>
  )
}

export default ReadReturn