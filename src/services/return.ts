import axios from "axios"
import { apiBaseURL } from "../constant"
import type { BaseResponse } from "../interface/BaseResponse"
import type {
  ReturnRequestDTO,
  ApprovalRequestDTO,
  KonfirmasiReturnRequestDTO,
  ReturnResponseDTO,
} from "../interface/Return"

// Base URL for the API
const returnURL = `${apiBaseURL}/api/return`
const notifikasiURL = `${apiBaseURL}/api/notifikasi`

/**
 * Helper function to get the current user's role
 */
const getCurrentUserRole = async (accessToken: string): Promise<string> => {
  try {
    // Try to get role directly from the backend
    const response = await axios.get<BaseResponse<string>>(`${apiBaseURL}/api/auth/role`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (response.data.status === 200 && response.data.data) {
      console.log("Retrieved role from backend:", response.data.data)
      return response.data.data
    }

    return ""
  } catch (error) {
    console.error("Error getting user role:", error)
    return ""
  }
}

/**
 * Helper function to send a notification
 */
const sendNotification = async (
  accessToken: string,
  rolePengirim: string,
  rolePenerima: string,
  isiNotifikasi: string,
  nomorCabang?: string | null,
  idPengajuan?: string | null,
): Promise<boolean> => {
  try {
    console.log(`Attempting to send notification from ${rolePengirim} to ${rolePenerima}`)
    console.log(`Message: ${isiNotifikasi}`)
    console.log(`Using token: ${accessToken.substring(0, 15)}...`)

    // Create the request body directly
    const requestBody = {
      rolePengirim,
      rolePenerima,
      isiNotifikasi,
      nomorCabang,
      idPengajuan,
    }

    // Send notification using POST with body instead of query params
    const response = await axios.post(`${notifikasiURL}`, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Notification API response:", response.data)
    return true
  } catch (error) {
    console.error("Failed to send notification:", error)

    // Log more detailed error information
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error status:", error.response.status)
      console.error("Error data:", error.response.data)
    }

    return false
  }
}

/**
 * Service for handling Return API operations with authentication
 */
const ReturnService = {
  /**
   * Get the current user's role
   * @param accessToken - JWT Bearer token for authentication
   * @returns Promise with the user's role as a string
   */
  getCurrentUserRole: async (accessToken: string): Promise<string> => {
    return getCurrentUserRole(accessToken)
  },
  /**
   * Create a new return request
   * @param accessToken - JWT Bearer token for authentication
   * @param returnRequest - The return request data
   * @returns Promise with the created Return response
   */
  createReturn: async (accessToken: string, returnRequest: ReturnRequestDTO): Promise<ReturnResponseDTO> => {
    try {
      const response = await axios.post<BaseResponse<ReturnResponseDTO>>(returnURL, returnRequest, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.status !== 200 && response.data.status !== 201) {
        throw new Error(response.data.message || "Failed to create return request")
      }

      // Get user role for notification
      const rolePengirim = await getCurrentUserRole(accessToken)

      if (rolePengirim) {
        // Determine recipient role based on business logic
        let rolePenerima = ""

        if (rolePengirim === "Staf Gudang Pelaksana Umum") {
          rolePenerima = "Kepala Operasional Cabang"
        } else if (rolePengirim === "Kepala Operasional Cabang") {
          rolePenerima = "Direktur Utama"
        } else {
          rolePenerima = "Admin" // Default recipient
        }

        // Get user profile to get cabang number
        const profileResponse = await axios.get<BaseResponse<any>>(`${apiBaseURL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })

        let nomorCabang = null
        if (profileResponse.data.status === 200 && profileResponse.data.data) {
          nomorCabang = profileResponse.data.data.nomorCabang
        }

        // Create notification message based on return details
        const isiNotifikasi = `Pengajuan return baru untuk ${returnRequest.namaBarang} dengan jumlah ${returnRequest.stokInput} telah dibuat. Status: PENGAJUAN`

        // Send notification
        await sendNotification(
          accessToken,
          rolePengirim,
          rolePenerima,
          isiNotifikasi,
          nomorCabang,
          response.data.data?.idInputStokBarangReturn,
        )
      }

      return response.data.data as ReturnResponseDTO
    } catch (error: any) {
      console.error("Error creating return request:", error)

      if (error.response) {
        throw new Error(
          error.response.data?.message || `Error ${error.response.status}: Gagal membuat pengajuan return`,
        )
      } else if (error.request) {
        throw new Error("Tidak ada respons dari server. Periksa koneksi internet Anda.")
      } else {
        throw error
      }
    }
  },

  /**
   * Get all returns
   * @param accessToken - JWT Bearer token for authentication
   * @returns Promise with array of Return responses
   */
  getAllReturns: async (accessToken: string): Promise<ReturnResponseDTO[]> => {
    try {
      const response = await axios.get<BaseResponse<ReturnResponseDTO[]>>(returnURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.status !== 200) {
        throw new Error("Failed to fetch return data")
      }

      return response.data.data || []
    } catch (error) {
      console.error("Error fetching all returns:", error)
      throw error
    }
  },

  /**
   * Get returns by status
   * @param accessToken - JWT Bearer token for authentication
   * @param status - The status to filter by
   * @returns Promise with array of Return responses
   */
  getReturnsByStatus: async (accessToken: string, status: string): Promise<ReturnResponseDTO[]> => {
    try {
      const response = await axios.get<BaseResponse<ReturnResponseDTO[]>>(`${returnURL}/status/${status}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.status !== 200) {
        throw new Error(`Failed to fetch returns with status ${status}`)
      }

      return response.data.data || []
    } catch (error) {
      console.error(`Error fetching returns with status ${status}:`, error)
      throw error
    }
  },

  /**
   * Get return details by ID
   * @param accessToken - JWT Bearer token for authentication
   * @param idReturn - The ID of the return
   * @returns Promise with Return response details
   */
  getReturnById: async (accessToken: string, idReturn: string): Promise<ReturnResponseDTO> => {
    try {
      const response = await axios.get<BaseResponse<ReturnResponseDTO>>(`${returnURL}/${idReturn}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error(`Return with ID ${idReturn} not found`)
      }

      return response.data.data
    } catch (error) {
      console.error(`Error fetching return with id ${idReturn}:`, error)
      throw error
    }
  },

  /**
   * Approve or reject a return request
   * @param accessToken - JWT Bearer token for authentication
   * @param idReturn - The ID of the return to approve/reject
   * @param approvalDTO - The approval data (DISETUJUI or DITOLAK)
   * @returns Promise with the updated Return response
   */
  approveReturn: async (
    accessToken: string,
    idReturn: string,
    approvalDTO: ApprovalRequestDTO,
  ): Promise<ReturnResponseDTO> => {
    try {
      console.log("Sending approval request:", approvalDTO)

      const response = await axios.put<BaseResponse<ReturnResponseDTO>>(
        `${returnURL}/${idReturn}/approve`,
        approvalDTO,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error(`Failed to approve/reject return with ID ${idReturn}`)
      }

      // Get return details to include in notification
      const returnDetail = response.data.data

      // Get user role for notification
      const rolePengirim = await getCurrentUserRole(accessToken)

      if (rolePengirim) {
        // Determine recipient role based on who created the return
        // In a real scenario, you might want to get this from the return data
        const rolePenerima = "Staf Gudang Pelaksana Umum" // Default to staff who usually creates returns

        // Get user profile to get cabang number
        const profileResponse = await axios.get<BaseResponse<any>>(`${apiBaseURL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })

        let nomorCabang = null
        if (profileResponse.data.status === 200 && profileResponse.data.data) {
          nomorCabang = profileResponse.data.data.nomorCabang
        }

        // Create notification message based on approval status
        const statusText = approvalDTO.statusApproval === "DISETUJUI" ? "disetujui" : "ditolak"
        const isiNotifikasi = `Pengajuan return untuk ${returnDetail.namaBarang} telah ${statusText}. Status: ${approvalDTO.statusApproval}`

        // Send notification
        await sendNotification(
          accessToken,
          rolePengirim,
          rolePenerima,
          isiNotifikasi,
          nomorCabang,
          returnDetail.idInputStokBarangReturn,
        )
      }

      return response.data.data
    } catch (error: any) {
      console.error(`Error approving/rejecting return with id ${idReturn}:`, error)

      // Log more detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data)
        console.error("Error response status:", error.response.status)
      }

      throw error
    }
  },

  /**
   * Update the status of a return
   * @param accessToken - JWT Bearer token for authentication
   * @param idReturn - The ID of the return
   * @param newStatus - The new status (PENGAJUAN, DIKIRIM, DITERIMA, SELESAI)
   * @returns Promise with the updated Return response
   */
  updateStatusRetur: async (accessToken: string, idReturn: string, newStatus: string): Promise<ReturnResponseDTO> => {
    try {
      const response = await axios.put<BaseResponse<ReturnResponseDTO>>(
        `${returnURL}/${idReturn}/status/${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error(`Failed to update status for return with ID ${idReturn}`)
      }

      // Get return details to include in notification
      const returnDetail = response.data.data

      // Get user role for notification
      const rolePengirim = await getCurrentUserRole(accessToken)

      if (rolePengirim) {
        // Determine recipient role based on new status
        let rolePenerima = ""

        if (newStatus === "DIKIRIM") {
          rolePenerima = "Kepala Operasional Cabang" // Notify manager when items are shipped
        } else if (newStatus === "DITERIMA") {
          rolePenerima = "Staf Gudang Pelaksana Umum" // Notify staff when items are received
        } else if (newStatus === "SELESAI") {
          rolePenerima = "Direktur Utama" // Notify director when process is complete
        } else {
          rolePenerima = "Admin" // Default recipient
        }

        // Get user profile to get cabang number
        const profileResponse = await axios.get<BaseResponse<any>>(`${apiBaseURL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })

        let nomorCabang = null
        if (profileResponse.data.status === 200 && profileResponse.data.data) {
          nomorCabang = profileResponse.data.data.nomorCabang
        }

        // Create notification message based on new status
        const isiNotifikasi = `Status return untuk ${returnDetail.namaBarang} telah diperbarui menjadi ${newStatus}`

        // Send notification
        await sendNotification(
          accessToken,
          rolePengirim,
          rolePenerima,
          isiNotifikasi,
          nomorCabang,
          returnDetail.idInputStokBarangReturn,
        )
      }

      return response.data.data
    } catch (error) {
      console.error(`Error updating status for return with id ${idReturn}:`, error)
      throw error
    }
  },

  /**
   * Confirm receipt of returned items
   * @param accessToken - JWT Bearer token for authentication
   * @param idReturn - The ID of the return
   * @param konfirmasiDTO - The confirmation data with quantity received
   * @returns Promise with the updated Return response
   */
  konfirmasiReturn: async (
    accessToken: string,
    idReturn: string,
    konfirmasiDTO: KonfirmasiReturnRequestDTO,
  ): Promise<ReturnResponseDTO> => {
    try {
      const response = await axios.put<BaseResponse<ReturnResponseDTO>>(
        `${returnURL}/${idReturn}/konfirmasi`,
        konfirmasiDTO,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error(`Failed to confirm return with ID ${idReturn}`)
      }

      // Get return details to include in notification
      const returnDetail = response.data.data

      // Get user role for notification
      const rolePengirim = await getCurrentUserRole(accessToken)

      if (rolePengirim) {
        // Determine recipient role - usually notify the person who created the return
        const rolePenerima = "Staf Gudang Pelaksana Umum"

        // Get user profile to get cabang number
        const profileResponse = await axios.get<BaseResponse<any>>(`${apiBaseURL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })

        let nomorCabang = null
        if (profileResponse.data.status === 200 && profileResponse.data.data) {
          nomorCabang = profileResponse.data.data.nomorCabang
        }

        // Create notification message based on confirmation details
        const isiNotifikasi = `Return untuk ${returnDetail.namaBarang} telah dikonfirmasi dengan jumlah ${konfirmasiDTO.jumlahDikonfirmasi}`

        // Send notification
        await sendNotification(
          accessToken,
          rolePengirim,
          rolePenerima,
          isiNotifikasi,
          nomorCabang,
          returnDetail.idInputStokBarangReturn,
        )
      }

      return response.data.data
    } catch (error) {
      console.error(`Error confirming return with id ${idReturn}:`, error)
      throw error
    }
  },
}

export default ReturnService
