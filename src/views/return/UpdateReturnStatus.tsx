"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ReturnService from "../../services/return"
import type { ReturnResponseDTO } from "../../interface/Return"

const UpdateReturnStatus = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [returnData, setReturnData] = useState<ReturnResponseDTO | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasUpdatePermission, setHasUpdatePermission] = useState<boolean>(false)

  // Get the access token from storage
  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  // Check if user has permission to update status
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

  useEffect(() => {
    const fetchReturnData = async () => {
      if (!id) return

      try {
        setLoading(true)
        const accessToken = getAccessToken()
        const data = await ReturnService.getReturnById(accessToken, id)
        setReturnData(data)
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

        // Check if user has update permission
        const updateRoles = [
          "Staf Gudang Pelaksana Umum",
          "STAF_GUDANG_PELAKSANA_UMUM",
          "STAF GUDANG PELAKSANA UMUM",
          "Staf_Gudang_Pelaksana_Umum",
          "ADMIN",
          "admin",
          "Admin",
        ]

        setHasUpdatePermission(checkRoleAccess(response, updateRoles))
        console.log("User role:", response, "Has update permission:", checkRoleAccess(response, updateRoles))
      } catch (error) {
        console.error("Error fetching user role:", error)
      }
    }

    fetchUserRole()
  }, [])

  const handleUpdateStatus = async () => {
    if (!id) return

    try {
      setSubmitting(true)
      setError(null)
      const accessToken = getAccessToken()

      if (!accessToken) {
        setError("Tidak ada token akses. Silakan login kembali.")
        return
      }

      // Always update to DITERIMA when coming from this page
      const newStatus = "DITERIMA"

      await ReturnService.updateStatusRetur(accessToken, id, newStatus)
      alert(`Status return berhasil diubah menjadi ${newStatus}!`)

      // Redirect to confirmation page
      navigate(`/return/${id}/konfirmasi`)
    } catch (err: any) {
      console.error("Error updating return status:", err)

      if (err.response) {
        console.error("Response status:", err.response.status)
        console.error("Response data:", err.response.data)

        if (err.response.status === 403) {
          setError("Akses ditolak. Anda tidak memiliki izin untuk mengubah status.")
        } else if (err.response.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.")
        } else {
          setError(`Gagal mengubah status return: ${err.response.data?.message || "Terjadi kesalahan"}`)
        }
      } else {
        setError(`Gagal mengubah status return: ${err.message || "Terjadi kesalahan"}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/return/${id}`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Update Status Return</h2>

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
              <p className="text-sm font-medium text-gray-700 mb-1">Status Approval</p>
              <p
                className={`text-gray-800 ${returnData.statusApproval === "DISETUJUI" ? "text-green-600 font-medium" : "text-red-600 font-medium"}`}
              >
                {returnData.statusApproval}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Status Return Saat Ini</p>
              <p className="text-gray-800">{returnData.statusRetur}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium text-blue-800 mb-2">Konfirmasi Update Status</p>
              <p className="text-blue-700">
                Anda akan mengubah status return dari <span className="font-medium">{returnData.statusRetur}</span>{" "}
                menjadi <span className="font-medium">DITERIMA</span>.
              </p>
            </div>

            {returnData.statusApproval === "DISETUJUI" && (
              <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm mt-4">
                <p className="font-medium">Informasi Alur:</p>
                <p>
                  Setelah status diubah menjadi DITERIMA, Anda akan diarahkan ke halaman konfirmasi jumlah penerimaan.
                </p>
              </div>
            )}

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
                type="button"
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                disabled={submitting || returnData.statusApproval !== "DISETUJUI" || !hasUpdatePermission}
              >
                {submitting ? "Menyimpan..." : "Update Status ke DITERIMA"}
              </button>
              {!hasUpdatePermission && (
                <div className="text-xs text-red-500 mt-2">
                  Anda tidak memiliki izin untuk mengubah status return. Hanya Staf Gudang Pelaksana Umum yang dapat melakukan ini.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">Data return tidak ditemukan</div>
        )}
      </div>
    </div>
  )
}

export default UpdateReturnStatus
