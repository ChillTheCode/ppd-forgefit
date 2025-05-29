import axios from "axios";
import { apiBaseURL } from "../constant";
import { BaseResponse } from "../interface/BaseResponse";
import {
  PengecekanStokItem,
  RiwayatPengecekanResponse,
  UpdateStatusRequest,
  UpdateStokAktualRequest,
} from "../interface/PengecekanStok";

const pengecekanStokURL = `${apiBaseURL}/api/pengecekan-stok`;

/**
 * Get authorization headers with JWT token - WITH DEBUG LOGGING
 * @returns Headers object with Authorization and Content-Type
 */
const getAuthHeaders = () => {
  // Try multiple possible token storage keys
  const possibleTokenKeys = ['token', 'authToken', 'accessToken', 'jwt', 'bearerToken'];
  let token = null;
  let tokenSource = '';

  // Check localStorage first
  for (const key of possibleTokenKeys) {
    const localToken = localStorage.getItem(key);
    if (localToken) {
      token = localToken;
      tokenSource = `localStorage.${key}`;
      break;
    }
  }

  // If not found in localStorage, check sessionStorage
  if (!token) {
    for (const key of possibleTokenKeys) {
      const sessionToken = sessionStorage.getItem(key);
      if (sessionToken) {
        token = sessionToken;
        tokenSource = `sessionStorage.${key}`;
        break;
      }
    }
  }

  // Debug logging
  console.log('=== TOKEN DEBUG INFO ===');
  console.log('Token found:', !!token);
  console.log('Token source:', tokenSource);
  console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'null');
  console.log('Token length:', token ? token.length : 0);
  
  // Log all localStorage and sessionStorage items
  console.log('localStorage items:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = key ? localStorage.getItem(key) : null;
    if (key && value !== null) {
      console.log(`  ${key}: ${value.substring(0, 50)}...`);
    } else if (key) {
      console.log(`  ${key}: null`);
    }
  }
  
  console.log('sessionStorage items:');
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = key ? sessionStorage.getItem(key) : null;
    if (key && value !== null) {
      console.log(`  ${key}: ${value.substring(0, 50)}...`);
    } else if (key) {
      console.log(`  ${key}: null`);
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };

  console.log('Headers being sent:', headers);
  console.log('========================');

  return headers;
};

/**
 * Fetch items for stock checking from a specific branch
 * @param nomorCabang The branch number
 * @returns Promise with stock check items
 */
const fetchCabangItems = async (nomorCabang: string): Promise<BaseResponse<PengecekanStokItem[]>> => {
  try {
    console.log(`Calling fetchCabangItems for branch: ${nomorCabang}`);
    
    const response = await axios.get<BaseResponse<PengecekanStokItem[]>>(
      `${pengecekanStokURL}/inisiasi/${nomorCabang}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching branch items:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      console.error("Request headers:", error.config?.headers);
      
      if (error.response) {
        return error.response.data;
      }
    }
    
    return {
      status: 500,
      message: "Internal Server Error",
      data: [],
      timestamp: null
    };
  }
};

/**
 * Submit stock check results
 * @param nomorCabang The branch number
 * @param idPetugas The staff ID who performed the check
 * @param items The updated stock items
 * @returns Promise with response
 */
const submitPengecekan = async (
  nomorCabang: string,
  idPetugas: string,
  items: PengecekanStokItem[]
): Promise<BaseResponse<string>> => {
  try {
    console.log(`Calling submitPengecekan for branch: ${nomorCabang}`);
    
    const response = await axios.post<BaseResponse<string>>(
      `${pengecekanStokURL}/submit/${nomorCabang}?idPetugas=${idPetugas}`,
      items,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting stock check:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      
      if (error.response) {
        return error.response.data;
      }
    }
    
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null
    };
  }
};

/**
 * Fetch all stock check history
 * @returns Promise with all history data
 */
const fetchAllRiwayatPengecekan = async (): Promise<BaseResponse<RiwayatPengecekanResponse[]>> => {
  try {
    console.log("Calling fetchAllRiwayatPengecekan");
    
    const response = await axios.get<BaseResponse<RiwayatPengecekanResponse[]>>(
      `${pengecekanStokURL}/riwayat`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching history data:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      
      if (error.response) {
        return error.response.data;
      }
    }
    
    return {
      status: 500,
      message: "Internal Server Error",
      data: [],
      timestamp: null
    };
  }
};

/**
 * Fetch stock check history for a specific branch
 * @param nomorCabang The branch number
 * @returns Promise with branch history data
 */
const fetchRiwayatPengecekanByCabang = async (nomorCabang: string): Promise<BaseResponse<RiwayatPengecekanResponse[]>> => {
  try {
    const response = await axios.get<BaseResponse<RiwayatPengecekanResponse[]>>(
      `${pengecekanStokURL}/riwayat/cabang/${nomorCabang}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching branch history data:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    
    return {
      status: 500,
      message: "Internal Server Error",
      data: [],
      timestamp: null
    };
  }
};

/**
 * Fetch details of a specific stock check
 * @param idPengajuan The check ID
 * @returns Promise with detailed stock check items
 */
const fetchPengecekanDetail = async (idPengajuan: string): Promise<BaseResponse<PengecekanStokItem[]>> => {
  try {
    const response = await axios.get<BaseResponse<PengecekanStokItem[]>>(
      `${pengecekanStokURL}/detail/${idPengajuan}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching check details:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    
    return {
      status: 500,
      message: "Internal Server Error",
      data: [],
      timestamp: null
    };
  }
};

/**
 * Fetch details of a specific item in a stock check
 * @param idPengajuan The check ID
 * @param kodeBarang The item code
 * @returns Promise with detailed stock check item
 */
const fetchDetailPengecekanItem = async (idPengajuan: string, kodeBarang: string): Promise<BaseResponse<PengecekanStokItem>> => {
  try {
    const response = await axios.get<BaseResponse<PengecekanStokItem>>(
      `${pengecekanStokURL}/detail/${idPengajuan}/${kodeBarang}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching item check details:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null
    };
  }
};

/**
 * Update the status of a stock check
 * @param idPengajuan The check ID
 * @param request The status update request
 * @returns Promise with response
 */
const updateStatusPengecekan = async (
  idPengajuan: string,
  request: UpdateStatusRequest
): Promise<BaseResponse<string>> => {
  try {
    const response = await axios.put<BaseResponse<string>>(
      `${pengecekanStokURL}/update-status/${idPengajuan}`,
      request,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating check status:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null
    };
  }
};

/**
 * Update the actual stock of an item in a stock check
 * @param idPengajuan The check ID
 * @param kodeBarang The item code
 * @param request The update actual stock request containing stokAktual and catatan
 * @returns Promise with updated item data
 */
const updateStokAktual = async (
  idPengajuan: string,
  kodeBarang: string,
  request: UpdateStokAktualRequest
): Promise<BaseResponse<PengecekanStokItem>> => {
  try {
    const response = await axios.put<BaseResponse<PengecekanStokItem>>(
      `${pengecekanStokURL}/update-stok-aktual/${idPengajuan}/${kodeBarang}`,
      request,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating actual stock:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null
    };
  }
};

export default {
  fetchCabangItems,
  submitPengecekan,
  fetchAllRiwayatPengecekan,
  fetchRiwayatPengecekanByCabang,
  fetchPengecekanDetail,
  fetchDetailPengecekanItem,
  updateStatusPengecekan,
  updateStokAktual
};