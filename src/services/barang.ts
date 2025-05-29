import axios from "axios";
import { apiBaseURL } from "../constant";
import { BaseResponse } from "../interface/BaseResponse";
import { LogBarangResponseDTO } from "../interface/Barang";

// Define the interface for Barang data
export interface Barang {
  kodeBarang: number;
  namaBarang: string;
  kategoriBarang: string;
  hargaBarang: number;
  bentuk: 'satuan' | 'paket';
  createdAt: string; // LocalDateTime converted to string in TypeScript
  updatedAt: string; // LocalDateTime converted to string in TypeScript
  deletedAt?: string | null; // Optional field
}

// Define type for create and update operations (omitting auto-generated fields)
export type BarangDTO = Omit<Barang, "kodeBarang" | "createdAt" | "updatedAt" | "deletedAt">;
export type UpdateBarangDTO = Partial<BarangDTO>;

// Base URL for the API
const barangURL = `${apiBaseURL}/api/barang`;

/**
 * Helper function to format the Authorization header correctly
 * @param token - The token to format
 * @returns Properly formatted Authorization header value
 */
const formatAuthHeader = (token: string): string => {
  if (!token) return "";
  // Jika token sudah mengandung "Bearer ", gunakan langsung
  if (token.startsWith("Bearer ")) {
    return token;
  }
  // Jika tidak, tambahkan "Bearer "
  return `Bearer ${token}`;
};

/**
 * Service for handling Barang API operations with authentication
 */
const BarangService = {
  /**
   * Get all barang records
   * @param accessToken - JWT Bearer token for authentication
   * @returns Promise with array of Barang
   */
  getAllBarang: async (accessToken: string): Promise<Barang[]> => {
    try {
      console.log("Token yang diterima:", accessToken);
      
      const response = await axios.get<BaseResponse<Barang[]>>(`${barangURL}/list`, {
        headers: {
          "Authorization": formatAuthHeader(accessToken),
          "Content-Type": "application/json"
        }
      });

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.data.status !== 200) {
        throw new Error("Failed to fetch barang data: " + response.data.message);
      }

      return response.data.data || [];
    } catch (error: any) {
      console.error("Error fetching all barang:", error);
      console.error("Error details:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get details of a specific barang by ID
   * @param accessToken - JWT Bearer token for authentication
   * @param id - The ID of the barang
   * @returns Promise with Barang details
   */
  getBarangById: async (accessToken: string, id: number): Promise<Barang> => {
    try {
      const response = await axios.get<BaseResponse<Barang>>(`${barangURL}/detail/${id}`, {
        headers: {
          "Authorization": formatAuthHeader(accessToken),
          "Content-Type": "application/json"
        }
      });

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error(`Barang with ID ${id} not found`);
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching barang with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new barang
   * @param accessToken - JWT Bearer token for authentication
   * @param barang - The barang data to create
   * @returns Promise with the created Barang or success message
   */
  createBarang: async (accessToken: string, barang: BarangDTO): Promise<Barang> => {
    try {
      console.log("Data yang dikirim ke API:", barang);
      
      const response = await axios.post<BaseResponse<Barang>>(`${barangURL}/create`, barang, {
        headers: {
          "Authorization": formatAuthHeader(accessToken),
          "Content-Type": "application/json"
        }
      });

      console.log("Response dari API:", response.data);
      
      // Perbarui pengecekan: Jika message berisi kata 'berhasil', anggap sukses meskipun status bukan 200
      if (response.data.message && response.data.message.toLowerCase().includes("berhasil")) {
        // Ini sukses berdasarkan pesan, meskipun mungkin status bukan 200
        return response.data.data || {} as Barang;
      }
      
      // Jika bukan sukses berdasarkan pesan, cek status dan data seperti biasa
      if (response.data.status !== 200 && response.data.status !== 201 || !response.data.data) {
        throw new Error(response.data.message || "Failed to create barang");
      }

      return response.data.data;
    } catch (error: any) {
      // Jika error berisi pesan sukses, jangan throw error
      if (error.response?.data?.message && 
          error.response.data.message.toLowerCase().includes("berhasil")) {
        console.log("Error berisi pesan sukses, menganggap operasi berhasil");
        return {} as Barang; // Return objek kosong untuk menghindari error
      }

      console.error("Error saat membuat barang:", error);
      
      // Jika error berasal dari respons API
      if (error.response) {
        throw new Error(error.response.data?.message || `Error ${error.response.status}: Gagal membuat barang`);
      } 
      // Jika error terjadi saat mengirim request
      else if (error.request) {
        throw new Error("Tidak ada respons dari server. Periksa koneksi internet Anda.");
      } 
      // Error lainnya
      else {
        throw error;
      }
    }
  },

  /**
   * Update an existing barang
   * @param accessToken - JWT Bearer token for authentication
   * @param id - The ID of the barang to update
   * @param barang - The updated barang data
   * @returns Promise with the updated Barang
   */
  updateBarang: async (accessToken: string, id: number, barang: UpdateBarangDTO): Promise<Barang> => {
    try {
      const response = await axios.put<BaseResponse<Barang>>(`${barangURL}/update/${id}`, barang, {
        headers: {
          "Authorization": formatAuthHeader(accessToken),
          "Content-Type": "application/json"
        }
      });

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error(`Failed to update barang with ID ${id}`);
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating barang with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a barang by ID
   * @param accessToken - JWT Bearer token for authentication
   * @param id - The ID of the barang to delete
   * @returns Promise with the operation result
   */
  deleteBarang: async (accessToken: string, id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.delete<BaseResponse<string>>(`${barangURL}/delete/${id}`, {
        headers: {
          "Authorization": formatAuthHeader(accessToken),
          "Content-Type": "application/json"
        }
      });

      if (response.data.status !== 200) {
        throw new Error(`Failed to delete barang with ID ${id}`);
      }

      return { 
        success: true, 
        message: response.data.data || `Barang with ID ${id} deleted successfully` 
      };
    } catch (error) {
      console.error(`Error deleting barang with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Find a barang by name
   * @param accessToken - JWT Bearer token for authentication
   * @param namaBarang - The name of the barang to find
   * @returns Promise with Barang if found, null otherwise
   */
  findBarangByNamaBarang: async (accessToken: string, namaBarang: string): Promise<Barang | null> => {
    try {
      // Since there's no direct endpoint for finding by name in the controller,
      // we'll get all barang and filter by name
      const allBarang = await BarangService.getAllBarang(accessToken);
      const foundBarang = allBarang.find(barang => barang.namaBarang === namaBarang);
      
      return foundBarang || null;
    } catch (error) {
      console.error(`Error finding barang with name ${namaBarang}:`, error);
      throw error;
    }
  },

  getLogBarang: async (kodeBarang: number): Promise<LogBarangResponseDTO[]> => {
    try {
      const response = await axios.get<BaseResponse<LogBarangResponseDTO[]>>(`${barangURL}/log/${kodeBarang}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.data.status !== 200) {
        throw new Error("Failed to fetch log barang data: " + response.data.message);
      }

      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching log barang:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        // @ts-expect-error: dynamic error shape from axios
        console.error("Error details:", error.response?.data || error.message);
      } else {
        console.error("Error details:", error);
      }
      throw error;
    }
  }
    
};

export default BarangService;