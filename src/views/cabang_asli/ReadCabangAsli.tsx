"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CabangAsliService, { type CabangAsli } from "../../services/cabang-asli.ts"

const ReadCabangAsli = () => {
  const navigate = useNavigate()
  const [cabangList, setCabangList] = useState<CabangAsli[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const itemsPerPage = 10
  
  // Get the access token from storage or context
  // If you're using a different auth method, modify this accordingly
  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  useEffect(() => {
    const fetchCabangData = async () => {
      try {
        setLoading(true)
        // Pass the access token to the service method
        const accessToken = getAccessToken()
        const data = await CabangAsliService.getAll(accessToken)
        setCabangList(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      } catch (err) {
        console.error("Error fetching cabang data:", err)
        setError("Gagal memuat data cabang")
      } finally {
        setLoading(false)
      }
    }

    fetchCabangData()
  }, [])

  // Get current items for pagination
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return cabangList.slice(indexOfFirstItem, indexOfLastItem)
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

  // Format time from "HH:MM:SS" to "HH:MM"
  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    return timeString.substring(0, 5)
  }

  // Format date to DD/MM/YY
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`
  }

  // Handler for navigating to detail page
  const handleViewDetail = (id: string) => {
    navigate(`/cabang-asli/${id}`)
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Daftar Informasi Cabang</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
            onClick={() => navigate("/cabang-asli/create")}
          >
            Tambah Cabang
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
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Nomor Cabang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Nama Cabang</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Alamat</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Kontak</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Jumlah Karyawan</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Jam Operasional</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">Tanggal Update</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentItems().map((cabang, index) => (
                  <tr
                    key={cabang.nomorCabang}
                    className={`hover:bg-gray-50 cursor-pointer ${index !== getCurrentItems().length - 1 ? "border-b border-gray-100" : ""}`}
                    onClick={() => handleViewDetail(cabang.nomorCabang)}
                  >
                    <td className="py-4 text-sm text-gray-800">{cabang.nomorCabang}</td>
                    <td className="py-4 text-sm text-gray-800">{cabang.namaCabang}</td>
                    <td className="py-4 text-sm text-gray-800">{cabang.alamat}</td>
                    <td className="py-4 text-sm text-gray-800">{cabang.kontak}</td>
                    <td className="py-4 text-sm text-gray-800">{cabang.jumlahKaryawan}</td>
                    <td className="py-4 text-sm text-gray-800">{formatTime(cabang.jamOperasional)}</td>
                    <td className="py-4 text-sm text-gray-800">{formatDate(cabang.updatedAt)}</td>
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

export default ReadCabangAsli








// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import CabangAsliService, { type CabangAsli } from "../../services/cabang-asli"

// const ReadCabangAsli = () => {
//   const navigate = useNavigate()
//   const [cabangList, setCabangList] = useState<CabangAsli[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const [currentPage, setCurrentPage] = useState<number>(1)
//   const [totalPages, setTotalPages] = useState<number>(1)
//   const itemsPerPage = 10

//   useEffect(() => {
//     const fetchCabangData = async () => {
//       try {
//         setLoading(true)
        
//         // Panggil service tanpa token
//         const data = await CabangAsliService.getAll()
//         setCabangList(data)
//         setTotalPages(Math.ceil(data.length / itemsPerPage))
//       } catch (err) {
//         console.error("Error fetching cabang data:", err)
//         setError("Gagal memuat data cabang")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchCabangData()
//   }, [])

//   // Get current items for pagination
//   const getCurrentItems = () => {
//     const indexOfLastItem = currentPage * itemsPerPage
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage
//     return cabangList.slice(indexOfFirstItem, indexOfLastItem)
//   }

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1)
//     }
//   }

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1)
//     }
//   }

//   // Format time from "HH:MM:SS" to "HH:MM"
//   const formatTime = (timeString: string) => {
//     if (!timeString) return ""
//     return timeString.substring(0, 5)
//   }

//   // Format date to DD/MM/YY
//   const formatDate = (dateString: string) => {
//     if (!dateString) return ""
//     const date = new Date(dateString)
//     return `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`
//   }

//   // Handler for navigating to detail page
//   const handleViewDetail = (id: string) => {
//     navigate(`/cabang-asli/${id}`)
//   }

//   return (
//     <div className="p-6 bg-white">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl font-medium text-gray-800">Daftar Informasi Cabang</h1>
//         <div className="flex gap-2">
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
//             onClick={() => navigate("/cabang-asli/create")}
//           >
//             Tambah Cabang
//           </button>
//           <button className="border border-gray-300 px-4 py-2 rounded text-sm flex items-center gap-2 text-gray-600">
//             <span>Filters</span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       ) : error ? (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
//       ) : (
//         <>
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr>
//                   <th className="py-3 text-left text-sm font-medium text-gray-500">Nomor Cabang</th>
//                   <th className="py-3 text-left text-sm font-medium text-gray-500">Nama Cabang</th>
//                   <th className="py-3 text-left text-sm font-medium text-gray-500">Alamat</th>
//                   <th className="py-3 text-left text-sm font-medium text-gray-500">Kontak</th>
//                   <th className="py-3 text-left text-sm font-medium text-gray-500">Jumlah Karyawan</th>
//                   <th className="py-3 text-left text-sm font-medium text-gray-500">Jam Operasional</th>
//                   <th className="py-3 text-left text-sm font-medium text-gray-500">Tanggal Update</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {getCurrentItems().map((cabang, index) => (
//                   <tr
//                     key={cabang.nomorCabang}
//                     className={`hover:bg-gray-50 cursor-pointer ${index !== getCurrentItems().length - 1 ? "border-b border-gray-100" : ""}`}
//                     onClick={() => handleViewDetail(cabang.nomorCabang)}
//                   >
//                     <td className="py-4 text-sm text-gray-800">{cabang.nomorCabang}</td>
//                     <td className="py-4 text-sm text-gray-800">{cabang.namaCabang}</td>
//                     <td className="py-4 text-sm text-gray-800">{cabang.alamat}</td>
//                     <td className="py-4 text-sm text-gray-800">{cabang.kontak}</td>
//                     <td className="py-4 text-sm text-gray-800">{cabang.jumlahKaryawan}</td>
//                     <td className="py-4 text-sm text-gray-800">{formatTime(cabang.jamOperasional)}</td>
//                     <td className="py-4 text-sm text-gray-800">{formatDate(cabang.updatedAt)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-between items-center mt-6 text-sm">
//             <button
//               onClick={handlePrevPage}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"}`}
//             >
//               Previous
//             </button>
//             <div className="text-gray-500">
//               Page {currentPage} of {totalPages}
//             </div>
//             <button
//               onClick={handleNextPage}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"}`}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default ReadCabangAsli