import axios from 'axios';
import { apiBaseURL } from "../constant";
import { BaseResponse } from "../interface/BaseResponse";
import { getRoleFromToken, isTokenValid } from "../views/authentication/authUtils";

const stokMenipisURL = `${apiBaseURL}/api/stok-menipis`;

// Define allowed roles for stok menipis feature
const ALLOWED_ROLES_STOK_MENIPIS = ["Direktur Utama", "Kepala Departemen SDM dan Umum"];

// Check if user has permission to access stok menipis feature
export const hasStokMenipisAccess = (token: string): boolean => {
    if (!token || !isTokenValid()) {
        return false;
    }
    
    const userRole = getRoleFromToken();
    return ALLOWED_ROLES_STOK_MENIPIS.includes(userRole);
};

const getStokMenipis = async (accessToken: string): Promise<BaseResponse> => {
    try {
        // Check authorization first
        if (!hasStokMenipisAccess(accessToken)) {
            return {
                status: 403,
                message: "Unauthorized: You don't have permission to access this resource",
                data: null,
                timestamp: null,
            };
        }

        const response = await axios.get(stokMenipisURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (response.data.status !== 200) {
            return {
                status: response.data.status,
                message: response.data.message,
                data: null,
                timestamp: null,
            };
        }

        return response.data;
    } catch (error) {
        console.error("Get stok menipis error: ", error);
        return {
            status: 500,
            message: "Internal Server Error",
            data: null,
            timestamp: null,
        };
    }
};

const getKategoriStokMenipis = async (accessToken: string): Promise<BaseResponse> => {
    try {
        // Check authorization first
        if (!hasStokMenipisAccess(accessToken)) {
            return {
                status: 403,
                message: "Unauthorized: You don't have permission to access this resource",
                data: null,
                timestamp: null,
            };
        }

        const response = await axios.get(`${stokMenipisURL}/kategori`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (response.data.status !== 200) {
            return {
                status: response.data.status,
                message: response.data.message,
                data: null,
                timestamp: null,
            };
        }

        return response.data;
    } catch (error) {
        console.error("Get kategori stok menipis error: ", error);
        return {
            status: 500,
            message: "Internal Server Error",
            data: null,
            timestamp: null,
        };
    }
};

export { getStokMenipis, getKategoriStokMenipis };
