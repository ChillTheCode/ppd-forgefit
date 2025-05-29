"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" // Tetap menggunakan React Router
import CabangAsliService, { type CreateCabangAsliDTO } from "../../services/cabang-asli"
import AuthService from "../../services/authentication" // Import service authentication

// Interface untuk pengguna
interface Pengguna {
  id: string
  username?: string
  namaLengkap?: string
  role?: string
  idKaryawan?: string
}

const CreateCabangAsli = () => {
  const navigate = useNavigate() // Tetap menggunakan useNavigate
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // Menambahkan state untuk error
  const [formData, setFormData] = useState<CreateCabangAsliDTO>({
    nomorCabang: "",
    namaCabang: "",
    alamat: "",
    kontak: "",
    jumlahKaryawan: 0,
    jamOperasional: "08:00",
    idKepalaOperasional: "",
  })

  // State untuk menyimpan daftar kepala operasional
  const [kepalaOperasionalList, setKepalaOperasionalList] = useState<Pengguna[]>([])
  const [loadingKepalaOperasional, setLoadingKepalaOperasional] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [apiDebugInfo, setApiDebugInfo] = useState<string | null>(null)

  // Mendapatkan access token dari storage
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

  // Fungsi untuk menggunakan data dummy
  const dummyData = [
    { id: "KO001", namaLengkap: "Ahmad Operator", role: "Kepala Operasional Cabang" },
    { id: "KO002", namaLengkap: "Budi Operator", role: "Kepala Operasional Cabang" },
    { id: "KO003", namaLengkap: "Cindy Operator", role: "Kepala Operasional Cabang" },
  ]

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "jumlahKaryawan" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)

      const accessToken = getAccessToken()
      if (!accessToken) {
        alert("Anda belum login atau sesi telah berakhir")
        navigate("/login")
        return
      }

      // Format jam operasional untuk sesuai dengan format yang diharapkan
      const formattedData = {
        ...formData,
        jamOperasional: formData.jamOperasional + ":00",
      }

      // Panggil API
      await CabangAsliService.create(accessToken, formattedData)

      // Jika tidak ada error (tidak masuk ke catch), maka operasi berhasil
      // Tidak perlu alert di sini karena server sudah menampilkan notifikasi sukses
      navigate("/cabang-asli")
    } catch (error: any) {
      console.error("Error saat membuat cabang:", error)

      // Hanya tampilkan pesan error jika bukan pesan sukses
      const errorMessage = error.message || "Gagal menambahkan cabang"
      if (!errorMessage.includes("berhasil")) {
        setError(errorMessage)
        alert(errorMessage)
      } else {
        // Jika pesan mengandung "berhasil", itu sebenarnya sukses
        navigate("/cabang-asli")
      }
    } finally {
      setLoading(false)
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

  // Memeriksa autentikasi dan mengambil data kepala operasional saat komponen dimuat
  useEffect(() => {
    const accessToken = getAccessToken()
    if (!accessToken) {
      alert("Anda belum login atau sesi telah berakhir")
      navigate("/login")
      return
    }

    // Ambil daftar kepala operasional
    fetchUsers()

    // JANGAN panggil useDummyData() di sini kecuali sebagai fallback
    // Jika fetchUsers() gagal, useDummyData() akan dipanggil di dalam fetchUsers()
  }, [navigate])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Tambah Cabang</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

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
                value={formData.nomorCabang}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Masukkan nomor cabang"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Cabang</label>
              <input
                type="text"
                name="namaCabang"
                value={formData.namaCabang}
                onChange={handleChange}
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
                value={formData.alamat}
                onChange={handleChange}
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
                value={formData.kontak}
                onChange={handleChange}
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
                value={formData.jumlahKaryawan}
                onChange={handleChange}
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
                value={formData.jamOperasional}
                onChange={handleChange}
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
                      value={formData.idKepalaOperasional}
                      onChange={handleChange}
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
                      value={formData.idKepalaOperasional}
                      onChange={handleChange}
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
              onClick={() => navigate("/cabang-asli")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
              disabled={loading}
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCabangAsli




// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import CabangAsliService, { type CreateCabangAsliDTO } from "../../services/cabang-asli"

// const CreateCabangAsli = () => {
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(false)
//   const [formData, setFormData] = useState<CreateCabangAsliDTO>({
//     nomorCabang: "",
//     namaCabang: "",
//     alamat: "",
//     kontak: "",
//     jumlahKaryawan: 0,
//     jamOperasional: "08:00",
//     idKepalaOperasional: "",
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: name === "jumlahKaryawan" ? Number.parseInt(value) || 0 : value,
//     })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       setLoading(true)

//       // Format jam operasional untuk sesuai dengan format yang diharapkan
//       const formattedData = {
//         ...formData,
//         jamOperasional: formData.jamOperasional + ":00", // Menambahkan detik
//       }

//       // Panggil service tanpa token
//       await CabangAsliService.create(formattedData)
//       navigate("/cabang-asli")
//     } catch (error) {
//       console.error("Error creating cabang:", error)
//       alert("Gagal menambahkan cabang")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
//         <h2 className="text-xl font-medium text-gray-800 mb-6">Tambah Cabang</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Cabang</label>
//               <input
//                 type="text"
//                 name="nomorCabang"
//                 value={formData.nomorCabang}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                 placeholder="Masukkan nomor cabang"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Nama Cabang</label>
//               <input
//                 type="text"
//                 name="namaCabang"
//                 value={formData.namaCabang}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                 placeholder="Masukkan nama cabang"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
//               <input
//                 type="text"
//                 name="alamat"
//                 value={formData.alamat}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                 placeholder="Masukkan alamat cabang"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Kontak</label>
//               <input
//                 type="text"
//                 name="kontak"
//                 value={formData.kontak}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                 placeholder="Masukkan kontak cabang"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Karyawan</label>
//               <input
//                 type="number"
//                 name="jumlahKaryawan"
//                 value={formData.jumlahKaryawan}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                 placeholder="Masukkan jumlah karyawan"
//                 min="0"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
//               <input
//                 type="time"
//                 name="jamOperasional"
//                 value={formData.jamOperasional}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">ID Kepala Operasional</label>
//               <input
//                 type="text"
//                 name="idKepalaOperasional"
//                 value={formData.idKepalaOperasional}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
//                 placeholder="Masukkan ID kepala operasional"
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               type="button"
//               onClick={() => navigate("/cabang-asli")}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
//               disabled={loading}
//             >
//               Batalkan
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
//               disabled={loading}
//             >
//               {loading ? "Menyimpan..." : "Tambah"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default CreateCabangAsli