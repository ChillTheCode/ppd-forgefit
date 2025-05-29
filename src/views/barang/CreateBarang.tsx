"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import BarangService, { BarangDTO } from "../../services/barang.ts"

const CreateBarang = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BarangDTO>({
    namaBarang: "",
    kategoriBarang: "",
    hargaBarang: 0,
    bentuk: "satuan",
  })

  // Mendapatkan access token dari storage
  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "hargaBarang" ? Number.parseFloat(value) || 0 : value,
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

      // Panggil API
      await BarangService.createBarang(accessToken, formData)
      
      // Jika tidak ada error, maka operasi berhasil
      navigate("/barang")
      
    } catch (error: any) {
      console.error("Error saat membuat barang:", error)
      
      // Hanya tampilkan pesan error jika bukan pesan sukses
      const errorMessage = error.message || "Gagal menambahkan barang"
      if (!errorMessage.includes("berhasil")) {
        setError(errorMessage)
        alert(errorMessage)
      } else {
        // Jika pesan mengandung "berhasil", itu sebenarnya sukses
        navigate("/barang")
      }
    } finally {
      setLoading(false)
    }
  }

  // Memeriksa autentikasi saat komponen dimuat
  useEffect(() => {
    const accessToken = getAccessToken()
    if (!accessToken) {
      alert("Anda belum login atau sesi telah berakhir")
      navigate("/login")
    }
  }, [navigate])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Tambah Barang</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
              <input
                type="text"
                name="namaBarang"
                value={formData.namaBarang}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Barang</label>
              <input
                type="text"
                name="kategoriBarang"
                value={formData.kategoriBarang}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter product Category"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Barang</label>
              <input
                type="number"
                name="hargaBarang"
                value={formData.hargaBarang}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Enter buying price"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bentuk</label>
              <select
                name="bentuk"
                value={formData.bentuk}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              >
                <option value="satuan">Satuan</option>
                <option value="paket">Paket</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => navigate("/barang")}
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

export default CreateBarang