"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import BarangService, { Barang, BarangDTO } from "../../services/barang.ts"
import LogBarangComponent from "../../components/LogBarangComponent.tsx"

const ReadDetailBarang = () => {
  const { id } = useParams() // Mengambil ID dari URL parameter
  const navigate = useNavigate() // Hook untuk navigasi

  const [barang, setBarang] = useState<Barang | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "adjustments">("overview")
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false) // Modal edit

  // Get the access token from storage
  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  useEffect(() => {
    const fetchBarangDetail = async () => {
      try {
        console.log("Mencoba mengambil data untuk ID:", id)

        if (!id) {
          setError("ID Barang tidak ditemukan")
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
          const data = await BarangService.getBarangById(accessToken, parseInt(id))
          console.log("Data dari API:", data)
          setBarang(data)
        } catch (apiError) {
          console.error("Error fetching from API:", apiError)
          setError("Gagal memuat detail barang")
        }
      } catch (err) {
        console.error("Error fetching barang detail:", err)
        setError("Gagal memuat detail barang")
      } finally {
        setLoading(false)
      }
    }

    fetchBarangDetail()
  }, [id])

  // Format date to DD/MM/YY
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`
  }

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }

  const handleDelete = async () => {
    if (!barang || !id) return

    try {
      const accessToken = getAccessToken()

      if (!accessToken) {
        alert("Anda belum login atau sesi telah berakhir")
        navigate("/login")
        return
      }

      await BarangService.deleteBarang(accessToken, barang.kodeBarang)
      navigate("/barang") // Redirect ke halaman daftar barang
    } catch (err) {
      console.error("Error deleting barang:", err)
      alert("Gagal menghapus barang")
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
              Apakah Anda ingin menghapus informasi barang ini?
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

  // Modal edit barang
  const EditBarangModal = () => {
    if (!showEditModal || !barang || !id) return null

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
          namaBarang: formData.get("namaBarang") as string,
          kategoriBarang: formData.get("kategoriBarang") as string,
          hargaBarang: Number(formData.get("hargaBarang")),
          bentuk: formData.get("bentuk") as 'satuan' | 'paket',
        }

        // Call update API
        await BarangService.updateBarang(accessToken, parseInt(id), updateData)

        // Close modal
        setShowEditModal(false)

        // Refresh data
        const updatedData = await BarangService.getBarangById(accessToken, parseInt(id))
        setBarang(updatedData)
      } catch (error) {
        console.error("Error updating barang:", error)
        alert("Gagal memperbarui data barang")
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-medium text-gray-800 mb-6">Edit Barang</h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Barang</label>
                <input
                  type="text"
                  name="kodeBarang"
                  value={barang.kodeBarang}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                <input
                  type="text"
                  name="namaBarang"
                  defaultValue={barang.namaBarang}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Masukkan nama barang"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Barang</label>
                <input
                  type="text"
                  name="kategoriBarang"
                  defaultValue={barang.kategoriBarang}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Masukkan kategori barang"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Barang</label>
                <input
                  type="number"
                  name="hargaBarang"
                  defaultValue={barang.hargaBarang}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Masukkan harga barang"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bentuk</label>
                <select
                  name="bentuk"
                  defaultValue={barang.bentuk}
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

  if (error || !barang) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Data barang tidak ditemukan"}
        </div>
        <button className="mt-4 text-blue-600 hover:underline" onClick={() => navigate("/barang")}>
          Kembali ke daftar barang
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white">
      <DeleteConfirmationModal />
      <EditBarangModal />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">{barang.namaBarang}</h1>
        <div className="flex gap-2">
          {activeTab === "adjustments" && (
            <>
              <button
                className="border border-gray-300 px-4 py-2 rounded text-sm flex items-center gap-2 text-gray-600"
                onClick={() => setShowEditModal(true)}
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
            </>
          )}
        </div>
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
            <div className="text-sm text-gray-500">Nomor Barang</div>
            <div className="text-sm">{barang.kodeBarang}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Nama Barang</div>
            <div className="text-sm">{barang.namaBarang}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Kategori Barang</div>
            <div className="text-sm">{barang.kategoriBarang}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Harga Barang</div>
            <div className="text-sm">{formatPrice(barang.hargaBarang)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Bentuk (Satuan/Paket)</div>
            <div className="text-sm capitalize">{barang.bentuk}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Tanggal Dibuat</div>
            <div className="text-sm">{formatDate(barang.createdAt)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-500">Tanggal Diperbarui</div>
            <div className="text-sm">{formatDate(barang.updatedAt)}</div>
          </div>
        </div>
      </div>

      <div>
        <LogBarangComponent
          kodeBarang={barang.kodeBarang}
          />
      </div>

      <button
        className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm"
        onClick={() => navigate("/barang")}
      >
        Kembali ke daftar barang
      </button>
    </div>
  )
}

export default ReadDetailBarang