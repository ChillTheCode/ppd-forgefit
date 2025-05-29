"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ReturnService from "../../services/return"
import type { ReturnResponseDTO, KonfirmasiReturnRequestDTO } from "../../interface/Return"

const KonfirmasiReturn = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [returnData, setReturnData] = useState<ReturnResponseDTO | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [konfirmasiData, setKonfirmasiData] = useState<KonfirmasiReturnRequestDTO>({
    jumlahDikonfirmasi: 0,
  })

  // Get the access token from storage
  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  // Check if user has permission to confirm returns
  const checkRoleAccess = (role: string, allowedRoles: string[]) => {
    // If no role is set, deny access
    if (!role) {
      console.log("No role found, denying access")
      return false
    }

    // Check if user role matches any of the allowed roles (case insensitive)
    return allowedRoles.some((allowedRole) => {
      // Exact match
      if (role === allowedRole) return true

      // Case insensitive match
      if (role.toLowerCase() === allowedRole.toLowerCase()) return true

      // Check if role contains the allowed role (for roles that might be prefixed/suffixed)
      if (role.toLowerCase().includes(allowedRole.toLowerCase())) return true

      return false
    })
  }

  const [hasConfirmPermission, setHasConfirmPermission] = useState<boolean>(false)

  useEffect(() => {
    const fetchReturnData = async () => {
      if (!id) return

      try {
        setLoading(true)
        const accessToken = getAccessToken()
        const data = await ReturnService.getReturnById(accessToken, id)
        setReturnData(data)
        // Set default jumlahDikonfirmasi to stokInput
        setKonfirmasiData({
          jumlahDikonfirmasi: data.stokInput,
        })

        // Check if the return is in the correct status for confirmation
        if (data.statusRetur !== "DITERIMA") {
          setError(`Return harus berstatus DITERIMA sebelum dapat dikonfirmasi. Status saat ini: ${data.statusRetur}`)
        }
      } catch (err) {
        console.error("Error fetching return data:", err)
        setError("Gagal memuat data return")
      } finally {
        setLoading(false)
      }
    }

    fetchReturnData()
  }, [id])

  // Fetch user role and check permissions
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const accessToken = getAccessToken()
        if (!accessToken) {
          console.error("Access token not found")
          return
        }

        // Get role from authentication service
        const response = await ReturnService.getCurrentUserRole(accessToken)
        if (!response) {
          console.error("Error fetching role")
          return
        }

        // Check if user has confirmation permission
        const confirmRoles = [
          "Staf Gudang Pelaksana Umum",
          "STAF_GUDANG_PELAKSANA_UMUM",
          "STAF GUDANG PELAKSANA UMUM",
          "Staf_Gudang_Pelaksana_Umum",
          "ADMIN",
          "admin",
          "Admin",
        ]

        setHasConfirmPermission(checkRoleAccess(response, confirmRoles))
        console.log("User role:", response, "Has confirm permission:", checkRoleAccess(response, confirmRoles))
      } catch (error) {
        console.error("Error fetching user role:", error)
      }
    }

    fetchUserRole()
  }, [])

  useEffect(() => {
    // IMPORTANT: Reset any previous error when component mounts
    setError(null)

    // We'll check permission after data is loaded to ensure a consistent state
    console.log("Checking permission: hasConfirmPermission =", hasConfirmPermission)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setKonfirmasiData({
      ...konfirmasiData,
      jumlahDikonfirmasi: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      setSubmitting(true)
      setError(null) // Clear any previous errors
      const accessToken = getAccessToken()

      if (!accessToken) {
        setError("Tidak ada token akses. Silakan login kembali.")
        return
      }

      // Check if the return is in the correct status
      if (returnData?.statusRetur !== "DITERIMA") {
        setError(
          `Return harus berstatus DITERIMA sebelum dapat dikonfirmasi. Status saat ini: ${returnData?.statusRetur}`,
        )
        return
      }

      await ReturnService.konfirmasiReturn(accessToken, id, konfirmasiData)
      alert("Return berhasil dikonfirmasi!")
      navigate(`/return/${id}`)
    } catch (err: any) {
      console.error("Error confirming return:", err)

      if (err.response) {
        console.error("Response status:", err.response.status)
        console.error("Response data:", err.response.data)

        if (err.response.status === 403) {
          setError("Akses ditolak. Hanya Staf Gudang Pelaksana Umum yang dapat melakukan konfirmasi return.")
        } else if (err.response.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.")
        } else if (err.response.status === 400) {
          setError(
            `Gagal melakukan konfirmasi: ${err.response.data?.message || "Return harus berstatus DITERIMA terlebih dahulu"}`,
          )
        } else {
          setError(`Gagal melakukan konfirmasi return: ${err.response.data?.message || "Terjadi kesalahan"}`)
        }
      } else {
        setError(`Gagal melakukan konfirmasi return: ${err.message || "Terjadi kesalahan"}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/return/${id}`)
  }

  // Debug rendered UI
  console.log("Current error state:", error)
  console.log("Rendering with hasConfirmPermission =", hasConfirmPermission)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Konfirmasi Penerimaan Return</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-medium mb-1">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : returnData ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">ID Return</p>
                <p className="text-gray-800">{returnData.idInputStokBarangReturn}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Nama Barang</p>
                <p className="text-gray-800">{returnData.namaBarang || "-"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Stok Return</p>
                <p className="text-gray-800">{returnData.stokInput}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Perlakuan</p>
                <p className="text-gray-800">{returnData.perlakuan}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Status Return</p>
                <p
                  className={`text-gray-800 ${returnData.statusRetur === "DITERIMA" ? "text-green-600 font-medium" : "text-orange-600 font-medium"}`}
                >
                  {returnData.statusRetur}
                </p>
                {returnData.statusRetur !== "DITERIMA" && (
                  <p className="text-xs text-red-500 mt-1">
                    Return harus berstatus DITERIMA sebelum dapat dikonfirmasi
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Diterima</label>
                <input
                  type="number"
                  name="jumlahDikonfirmasi"
                  value={konfirmasiData.jumlahDikonfirmasi}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  min="0"
                  max={returnData.stokInput}
                  required
                  disabled={returnData.statusRetur !== "DITERIMA"}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Masukkan jumlah barang yang benar-benar diterima (maksimal {returnData.stokInput})
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                disabled={submitting}
              >
                Batalkan
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                disabled={submitting || returnData.statusRetur !== "DITERIMA"}
              >
                {submitting ? "Menyimpan..." : "Konfirmasi"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 text-gray-500">Data return tidak ditemukan</div>
        )}
      </div>
    </div>
  )
}

export default KonfirmasiReturn
