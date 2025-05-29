"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ReturnService from "../../services/return"
import BarangService, { Barang } from "../../services/barang"
import { ReturnRequestDTO } from "../../interface/Return"

const CreateReturnRequest = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [loadingBarang, setLoadingBarang] = useState(true)
  const [formData, setFormData] = useState<ReturnRequestDTO>({
    kodeBarang: null,
    namaBarang: null,
    stokInput: 0,
    perlakuan: "Dikembalikan", // Default value
    alasanReturn: "",
    idPengajuan: null,
  })

  // Mendapatkan access token dari storage
  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (name === "kodeBarang") {
      // If kode barang is selected, find the corresponding barang and update nama barang
      const kodeBarang = Number.parseInt(value) || null
      const selectedBarang = barangList.find(barang => barang.kodeBarang === kodeBarang)

      setFormData({
        ...formData,
        kodeBarang: kodeBarang,
        namaBarang: selectedBarang ? selectedBarang.namaBarang : null
      })
    } else if (name === "stokInput") {
      // Handle stokInput separately to ensure it's parsed as a number
      setFormData({
        ...formData,
        stokInput: Number.parseInt(value) || 0
      })
    } else {
      // Handle other fields normally
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate form data
    if (!formData.kodeBarang) {
      setError("Kode barang harus dipilih")
      return
    }

    if (!formData.namaBarang) {
      setError("Nama barang tidak boleh kosong")
      return
    }

    if (!formData.stokInput || formData.stokInput <= 0) {
      setError("Jumlah stok return harus lebih dari 0")
      return
    }

    if (!formData.alasanReturn.trim()) {
      setError("Alasan return tidak boleh kosong")
      return
    }

    try {
      setLoading(true)

      const accessToken = getAccessToken()
      if (!accessToken) {
        alert("Anda belum login atau sesi telah berakhir")
        navigate("/login")
        return
      }

      // Set ID pengajuan dari user yang login (bisa diambil dari token atau state)
      const userId = localStorage.getItem("userId") || ""
      const dataToSubmit = {
        ...formData,
        idPengajuan: userId,
      }

      // Panggil API
      await ReturnService.createReturn(accessToken, dataToSubmit)

      // Redirect ke halaman daftar return
      navigate("/return")

    } catch (error: any) {
      console.error("Error saat membuat pengajuan return:", error)

      const errorMessage = error.message || "Gagal membuat pengajuan return"
      setError(errorMessage)
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Memeriksa autentikasi dan mengambil data barang saat komponen dimuat
  useEffect(() => {
    const accessToken = getAccessToken()
    if (!accessToken) {
      alert("Anda belum login atau sesi telah berakhir")
      navigate("/login")
      return
    }

    // Fetch list of available barang
    const fetchBarangList = async () => {
      try {
        setLoadingBarang(true)
        const data = await BarangService.getAllBarang(accessToken)
        setBarangList(data)
      } catch (err) {
        console.error("Error fetching barang data:", err)
        setError("Gagal memuat data barang")
      } finally {
        setLoadingBarang(false)
      }
    }

    fetchBarangList()
  }, [navigate])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Pengajuan Return Barang</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode Barang</label>
              {loadingBarang ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100">
                  Memuat data barang...
                </div>
              ) : (
                <select
                  name="kodeBarang"
                  value={formData.kodeBarang || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                >
                  <option value="">Pilih Kode Barang</option>
                  {barangList.map((barang) => (
                    <option key={barang.kodeBarang} value={barang.kodeBarang}>
                      {barang.kodeBarang} - {barang.namaBarang}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
              <input
                type="text"
                name="namaBarang"
                value={formData.namaBarang || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                placeholder="Nama barang akan terisi otomatis"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Nama barang akan terisi otomatis berdasarkan kode barang yang dipilih
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Stok Return</label>
              <input
                type="number"
                name="stokInput"
                value={formData.stokInput}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Masukkan jumlah stok yang akan direturn"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Perlakuan</label>
              <select
                name="perlakuan"
                value={formData.perlakuan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              >
                <option value="Dikembalikan">Dikembalikan</option>
                <option value="Dibuang">Dibuang</option>
                <option value="Dijual">Dijual</option>
                <option value="Disumbangkan">Disumbangkan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Return</label>
              <textarea
                name="alasanReturn"
                value={formData.alasanReturn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Masukkan alasan return"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => navigate("/return")}
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
              {loading ? "Menyimpan..." : "Ajukan Return"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateReturnRequest