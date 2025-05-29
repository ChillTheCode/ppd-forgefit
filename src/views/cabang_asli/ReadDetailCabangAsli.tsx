"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import CabangAsliService, { type CabangAsli } from "../../services/cabang-asli"
import AuthService from "../../services/authentication" // Import service authentication

// Interface untuk pengguna
interface Pengguna {
  id: string
  username?: string
  namaLengkap?: string
  role?: string
  idKaryawan?: string
}

const ReadDetailCabangAsli = () => {
  const { id } = useParams() // Mengambil ID dari URL parameter
  const navigate = useNavigate() // Hook untuk navigasi

  const [cabang, setCabang] = useState<CabangAsli | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "adjustments">("overview")
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false) // Modal edit

  // State untuk menyimpan daftar kepala operasional
  const [kepalaOperasionalList, setKepalaOperasionalList] = useState<Pengguna[]>([])
  const [loadingKepalaOperasional, setLoadingKepalaOperasional] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [apiDebugInfo, setApiDebugInfo] = useState<string | null>(null)

  // Get the access token from storage
  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  // Fungsi untuk mendapatkan role pengguna saat ini
  const getUserRole = async () => {
    try {
      const accessToken = getAccessToken()
      if (!accessToken) return null

      console.log("Mengambil role pengguna...")
      const role = await AuthService.getRoleService(accessToken)

      if (role !== "Failed") {
        console.log("Role pengguna:", role)
        return role
      }

      return null
    } catch (error) {
      console.error("Error getting user role:", error)
      return null
    }
  }

  // Fungsi untuk mengambil daftar pengguna (hanya untuk Admin)
  const fetchUsers = async () => {
    try {
      setLoadingKepalaOperasional(true)
      setApiDebugInfo(null)

      const accessToken = getAccessToken()
      if (!accessToken) {
        console.error("Token tidak ditemukan")
        setApiDebugInfo("Token tidak ditemukan")
        return
      }

      // Cek role pengguna saat ini
      const role = await getUserRole()
      setUserRole(role)
      console.log("Role pengguna saat ini:", role)

      // Ambil semua pengguna menggunakan service yang sudah ada
      console.log("Mengambil data semua pengguna...")
      const response = await AuthService.getAllPengguna(accessToken)

      console.log("Response dari getAllPengguna:", response)

      if (response.status === 200 && response.data) {
        const userData = response.data
        console.log("Data pengguna:", userData)

        if (Array.isArray(userData)) {
          console.log("Jumlah pengguna yang ditemukan:", userData.length)

          // Filter pengguna dengan role "Kepala Operasional Cabang"
          const filteredUsers = userData.filter((user: Pengguna) => {
            const userRole = user.role?.toLowerCase() || ""
            return (
              userRole.includes("kepala operasional cabang") ||
              userRole.includes("kepala_operasional_cabang") ||
              userRole === "koc" ||
              userRole === "kepala_operasional"
            )
          })

          console.log("Jumlah Kepala Operasional yang ditemukan:", filteredUsers.length)
          console.log("Data Kepala Operasional:", filteredUsers)

          if (filteredUsers.length > 0) {
            setKepalaOperasionalList(filteredUsers)
          } else {
            console.log("Tidak ada pengguna dengan role Kepala Operasional Cabang")
            setApiDebugInfo("Tidak ada pengguna dengan role Kepala Operasional Cabang")
          }
        } else {
          console.error("Format data tidak sesuai:", userData)
          setApiDebugInfo(`Format data tidak sesuai: ${JSON.stringify(userData).substring(0, 100)}...`)
        }
      } else {
        console.error("Failed to fetch users:", response.status, response.message)
        setApiDebugInfo(`Error: ${response.status}, ${response.message}`)
      }
    } catch (error) {
      console.error("Error saat mengambil data pengguna:", error)
      setApiDebugInfo(`Exception: ${error}`)
    } finally {
      setLoadingKepalaOperasional(false)
    }
  }

  // Fungsi untuk mendapatkan nama tampilan
  const getDisplayName = (user: Pengguna) => {
    return user.namaLengkap || user.username || "Nama tidak tersedia"
  }

  // Fungsi untuk mendapatkan ID yang ditampilkan
  const getDisplayId = (user: Pengguna) => {
    return user.idKaryawan || user.id || "ID tidak tersedia"
  }

  useEffect(() => {
    const fetchCabangDetail = async () => {
      try {
        console.log("Mencoba mengambil data untuk ID:", id)

        if (!id) {
          setError("ID Cabang tidak ditemukan")
          setLoading(false)
          return
        }

        setLoading(true)

        // Get access token
        const accessToken = getAccessToken()

        if (!accessToken) {
          setError("Anda belum login atau sesi telah berakhir")
          setLoading(false)
          return
        }

        try {
          // Coba ambil dari API dengan token
          console.log("Mengambil data dari API...")
          const data = await CabangAsliService.getById(accessToken, id)
          console.log("Data dari API:", data)
          setCabang(data)

          // Ambil daftar kepala operasional
          await fetchUsers()
        } catch (apiError) {
          console.error("Error fetching from API:", apiError)
          // Fallback to mock data if API fails
          console.log("Mencoba menggunakan mock data...")
          // Note: getMockDataById should be modified to not require token if it's just for testing
          const mockData = await CabangAsliService.getById(accessToken, id)
          if (mockData) {
            console.log("Data mock ditemukan:", mockData)
            setCabang(mockData)
          } else {
            throw new Error("Data tidak ditemukan")
          }
        }
      } catch (err) {
        console.error("Error fetching cabang detail:", err)
        setError("Gagal memuat detail cabang")
      } finally {
        setLoading(false)
      }
    }

    fetchCabangDetail()
  }, [id])

  // Format time from "HH:MM:SS" to "HH:MM"
  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    return timeString.substring(0, 5)
  }

  // Format date to DD/MM/YY HH:MM
  const formatDateTime = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = String(date.getFullYear()).slice(-2)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  const handleDelete = async () => {
    if (!cabang) return

    try {
      const accessToken = getAccessToken()

      if (!accessToken) {
        alert("Anda belum login atau sesi telah berakhir")
        navigate("/login")
        return
      }

      await CabangAsliService.delete(accessToken, cabang.nomorCabang)
      navigate("/cabang-asli") // Redirect ke halaman daftar cabang
    } catch (err) {
      console.error("Error deleting cabang:", err)
      alert("Gagal menghapus cabang")
    } finally {
      setShowDeleteModal(false)
    }
  }

  // Modal konfirmasi hapus
  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Apakah Anda ingin menghapus informasi cabang ini?
            </h3>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
            >
              Batalkan
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Modal edit cabang
  const EditCabangModal = () => {
    if (!showEditModal || !cabang || !id) return null

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)

      try {
        const accessToken = getAccessToken()

        if (!accessToken) {
          alert("Anda belum login atau sesi telah berakhir")
          navigate("/login")
          return
        }

        // Prepare update data
        const updateData = {
          namaCabang: formData.get("namaCabang") as string,
          alamat: formData.get("alamat") as string,
          kontak: formData.get("kontak") as string,
          jumlahKaryawan: Number(formData.get("jumlahKaryawan")),
          jamOperasional: `${formData.get("jamOperasional")}:00`, // Add seconds
          idKepalaOperasional: formData.get("idKepalaOperasional") as string,
        }

        // Call update API
        await CabangAsliService.update(accessToken, id, updateData)

        // Close modal
        setShowEditModal(false)

        // Refresh data
        const updatedData = await CabangAsliService.getById(accessToken, id)
        setCabang(updatedData)
      } catch (error) {
        console.error("Error updating cabang:", error)
        alert("Gagal memperbarui data cabang")
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-medium text-gray-800 mb-6">Edit Cabang</h2>

          {apiDebugInfo && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800 font-mono overflow-auto max-h-20">Debug: {apiDebugInfo}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Cabang</label>
                <input
                  type="text"
                  name="nomorCabang"
                  value={cabang.nomorCabang}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                  placeholder="Masukkan nomor cabang"
                  required
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Cabang</label>
                <input
                  type="text"
                  name="namaCabang"
                  defaultValue={cabang.namaCabang}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Masukkan nama cabang"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  defaultValue={cabang.alamat}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Masukkan alamat cabang"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kontak</label>
                <input
                  type="text"
                  name="kontak"
                  defaultValue={cabang.kontak}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Masukkan kontak cabang"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Karyawan</label>
                <input
                  type="number"
                  name="jumlahKaryawan"
                  defaultValue={cabang.jumlahKaryawan}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Masukkan jumlah karyawan"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
                <input
                  type="time"
                  name="jamOperasional"
                  defaultValue={formatTime(cabang.jamOperasional)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kepala Operasional Cabang
                  {loadingKepalaOperasional && <span className="ml-2 text-xs text-blue-500">(Memuat...)</span>}
                </label>

                <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs text-blue-700">Role Anda: {userRole || "Belum terdeteksi"}</p>
                  <p className="text-xs text-blue-700 mt-1">Jumlah Kepala Operasional: {kepalaOperasionalList.length}</p>
                </div>

                {!showManualInput ? (
                  <>
                    <div className="relative">
                      <select
                        name="idKepalaOperasional"
                        defaultValue={cabang.idKepalaOperasional}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        required={!showManualInput}
                        disabled={showManualInput}
                      >
                        <option value="">Pilih Kepala Operasional Cabang</option>
                        {kepalaOperasionalList.map((user) => (
                          <option key={user.id} value={getDisplayId(user)}>
                            {getDisplayName(user)} - ID: {getDisplayId(user)}
                          </option>
                        ))}
                      </select>

                      {loadingKepalaOperasional && (
                        <div className="absolute right-2 top-2">
                          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={fetchUsers}
                        className="text-xs text-blue-600 hover:text-blue-800"
                        disabled={loadingKepalaOperasional}
                      >
                        {loadingKepalaOperasional ? "Sedang memuat..." : "Muat ulang data"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowManualInput(true)}
                        className="text-xs text-gray-600 hover:text-gray-800"
                      >
                        Input ID manual
                      </button>
                    </div>

                    {kepalaOperasionalList.length === 0 && !loadingKepalaOperasional && (
                      <p className="text-xs text-amber-600 mt-1">
                        Tidak ada data kepala operasional cabang yang tersedia
                      </p>
                    )}
                  </>
                ) : (
                  <div>
                    <div className="flex">
                      <input
                        type="text"
                        name="idKepalaOperasional"
                        defaultValue={cabang.idKepalaOperasional}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Masukkan ID kepala operasional"
                        required={showManualInput}
                      />
                    </div>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setShowManualInput(false)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Gunakan dropdown
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
              >
                Batalkan
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !cabang) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Data cabang tidak ditemukan"}
        </div>
        <button className="mt-4 text-blue-600 hover:underline" onClick={() => navigate("/cabang-asli")}>
          Kembali ke daftar cabang
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white">
      <DeleteConfirmationModal />
      <EditCabangModal />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">{cabang.namaCabang}</h1>
        {activeTab === "adjustments" && (
          <div className="flex gap-2">
            <button
              className="border border-gray-300 px-4 py-2 rounded text-sm flex items-center gap-2 text-gray-600"
              onClick={() => setShowEditModal(true)} // Tampilkan modal edit
            >
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </button>
            <button
              className="border border-gray-300 px-4 py-2 rounded text-sm flex items-center gap-2 text-gray-600"
              onClick={() => setShowDeleteModal(true)}
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "adjustments"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("adjustments")}
          >
            Adjustments
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-4">Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Nomor Cabang</div>
            <div className="text-sm">{cabang.nomorCabang}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Nama Cabang</div>
            <div className="text-sm">{cabang.namaCabang}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Alamat</div>
            <div className="text-sm">{cabang.alamat}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Kontak</div>
            <div className="text-sm">{cabang.kontak}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Jumlah Karyawan</div>
            <div className="text-sm">{cabang.jumlahKaryawan}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Jam Operasional</div>
            <div className="text-sm">{formatTime(cabang.jamOperasional)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">ID Kepala Operasional</div>
            <div className="text-sm">{cabang.idKepalaOperasional}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Tanggal Dibuat</div>
            <div className="text-sm">{formatDateTime(cabang.createdAt)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Tanggal Diperbarui</div>
            <div className="text-sm">{formatDateTime(cabang.updatedAt)}</div>
          </div>
        </div>
      </div>

      <button
        className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm"
        onClick={() => navigate("/cabang-asli")}
      >
        Kembali ke daftar cabang
      </button>
    </div>
  )
}

export default ReadDetailCabangAsli


















// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import CabangAsliService, { type CabangAsli } from "../../services/cabang-asli"

// const ReadDetailCabangAsli = () => {
//   const { id } = useParams() // Mengambil ID dari URL parameter
//   const navigate = useNavigate() // Hook untuk navigasi

//   const [cabang, setCabang] = useState<CabangAsli | null>(null)
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const [activeTab, setActiveTab] = useState<"overview" | "adjustments">("overview")
//   const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
//   const [showEditModal, setShowEditModal] = useState<boolean>(false) // Modal edit

//   useEffect(() => {
//     const fetchCabangDetail = async () => {
//       try {
//         console.log("Mencoba mengambil data untuk ID:", id)

//         if (!id) {
//           setError("ID Cabang tidak ditemukan")
//           setLoading(false)
//           return
//         }

//         setLoading(true)

//         try {
//           // Coba ambil dari API
//           console.log("Mengambil data dari API...")
//           const data = await CabangAsliService.getById(id)
//           console.log("Data dari API:", data)
//           setCabang(data)
//         } catch (apiError) {
//           console.error("Error fetching from API:", apiError)
//           throw new Error("Data tidak ditemukan")
//         }
//       } catch (err) {
//         console.error("Error fetching cabang detail:", err)
//         setError("Gagal memuat detail cabang")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchCabangDetail()
//   }, [id])

//   // Format time from "HH:MM:SS" to "HH:MM"
//   const formatTime = (timeString: string) => {
//     if (!timeString) return ""
//     return timeString.substring(0, 5)
//   }

//   // Format date to DD/MM/YY HH:MM
//   const formatDateTime = (dateString: string) => {
//     if (!dateString) return ""
//     const date = new Date(dateString)
//     const day = date.getDate().toString().padStart(2, "0")
//     const month = (date.getMonth() + 1).toString().padStart(2, "0")
//     const year = String(date.getFullYear()).slice(-2)
//     const hours = date.getHours().toString().padStart(2, "0")
//     const minutes = date.getMinutes().toString().padStart(2, "0")

//     return `${day}/${month}/${year} ${hours}:${minutes}`
//   }

//   const handleDelete = async () => {
//     if (!cabang) return

//     try {
//       await CabangAsliService.delete(cabang.nomorCabang)
//       navigate("/cabang-asli") // Redirect ke halaman daftar cabang
//     } catch (err) {
//       console.error("Error deleting cabang:", err)
//       alert("Gagal menghapus cabang")
//     } finally {
//       setShowDeleteModal(false)
//     }
//   }

//   // Modal konfirmasi hapus
//   const DeleteConfirmationModal = () => {
//     if (!showDeleteModal) return null

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//         <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
//           <div className="text-center mb-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               Apakah Anda ingin menghapus informasi cabang ini?
//             </h3>
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setShowDeleteModal(false)}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
//             >
//               Batalkan
//             </button>
//             <button
//               onClick={handleDelete}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
//             >
//               Hapus
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Modal edit cabang
//   const EditCabangModal = () => {
//     if (!showEditModal || !cabang || !id) return null

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault()
//       const formData = new FormData(e.currentTarget)

//       try {
//         // Prepare update data
//         const updateData = {
//           namaCabang: formData.get("namaCabang") as string,
//           alamat: formData.get("alamat") as string,
//           kontak: formData.get("kontak") as string,
//           jumlahKaryawan: Number(formData.get("jumlahKaryawan")),
//           jamOperasional: `${formData.get("jamOperasional")}:00`, // Add seconds
//           idKepalaOperasional: formData.get("idKepalaOperasional") as string,
//         }

//         // Call update API
//         await CabangAsliService.update(id, updateData)

//         // Close modal
//         setShowEditModal(false)

//         // Refresh data
//         const updatedData = await CabangAsliService.getById(id)
//         setCabang(updatedData)
//       } catch (error) {
//         console.error("Error updating cabang:", error)
//         alert("Gagal memperbarui data cabang")
//       }
//     }

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//         <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
//           <h2 className="text-xl font-medium text-gray-800 mb-6">Edit Cabang</h2>

//           <form onSubmit={handleSubmit}>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Cabang</label>
//                 <input
//                   type="text"
//                   name="nomorCabang"
//                   value={cabang.nomorCabang}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
//                   placeholder="Masukkan nomor cabang"
//                   required
//                   disabled
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Nama Cabang</label>
//                 <input
//                   type="text"
//                   name="namaCabang"
//                   defaultValue={cabang.namaCabang}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                   placeholder="Masukkan nama cabang"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
//                 <input
//                   type="text"
//                   name="alamat"
//                   defaultValue={cabang.alamat}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                   placeholder="Masukkan alamat cabang"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Kontak</label>
//                 <input
//                   type="text"
//                   name="kontak"
//                   defaultValue={cabang.kontak}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                   placeholder="Masukkan kontak cabang"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Karyawan</label>
//                 <input
//                   type="number"
//                   name="jumlahKaryawan"
//                   defaultValue={cabang.jumlahKaryawan}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                   placeholder="Masukkan jumlah karyawan"
//                   min="0"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
//                 <input
//                   type="time"
//                   name="jamOperasional"
//                   defaultValue={formatTime(cabang.jamOperasional)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ID Kepala Operasional</label>
//                 <input
//                   type="text"
//                   name="idKepalaOperasional"
//                   defaultValue={cabang.idKepalaOperasional}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                   placeholder="Masukkan ID kepala operasional"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 mt-6">
//               <button
//                 type="button"
//                 onClick={() => setShowEditModal(false)}
//                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
//               >
//                 Batalkan
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
//               >
//                 Simpan
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (error || !cabang) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error || "Data cabang tidak ditemukan"}
//         </div>
//         <button className="mt-4 text-blue-600 hover:underline" onClick={() => navigate("/cabang-asli")}>
//           Kembali ke daftar cabang
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="p-6 bg-white">
//       <DeleteConfirmationModal />
//       <EditCabangModal />

//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-xl font-medium text-gray-800">{cabang.namaCabang}</h1>
//         {activeTab === "adjustments" && (
//           <div className="flex gap-2">
//             <button
//               className="border border-gray-300 px-4 py-2 rounded text-sm flex items-center gap-2 text-gray-600"
//               onClick={() => setShowEditModal(true)} // Tampilkan modal edit
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
//                 <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
//               </svg>
//               Edit
//             </button>
//             <button
//               className="border border-gray-300 px-4 py-2 rounded text-sm flex items-center gap-2 text-gray-600"
//               onClick={() => setShowDeleteModal(true)}
//             >
//               Hapus
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="border-b border-gray-200 mb-6">
//         <div className="flex">
//           <button
//             className={`py-2 px-4 text-sm font-medium ${
//               activeTab === "overview"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//             onClick={() => setActiveTab("overview")}
//           >
//             Overview
//           </button>
//           <button
//             className={`py-2 px-4 text-sm font-medium ${
//               activeTab === "adjustments"
//                 ? "border-b-2 border-blue-500 text-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//             onClick={() => setActiveTab("adjustments")}
//           >
//             Adjustments
//           </button>
//         </div>
//       </div>

//       <div>
//         <h2 className="text-lg font-medium text-gray-800 mb-4">Details</h2>
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-sm text-gray-500">Nomor Cabang</div>
//             <div className="text-sm">{cabang.nomorCabang}</div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-sm text-gray-500">Nama Cabang</div>
//             <div className="text-sm">{cabang.namaCabang}</div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-sm text-gray-500">Alamat</div>
//             <div className="text-sm">{cabang.alamat}</div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-sm text-gray-500">Kontak</div>
//             <div className="text-sm">{cabang.kontak}</div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-sm text-gray-500">Jumlah Karyawan</div>
//             <div className="text-sm">{cabang.jumlahKaryawan}</div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-sm text-gray-500">Jam Operasional</div>
//             <div className="text-sm">{formatTime(cabang.jamOperasional)}</div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-sm text-gray-500">ID Kepala Operasional</div>
//             <div className="text-sm">{cabang.idKepalaOperasional}</div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-sm text-gray-500">Tanggal Dibuat</div>
//             <div className="text-sm">{formatDateTime(cabang.createdAt)}</div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-sm text-gray-500">Tanggal Diperbarui</div>
//             <div className="text-sm">{formatDateTime(cabang.updatedAt)}</div>
//           </div>
//         </div>
//       </div>

//       <button
//         className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm"
//         onClick={() => navigate("/cabang-asli")}
//       >
//         Kembali ke daftar cabang
//       </button>
//     </div>
//   )
// }

// export default ReadDetailCabangAsli