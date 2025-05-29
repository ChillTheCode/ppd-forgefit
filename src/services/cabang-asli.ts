import axios from "axios";
import { apiBaseURL } from "../constant";
import { BaseResponse } from "../interface/BaseResponse";

// Define the interface for CabangAsli data
export interface CabangAsli {
  nomorCabang: string;
  namaCabang: string;
  alamat: string;
  kontak: string;
  jumlahKaryawan: number;
  jamOperasional: string; // Time will be serialized as string
  idKepalaOperasional: string;
  createdAt: string; // LocalDateTime will be serialized as ISO string
  updatedAt: string; // LocalDateTime will be serialized as ISO string
}

// Define type for create and update operations (omitting auto-generated fields)
export type CreateCabangAsliDTO = Omit<CabangAsli, "createdAt" | "updatedAt">;
export type UpdateCabangAsliDTO = Partial<CreateCabangAsliDTO>;

// Base URL for the API
const cabangAsliURL = `${apiBaseURL}/api/cabang-asli`;

/**
 * Service for handling CabangAsli API operations with authentication
 */
const CabangAsliService = {
  /**
   * Get all cabang asli records
   * @param accessToken - JWT Bearer token for authentication
   * @returns Promise with array of CabangAsli
   */
  getAll: async (accessToken: string): Promise<CabangAsli[]> => {
    try {
      const response = await axios.get<BaseResponse<CabangAsli[]>>(`${cabangAsliURL}/all`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.status !== 200) {
        throw new Error("Failed to fetch cabang asli data");
      }

      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching all cabang asli:", error);
      throw error;
    }
  },

  /**
   * Get details of a specific cabang asli by ID
   * @param accessToken - JWT Bearer token for authentication
   * @param id - The ID of the cabang asli
   * @returns Promise with CabangAsli details
   */
  getById: async (accessToken: string, id: string): Promise<CabangAsli> => {
    try {
      const response = await axios.get<BaseResponse<CabangAsli>>(`${cabangAsliURL}/detail/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error(`Cabang with ID ${id} not found`);
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching cabang asli with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new cabang asli
   * @param accessToken - JWT Bearer token for authentication
   * @param cabangAsli - The cabang asli data to create
   * @returns Promise with the created CabangAsli
   */
  create: async (accessToken: string, cabangAsli: CreateCabangAsliDTO): Promise<CabangAsli> => {
    try {
      console.log("Data yang dikirim ke API:", cabangAsli);
      
      const response = await axios.post<BaseResponse<CabangAsli>>(cabangAsliURL, cabangAsli, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Response dari API:", response.data);

      // Di sini masalahnya: server mengirim status 201 dengan pesan "Cabang berhasil dibuat"
      // tetapi kode menganggapnya sebagai error karena bukan status 200
      
      // Perbarui pengecekan: Jika message berisi kata 'berhasil', anggap sukses meskipun status bukan 200
      if (response.data.message && response.data.message.toLowerCase().includes("berhasil")) {
        // Ini sukses berdasarkan pesan, meskipun mungkin status bukan 200
        return response.data.data || {} as CabangAsli;
      }
      
      // Jika bukan sukses berdasarkan pesan, cek status dan data seperti biasa
      if (response.data.status !== 200 && response.data.status !== 201 || !response.data.data) {
        throw new Error(response.data.message || "Failed to create cabang asli");
      }

      return response.data.data;
    } catch (error: any) {
      // Jika error berisi pesan sukses, jangan throw error
      if (error.response?.data?.message && 
          error.response.data.message.toLowerCase().includes("berhasil")) {
        console.log("Error berisi pesan sukses, menganggap operasi berhasil");
        return {} as CabangAsli; // Return objek kosong untuk menghindari error
      }

      console.error("Error saat membuat cabang asli:", error);
      
      // Jika error berasal dari respons API
      if (error.response) {
        throw new Error(error.response.data?.message || `Error ${error.response.status}: Gagal membuat cabang`);
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
   * Update an existing cabang asli
   * @param accessToken - JWT Bearer token for authentication
   * @param id - The ID of the cabang asli to update
   * @param cabangAsli - The updated cabang asli data
   * @returns Promise with the updated CabangAsli
   */
  update: async (accessToken: string, id: string, cabangAsli: UpdateCabangAsliDTO): Promise<CabangAsli> => {
    try {
      const response = await axios.put<BaseResponse<CabangAsli>>(`${cabangAsliURL}/update/${id}`, cabangAsli, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error(`Failed to update cabang asli with ID ${id}`);
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error updating cabang asli with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a cabang asli by ID
   * @param accessToken - JWT Bearer token for authentication
   * @param id - The ID of the cabang asli to delete
   * @returns Promise with the operation result
   */
  delete: async (accessToken: string, id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.delete<BaseResponse<{ message: string }>>(`${cabangAsliURL}/delete/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.status !== 200) {
        throw new Error(`Failed to delete cabang asli with ID ${id}`);
      }

      return { 
        success: true, 
        message: response.data.data?.message || `Cabang with ID ${id} deleted successfully` 
      };
    } catch (error) {
      console.error(`Error deleting cabang asli with id ${id}:`, error);
      throw error;
    }
  },
};

export default CabangAsliService;



















// import axios from "axios";
// import { apiBaseURL } from "../constant";
// import { BaseResponse } from "../interface/BaseResponse";

// // Define the interface for CabangAsli data
// export interface CabangAsli {
//   nomorCabang: string;
//   namaCabang: string;
//   alamat: string;
//   kontak: string;
//   jumlahKaryawan: number;
//   jamOperasional: string;
//   idKepalaOperasional: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export type CreateCabangAsliDTO = Omit<CabangAsli, "createdAt" | "updatedAt">;
// export type UpdateCabangAsliDTO = Partial<CreateCabangAsliDTO>;

// // Base URL for the API
// const cabangAsliURL = `${apiBaseURL}/api/cabang-asli`;

// // Buat instance axios tanpa header Authorization
// const api = axios.create({
//   baseURL: apiBaseURL,
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

// /**
//  * Service for handling CabangAsli API operations without authentication
//  */
// const CabangAsliService = {
//   /**
//    * Get all cabang asli records
//    * @returns Promise with array of CabangAsli
//    */
//   getAll: async (): Promise<CabangAsli[]> => {
//     try {
//       const response = await api.get<BaseResponse<CabangAsli[]>>(`/api/cabang-asli/all`);

//       if (response.data.status !== 200) {
//         throw new Error("Failed to fetch cabang asli data");
//       }

//       return response.data.data || [];
//     } catch (error) {
//       console.error("Error fetching all cabang asli:", error);
//       throw error;
//     }
//   },

//   /**
//    * Get details of a specific cabang asli by ID
//    * @param id - The ID of the cabang asli
//    * @returns Promise with CabangAsli details
//    */
//   getById: async (id: string): Promise<CabangAsli> => {
//     try {
//       const response = await api.get<BaseResponse<CabangAsli>>(`/api/cabang-asli/detail/${id}`);

//       if (response.data.status !== 200 || !response.data.data) {
//         throw new Error(`Cabang with ID ${id} not found`);
//       }

//       return response.data.data;
//     } catch (error) {
//       console.error(`Error fetching cabang asli with id ${id}:`, error);
//       throw error;
//     }
//   },

//   /**
//    * Create a new cabang asli
//    * @param cabangAsli - The cabang asli data to create
//    * @returns Promise with the created CabangAsli
//    */
//   create: async (cabangAsli: CreateCabangAsliDTO): Promise<CabangAsli> => {
//     try {
//       const response = await api.post<BaseResponse<CabangAsli>>(`/api/cabang-asli`, cabangAsli);

//       if (response.data.status !== 200 || !response.data.data) {
//         throw new Error("Failed to create cabang asli");
//       }

//       return response.data.data;
//     } catch (error) {
//       console.error("Error creating cabang asli:", error);
//       throw error;
//     }
//   },

//   /**
//    * Update an existing cabang asli
//    * @param id - The ID of the cabang asli to update
//    * @param cabangAsli - The updated cabang asli data
//    * @returns Promise with the updated CabangAsli
//    */
//   update: async (id: string, cabangAsli: UpdateCabangAsliDTO): Promise<CabangAsli> => {
//     try {
//       const response = await api.put<BaseResponse<CabangAsli>>(`/api/cabang-asli/update/${id}`, cabangAsli);

//       if (response.data.status !== 200 || !response.data.data) {
//         throw new Error(`Failed to update cabang asli with ID ${id}`);
//       }

//       return response.data.data;
//     } catch (error) {
//       console.error(`Error updating cabang asli with id ${id}:`, error);
//       throw error;
//     }
//   },

//   /**
//    * Delete a cabang asli by ID
//    * @param id - The ID of the cabang asli to delete
//    * @returns Promise with the operation result
//    */
//   delete: async (id: string): Promise<{ success: boolean; message: string }> => {
//     try {
//       const response = await api.delete<BaseResponse<{ message: string }>>(`/api/cabang-asli/delete/${id}`);

//       if (response.data.status !== 200) {
//         throw new Error(`Failed to delete cabang asli with ID ${id}`);
//       }

//       return { 
//         success: true, 
//         message: response.data.data?.message || `Cabang with ID ${id} deleted successfully` 
//       };
//     } catch (error) {
//       console.error(`Error deleting cabang asli with id ${id}:`, error);
//       throw error;
//     }
//   },
// };

// export default CabangAsliService;