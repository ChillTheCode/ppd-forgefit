"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ReturnService from "../../services/return"
import type { ReturnResponseDTO } from "../../interface/Return"
import authenticationService from "../../services/authentication"
import { generateApprovalPDF, generateConfirmationPDF } from "./ReturnPDFGenerator"

const ReadDetailReturn = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [returnData, setReturnData] = useState<ReturnResponseDTO | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [hasApprovalPermission, setHasApprovalPermission] = useState<boolean>(false)
  const [hasUpdateStatusPermission, setHasUpdateStatusPermission] = useState<boolean>(false)
  const [userRole, setUserRole] = useState<string>("")

  // Get the access token from storage
  const getAccessToken = () => {
    return localStorage.getItem("accessToken") || ""
  }

  // Check if user has permission to approve returns
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

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const accessToken = getAccessToken()
        if (!accessToken) {
          console.error("Access token not found")
          return
        }

        const response = await authenticationService.getRoleService(accessToken)
        if (response === "Failed") {
          console.error("Error fetching role")
          return
        }

        // Store the user role for PDF generation
        setUserRole(response)

        // Check if user has approval permission
        const approvalRoles = [
          "Kepala Departemen SDM dan Umum",
          "KEPALA_DEPARTEMEN_SDM_DAN_UMUM",
          "KEPALA DEPARTEMEN SDM DAN UMUM",
          "Kepala_Departemen_SDM_dan_Umum",
          "ADMIN",
          "admin",
          "Admin",
        ]

        // Check if user has update status permission
        const updateStatusRoles = [
          "Staf Gudang Pelaksana Umum",
          "STAF_GUDANG_PELAKSANA_UMUM",
          "STAF GUDANG PELAKSANA UMUM",
          "Staf_Gudang_Pelaksana_Umum",
          "ADMIN",
          "admin",
          "Admin",
        ]

        setHasApprovalPermission(checkRoleAccess(response, approvalRoles))
        setHasUpdateStatusPermission(checkRoleAccess(response, updateStatusRoles))
      } catch (error) {
        console.error("Error fetching user role:", error)
      }
    }

    fetchUserRole()
  }, [])

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

  // Get status color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "MENUNGGU":
        return "text-yellow-600"
      case "DISETUJUI":
        return "text-green-600"
      case "DITOLAK":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Get status color based on perlakuan
  const getPerlakuanColor = (perlakuan: string) => {
    switch (perlakuan) {
      case "Dibuang":
        return "text-red-600"
      case "Dikembalikan":
        return "text-blue-600"
      case "Dijual":
        return "text-green-600"
      case "Disumbangkan":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  // Get status color based on status retur
  const getStatusReturColor = (statusRetur: string) => {
    switch (statusRetur) {
      case "PENGAJUAN":
        return "text-yellow-600"
      case "DIKIRIM":
        return "text-blue-600"
      case "DITERIMA":
        return "text-green-600"
      case "SELESAI":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const handleApprove = () => {
    if (id) {
      navigate(`/return/${id}/approve`)
    }
  }

  const handleKonfirmasi = () => {
    if (id) {
      navigate(`/return/${id}/konfirmasi`)
    }
  }

  const handleUpdateStatus = () => {
    if (id) {
      navigate(`/return/${id}/update-status`)
    }
  }

  const handleBack = () => {
    navigate("/return")
  }

  // Handle PDF generation for approval report
  const handleGenerateApprovalPDF = () => {
    if (returnData) {
      generateApprovalPDF(returnData, userRole)
    } else {
      alert("Tidak ada data untuk di-export.")
    }
  }

  // Handle PDF generation for confirmation report
  const handleGenerateConfirmationPDF = () => {
    if (returnData) {
      generateConfirmationPDF(returnData, userRole)
    } else {
      alert("Tidak ada data untuk di-export.")
    }
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-gray-800">Detail Return</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
        >
          Kembali
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      ) : returnData ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Informasi Return</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">ID Return:</span>
                  <p className="font-medium">{returnData.idInputStokBarangReturn}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Kode Barang:</span>
                  <p className="font-medium">{returnData.kodeBarang || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Nama Barang:</span>
                  <p className="font-medium">{returnData.namaBarang || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Stok Barang Saat Ini:</span>
                  <p className="font-medium">{returnData.stokBarangSaatIni}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Stok Return:</span>
                  <p className="font-medium">{returnData.stokInput}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Perlakuan:</span>
                  <p className={`font-medium ${getPerlakuanColor(returnData.perlakuan)}`}>{returnData.perlakuan}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Harga Barang:</span>
                  <p className="font-medium">
                    {returnData.hargaBarang ? `Rp ${returnData.hargaBarang.toLocaleString("id-ID")}` : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Status dan Alasan</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Username Pengaju:</span>
                  <p className="font-medium">{returnData.idPengajuan || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Alasan Return:</span>
                  <p className="font-medium">{returnData.alasanReturn || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status Approval:</span>
                  <p className={`font-medium ${getStatusColor(returnData.statusApproval)}`}>
                    {returnData.statusApproval}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Jumlah Dikonfirmasi:</span>
                  <p className="font-medium">{returnData.jumlahDikonfirmasi || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status Retur:</span>
                  <p className={`font-medium ${getStatusReturColor(returnData.statusRetur)}`}>
                    {returnData.statusRetur}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            {/* PDF Export Buttons */}
            <div className="flex-grow flex justify-start gap-3">
              {/* Approval PDF Button - Only visible to approval roles and when status is DISETUJUI */}
              {returnData.statusApproval === "DISETUJUI" && hasApprovalPermission && (
                <button
                  onClick={handleGenerateApprovalPDF}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                >
                  Export PDF Persetujuan
                </button>
              )}

              {/* Confirmation PDF Button - Only visible to confirmation roles and when status is SELESAI */}
              {returnData.statusRetur === "SELESAI" && hasUpdateStatusPermission && (
                <button
                  onClick={handleGenerateConfirmationPDF}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                >
                  Export PDF Konfirmasi
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {returnData.statusApproval === "MENUNGGU" && hasApprovalPermission && (
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >
                  Approval Return
                </button>
              )}

              {returnData.statusApproval === "DISETUJUI" && returnData.statusRetur === "PENGAJUAN" && hasUpdateStatusPermission && (
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium"
                >
                  Update Status ke DIKIRIM
                </button>
              )}

              {returnData.statusApproval === "DISETUJUI" && returnData.statusRetur === "DIKIRIM" && hasUpdateStatusPermission && (
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                >
                  Update Status ke DITERIMA
                </button>
              )}

              {returnData.statusRetur === "DITERIMA" && hasUpdateStatusPermission && (
                <button
                  onClick={handleKonfirmasi}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
                >
                  Konfirmasi Penerimaan
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">Data return tidak ditemukan</div>
      )}
    </div>
  )
}

export default ReadDetailReturn
