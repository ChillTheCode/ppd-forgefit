import { BaseResponse } from "../interface/BaseResponse";
import { getRoleFromToken, isTokenValid } from "../views/authentication/authUtils";
import { hasStokMenipisAccess } from "./stokMenipis";
import { hasUnderstockedItemsAccess } from "./understockedItemService";

// Define allowed roles for stok rekomendasi feature
const ALLOWED_ROLES_STOK_REKOMENDASI = ["Direktur Utama", "Kepala Departemen SDM dan Umum"];

// Check if user has permission to access stok rekomendasi feature
export const hasStokRekomendasiAccess = (token: string): boolean => {
    if (!token || !isTokenValid()) {
        return false;
    }
    
    const userRole = getRoleFromToken();
    return ALLOWED_ROLES_STOK_REKOMENDASI.includes(userRole);
};

// Check authorization for specific tab
export const checkTabAccess = (token: string, tab: string): BaseResponse => {
    if (!token || !isTokenValid()) {
        return {
            status: 401,
            message: "Unauthorized: Invalid or expired token",
            data: null,
            timestamp: null,
        };
    }

    let hasAccess = false;
    
    switch (tab) {
        case "menipis":
            hasAccess = hasStokMenipisAccess(token);
            break;
        case "understocked":
            hasAccess = hasUnderstockedItemsAccess(token);
            break;
        default:
            hasAccess = hasStokRekomendasiAccess(token);
    }
    
    if (!hasAccess) {
        return {
            status: 403,
            message: "Forbidden: You don't have permission to access this resource",
            data: null,
            timestamp: null,
        };
    }
    
    return {
        status: 200,
        message: "Access granted",
        data: true,
        timestamp: new Date().toISOString(),
    };
};