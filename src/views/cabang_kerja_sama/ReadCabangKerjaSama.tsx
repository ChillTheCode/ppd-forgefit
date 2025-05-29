import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CabangKerjaSamaResponse } from "../../interface/CabangKerjaSama.ts"
import { CabangKerjaSamaService } from "../../services/cabang-kerja-sama.ts"

const ReadCabangKerjaSama = () => {
    const navigate = useNavigate()
    const [cksList, setCKSList] = useState<CabangKerjaSamaResponse[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const itemsPerPage = 10
    const [searchQuery, setSearchQuery] = useState<string>("")

    useEffect(() => {
        const fetchCKSData = async () => {
            try {
                setLoading(true)
                
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    console.error("Access token not found");
                    navigate("/unauthorized");
                    return;
                }
                const data = await CabangKerjaSamaService.getAll(accessToken)

                setCKSList(data)
                setTotalPages(Math.ceil(data.length / itemsPerPage))
            } catch (err) {
                console.error("Error fetching cabang kerja sama data: ", err)
                setError("Gagal memuat data cabang kerja sama")
            } finally {
                setLoading(false)
            }
        }

        fetchCKSData()
    }, [])

    const getCurrentItems = () => {
        const indexOfLastItem = currentPage * itemsPerPage
        const indexOfFirstItem = indexOfLastItem - itemsPerPage
        return filteredCKSList().slice(indexOfFirstItem, indexOfLastItem)
    }
    
    const filteredCKSList = () => {
        return cksList.filter(cabangKerjaSama => 
            cabangKerjaSama.namaMitra.toLowerCase().includes(searchQuery.toLowerCase()) ||  // Filter by partner name
            cabangKerjaSama.alamat.toLowerCase().includes(searchQuery.toLowerCase())      // Filter by address
        );
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

    return (
        <div className="p-6 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-medium text-gray-800">Daftar Informasi Cabang Kerja Sama</h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}  // Step 3: Bind input value
                    onChange={(e) => setSearchQuery(e.target.value)}  // Update search query
                    className="border border-gray-300 px-4 py-2 rounded text-sm"
                />
                <div className="flex gap-2">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                        onClick={() => navigate("/cabang-kerja-sama/create")}
                    >
                        Tambah Cabang Kerja Sama
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
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Nama Mitra</th>
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Alamat</th>
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Kontak</th>
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Jumlah Karyawan</th>
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Jam Operasional</th>
                          <th className="py-3 text-left text-sm font-medium text-gray-500">Masa Berlaku Kontrak</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentItems().map((cabangKerjaSama, index) => (
                          <tr
                            key={cabangKerjaSama.nomorCabang}
                            className={`hover:bg-gray-50 cursor-pointer ${index !== getCurrentItems().length - 1 ? "border-b border-gray-100" : ""}`}
                            onClick={() => navigate(`/cabang-kerja-sama/${cabangKerjaSama.nomorCabang}`)}
                          >
                            <td className="py-4 text-sm text-gray-800">{cabangKerjaSama.nomorCabang}</td>
                            <td className="py-4 text-sm text-gray-800">{cabangKerjaSama.namaMitra}</td>
                            <td className="py-4 text-sm text-gray-800">{cabangKerjaSama.alamat}</td>
                            <td className="py-4 text-sm text-gray-800">{cabangKerjaSama.kontak}</td>
                            <td className="py-4 text-sm text-gray-800">{cabangKerjaSama.jumlahKaryawan}</td>
                            <td className="py-4 text-sm text-gray-800">{formatTime(cabangKerjaSama.jamOperasional)}</td>
                            <td className="py-4 text-sm text-gray-800">{formatDate(cabangKerjaSama.masaBerlakuKontrak)}</td>
                            
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

export default ReadCabangKerjaSama;