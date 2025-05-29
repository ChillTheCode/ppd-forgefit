"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ReturnService from "../../services/return"
import type { ReturnResponseDTO, ApprovalRequestDTO } from "../../interface/Return"

const ApproveReturn = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [returnData, setReturnData] = useState<ReturnResponseDTO | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [approvalData, setApprovalData] = useState<ApprovalRequestDTO>({
    statusApproval: "DISETUJUI",
  })

  // Get the access token from storage
  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  // Get user role from storage with fallback for development
  const getUserRole = () => {
    const role = localStorage.getItem("userRole") || ""
    return role
  }

  // More flexible role checking function
  const checkRoleAccess = (allowedRoles: string[]) => {
    const role = getUserRole()

    // If no role is set, allow access in development mode
    if (!role) {
      console.log("No role found, allowing access for testing")
      return true
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

  // Check if user has the right role to approve returns
  const hasApprovalPermission = checkRoleAccess([
    "Kepala Departemen SDM dan Umum",
    "KEPALA_DEPARTEMEN_SDM_DAN_UMUM",
    "KEPALA DEPARTEMEN SDM DAN UMUM",
    "Kepala_Departemen_SDM_dan_Umum",
    "ADMIN", // Add common admin roles for flexibility
    "admin",
    "Admin",
  ])

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "DISETUJUI" | "DITOLAK"
    console.log("Selected value:", value)

    setApprovalData({
      ...approvalData,
      statusApproval: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      setSubmitting(true)
      const accessToken = getAccessToken()

      // Try with a simplified object structure
      const dataToSend = {
        statusApproval: approvalData.statusApproval,
      }

      console.log("Current user role:", getUserRole())
      console.log("Sending approval data:", dataToSend)
      console.log("Status approval value:", dataToSend.statusApproval)

      await ReturnService.approveReturn(accessToken, id, dataToSend)
      alert(`Return berhasil ${dataToSend.statusApproval === "DISETUJUI" ? "disetujui" : "ditolak"}!`)
      navigate(`/return/${id}`)
    } catch (err: any) {
      console.error("Error approving return:", err)

      // Provide a more specific error message for 500 errors
      if (err.response && err.response.status === 500) {
        setError(`Gagal melakukan approval return: Server error (500). Coba gunakan status DITOLAK untuk sementara.`)
      } else if (err.response && err.response.status === 403) {
        setError("Akses ditolak. Periksa apakah Anda memiliki peran yang sesuai untuk melakukan approval.")
      } else if (err.response && err.response.status === 401) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.")
      } else {
        setError(`Gagal melakukan approval return: ${err.message || "Terjadi kesalahan"}`)
      }

      // Log more detailed error information
      if (err.response) {
        console.error("Error response data:", err.response.data)
        console.error("Error response status:", err.response.status)
        console.error("Error response headers:", err.response.headers)
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
        <h2 className="text-xl font-medium text-gray-800 mb-6">Approval Return</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

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
                <p className="text-sm font-medium text-gray-700 mb-1">Alasan Return</p>
                <p className="text-gray-800">{returnData.alasanReturn || "-"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Approval</label>
                <select
                  name="statusApproval"
                  value={approvalData.statusApproval}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                >
                  <option value="DISETUJUI">DISETUJUI</option>
                  <option value="DITOLAK">DITOLAK</option>
                </select>
                {approvalData.statusApproval === "DISETUJUI" && (
                  <p className="text-xs text-orange-500 mt-1">
                  </p>
                )}
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
                disabled={submitting}
              >
                {submitting ? "Menyimpan..." : "Simpan"}
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

export default ApproveReturn
