import axios from "axios";
import { apiBaseURL } from "../constant";
import { BaseResponse } from "../interface/BaseResponse";
import { getRoleFromToken, isTokenValid } from "../views/authentication/authUtils";

const understockedURL = `${apiBaseURL}/api/stok-understocked`;

// Define allowed roles for understocked items feature
const ALLOWED_ROLES_UNDERSTOCKED = ["Direktur Utama", "Kepala Departemen SDM dan Umum"];

// Check if user has permission to access understocked items feature
export const hasUnderstockedItemsAccess = (token: string): boolean => {
    if (!token || !isTokenValid()) {
        return false;
    }
    
    const userRole = getRoleFromToken();
    return ALLOWED_ROLES_UNDERSTOCKED.includes(userRole);
};

export interface UnderstockedItemDTO {
  kodeBarang: string;
  namaBarang: string;
  kategoriBarang: string;
  stokDiminta: number;
  stokPusat: number;
  namaCabang: string;
  status: string;
}

export interface CabangDTO {
  nomorCabang: string;
  namaCabang: string;
  type: string;
}

// Get all understocked items with optional filtering
export const getUnderstockedItems = async (
  accessToken: string,
  kategori?: string,
  cabang?: string
): Promise<BaseResponse> => {
  try {
    // Check authorization first
    if (!hasUnderstockedItemsAccess(accessToken)) {
      return {
        status: 403,
        message: "Unauthorized: You don't have permission to access this resource",
        data: null,
        timestamp: null,
      };
    }

    let url = understockedURL;
    const params: Record<string, string> = {};
    
    if (kategori) params.kategori = kategori;
    if (cabang) params.cabang = cabang;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching understocked items:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

// Get all categories for filtering
export const getKategoriOptions = async (accessToken: string): Promise<BaseResponse> => {
  try {
    // Check authorization first
    if (!hasUnderstockedItemsAccess(accessToken)) {
      return {
        status: 403,
        message: "Unauthorized: You don't have permission to access this resource",
        data: null,
        timestamp: null,
      };
    }

    const response = await axios.get(`${understockedURL}/kategori`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching kategori options:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

// Get all branches for filtering
export const getCabangOptions = async (accessToken: string): Promise<BaseResponse> => {
  try {
    // Check authorization first
    if (!hasUnderstockedItemsAccess(accessToken)) {
      return {
        status: 403,
        message: "Unauthorized: You don't have permission to access this resource",
        data: null,
        timestamp: null,
      };
    }

    const response = await axios.get(`${understockedURL}/cabang`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching cabang options:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

