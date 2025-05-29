import axios from "axios";
import { apiBaseURL } from "../constant";

interface ApiResponse<T> {
    status: number;
    message: string;
    timestamp: string;
    data: T;
}

export interface StokBarangItem {
    kodeBarang: number;
    namaBarang: string;
    kategoriBarang: string;
    hargaBarang: number;
    bentuk: string;
    stokBarang: number;
    nomorCabang: string;
}


const API_BASE_URL = `${apiBaseURL}/api/home/pusat`;

export async function getAllStokBarang(): Promise<StokBarangItem[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/cabang/nonpusat`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ApiResponse<StokBarangItem[]> = await response.json();
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        return data.data;
    } catch (error) {
        console.error("Error fetching all stok barang data:", error);
        throw error;
    }
}

export async function getStokBarangByKode(kodeBarang: number): Promise<StokBarangItem> {
    try {
        const response = await fetch(`${API_BASE_URL}/stok/${kodeBarang}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ApiResponse<StokBarangItem> = await response.json();
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        return data.data;
    } catch (error) {
        console.error(`Error fetching stok barang with code ${kodeBarang}:`, error);
        throw error;
    }
}

// Get stock items by category
export async function getStokBarangByKategori(kategori: string): Promise<StokBarangItem[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/kategori/${kategori}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ApiResponse<StokBarangItem[]> = await response.json();
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        return data.data;
    } catch (error) {
        console.error(`Error fetching stok barang with category ${kategori}:`, error);
        throw error;
    }
}

export async function getStokBarangByNomorCabang(nomorCabang: number): Promise<StokBarangItem[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/cabang/00${nomorCabang}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ApiResponse<StokBarangItem[]> = await response.json();
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        return data.data;
    } catch (error) {
        console.error(`Error fetching stok barang for branch ${nomorCabang}:`, error);
        throw error;
    }
}

export async function addStokBarang(stokBarang: Omit<StokBarangItem, 'kodeBarang'>): Promise<StokBarangItem> {
    try {
        const response = await fetch(`${API_BASE_URL}/stok`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stokBarang),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ApiResponse<StokBarangItem> = await response.json();
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        return data.data;
    } catch (error) {
        console.error("Error adding stok barang:", error);
        throw error;
    }
}

// Update a stock item
export async function updateStokBarang(stokBarang: StokBarangItem): Promise<StokBarangItem> {
    try {
        const response = await fetch(`${API_BASE_URL}/stok/${stokBarang.kodeBarang}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stokBarang),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
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

export async function deleteStokBarang(kodeBarang: number): Promise<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/stok/${kodeBarang}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ApiResponse<null> = await response.json();
        if (!data) {
            throw new Error("Format response tidak sesuai");
        }
        return data.message;
    } catch (error) {
        console.error(`Error deleting stok barang with code ${kodeBarang}:`, error);
        throw error;
    }
}