import axios from "axios";
import { apiBaseURL } from "../constant";



const API_BASE_URL = `${apiBaseURL}/api/home/pusat`;

export interface StokBarangItem {
    kodeBarang: number;
    namaBarang: string;
    kategoriBarang: string;
    hargaBarang: number;
    bentuk: string;
    stokBarang: number;
    nomorCabang: string;
}

interface ApiResponse<T> {
    status: number;
    message: string;
    timestamp: string;
    data: T;
}

/**
 * Fetches a specific stock item by its code for editing
 */
export async function getStokBarangForEdit(kodeBarang: number, nomorCabang: string): Promise<StokBarangItem> {
    try {
        // Fixed endpoint path that matches the controller mapping from the error logs
        const response = await fetch(`${API_BASE_URL}/stok/${kodeBarang}/${nomorCabang}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: ApiResponse<StokBarangItem> = await response.json();
        
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        
        return data.data;
    } catch (error) {
        console.error(`Error fetching stok barang with code ${kodeBarang} for edit:`, error);
        throw error;
    }
}

/**
 * Updates an existing stock item
 */
export async function updateStokBarang(stokBarang: StokBarangItem): Promise<StokBarangItem> {
    try {
        // Fixed endpoint path to match the controller mapping
        const response = await fetch(`${API_BASE_URL}/stok/${stokBarang.kodeBarang}/${stokBarang.nomorCabang}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if needed
                // 'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(stokBarang),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        
        const data: ApiResponse<StokBarangItem> = await response.json();
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        
        return data.data;
    } catch (error) {
        console.error(`Error updating stok barang with code ${stokBarang.kodeBarang}:`, error);
        throw error;
    }
}

/**
 * Validates stock item data before submission
 */
export function validateStokBarang(item: StokBarangItem): string[] {
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
    
    if (!item.nomorCabang || item.nomorCabang.toString().trim() === '') {
        errors.push('Nomor cabang tidak valid');
    }
    
    return errors;
}