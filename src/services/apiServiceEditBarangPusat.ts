import axios from "axios";
import { apiBaseURL } from "../constant";

const API_BASE_URL = `${apiBaseURL}/api/home/pusat`;

export interface StokCabangItem {
    kodeBarang: number;
    namaBarang: string;
    kategoriBarang: string;
    hargaBarang: number;
    bentuk: string;
    stokBarang: number;
    nomorCabang?: string;
}

interface ApiResponse<T> {
    status: number;
    message: string;
    timestamp: string;
    data: T;
}

/**
 * Fetches a specific stock item from a specific branch for editing
 */
export async function getStokCabangForEdit(kodeBarang: number, nomorCabang: string = "001"): Promise<StokCabangItem> {
    try {
        // Use the endpoint for fetching data from a specific branch
        const response = await fetch(`${API_BASE_URL}/stok/${kodeBarang}/${nomorCabang}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse<StokCabangItem> = await response.json();

        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }

        return data.data;
    } catch (error) {
        console.error(`Error fetching stok barang with code ${kodeBarang} for branch ${nomorCabang}:`, error);
        throw error;
    }
}

/**
 * Updates an existing stock item for a specific branch
 */
export async function updateStokCabang(stokCabang: StokCabangItem): Promise<StokCabangItem> {
    try {
        const nomorCabang = stokCabang.nomorCabang || "001";
        
        // Use the update endpoint that accepts both kodeBarang and nomorCabang
        const response = await fetch(`${API_BASE_URL}/stok/${stokCabang.kodeBarang}/${nomorCabang}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if needed
                // 'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(stokCabang),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse<StokCabangItem> = await response.json();
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }

        return data.data;
    } catch (error) {
        console.error(`Error updating stok barang with code ${stokCabang.kodeBarang}:`, error);
        throw error;
    }
}

/**
 * Validates stock item data before submission
 */
export function validateStokCabang(item: StokCabangItem): string[] {
    const errors: string[] = [];

    if (!item.namaBarang || item.namaBarang.trim() === '') {
        errors.push('Nama barang tidak boleh kosong');
    }

    if (!item.kategoriBarang || item.kategoriBarang.trim() === '') {
        errors.push('Kategori barang tidak boleh kosong');
    }

    if (!item.bentuk || item.bentuk.trim() === '') {
        errors.push('Bentuk barang tidak boleh kosong');
    }

    if (item.hargaBarang <= 0) {
        errors.push('Harga barang harus lebih dari 0');
    }

    if (item.stokBarang < 0) {
        errors.push('Stok barang tidak boleh negatif');
    }

    return errors;
}