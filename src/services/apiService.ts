import axios from "axios";
import { apiBaseURL } from "../constant";

interface ApiResponse<T> {
    status: number;
    message: string;
    timestamp: string;
    data: T;
}

export interface Notifikasi {
    idNotifikasi: string;
    rolePengirim: string;
    rolePenerima: string;
    nomorCabang?: string; 
    isiNotifikasi: string;
    tanggalNotifikasi: Date;
    idPengajuan?: string;
}

export interface NotifikasiRequestDTO {
    rolePengirim: string;
    rolePenerima: string;
    nomorCabang?: string;
    isiNotifikasi: string;
    tanggalNotifikasi?: Date;
    idPengajuan?: string;
}

const API_BASE_URL = `${apiBaseURL}/api/notifikasi`;

const fetchWithRetry = async <T>(url: string, options?: RequestInit, retries = 3, delay = 1000): Promise<Response> => {
    try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        
        throw new Error(`HTTP error! Status: ${response.status}`);
    } catch (error) {
        if (retries <= 1) throw error;
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 1.5);
    }
};

export async function getAllNotifikasi(): Promise<Notifikasi[]> {
    try {
        const response = await fetchWithRetry(`${API_BASE_URL}`);
        const data: ApiResponse<Notifikasi[]> = await response.json();
        
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        
        const notifikasi = data.data.map(item => ({
            ...item,
            tanggalNotifikasi: new Date(item.tanggalNotifikasi)
        }));
        
        return notifikasi;
    } catch (error) {
        console.error("Error fetching all notifikasi data:", error);
        throw error;
    }
}

export async function getNotifikasiByRolePenerima(rolePenerima: string): Promise<Notifikasi[]> {
    try {
        const response = await fetchWithRetry(`${API_BASE_URL}/penerima/${rolePenerima}`);
        const data: ApiResponse<Notifikasi[]> = await response.json();
        
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        
        const notifikasi = data.data.map(item => ({
            ...item,
            tanggalNotifikasi: new Date(item.tanggalNotifikasi)
        }));
        
        return notifikasi;
    } catch (error) {
        console.error(`Error fetching notifikasi by role penerima ${rolePenerima}:`, error);
        throw error;
    }
}

export async function getNotifikasiByNomorCabang(nomorCabang: string): Promise<Notifikasi[]> {
    try {
        const response = await fetchWithRetry(`${API_BASE_URL}/cabang/${nomorCabang}`);
        const data: ApiResponse<Notifikasi[]> = await response.json();
        
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        
        const notifikasi = data.data.map(item => ({
            ...item,
            tanggalNotifikasi: new Date(item.tanggalNotifikasi)
        }));
        
        return notifikasi;
    } catch (error) {
        console.error(`Error fetching notifikasi by nomor cabang ${nomorCabang}:`, error);
        throw error;
    }
}

export async function getNotifikasiByPengajuan(idPengajuan: string): Promise<Notifikasi[]> {
    try {
        const response = await fetchWithRetry(`${API_BASE_URL}/pengajuan/${idPengajuan}`);
        const data: ApiResponse<Notifikasi[]> = await response.json();
        
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        
        const notifikasi = data.data.map(item => ({
            ...item,
            tanggalNotifikasi: new Date(item.tanggalNotifikasi)
        }));
        
        return notifikasi;
    } catch (error) {
        console.error(`Error fetching notifikasi by id pengajuan ${idPengajuan}:`, error);
        throw error;
    }
}
export async function kirimNotifikasi(
    rolePengirim: string,
    rolePenerima: string,
    isiNotifikasi: string,
    nomorCabang?: string,
    idPengajuan?: string
): Promise<Notifikasi> {
    try {
        // Method 1: Try with form data (common for Spring Boot @RequestParam)
        const formData = new FormData();
        formData.append('rolePengirim', rolePengirim);
        formData.append('rolePenerima', rolePenerima);
        formData.append('isiNotifikasi', isiNotifikasi);
        
        if (nomorCabang) {
            formData.append('nomorCabang', nomorCabang);
        }
        if (idPengajuan) {
            formData.append('idPengajuan', idPengajuan);
        }

        console.log('Sending notification with form data:', {
            rolePengirim, rolePenerima, isiNotifikasi, nomorCabang, idPengajuan
        });
        
        let response;
        
        try {
            // Try with FormData first
            response = await axios.post(`${API_BASE_URL}/kirim`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 10000
            });
        } catch (formDataError) {
            console.log('FormData failed, trying URLSearchParams...');
            
            // Method 2: Try with URLSearchParams (application/x-www-form-urlencoded)
            const params = new URLSearchParams({
                rolePengirim,
                rolePenerima,
                isiNotifikasi
            });

            if (nomorCabang) {
                params.append('nomorCabang', nomorCabang);
            }
            if (idPengajuan) {
                params.append('idPengajuan', idPengajuan);
            }
            
            response = await axios.post(`${API_BASE_URL}/kirim`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 10000
            });
        }
        
        const data: ApiResponse<Notifikasi> = response.data;
        
        if (!data || !data.data) {
            throw new Error("Response data is empty or invalid");
        }
        
        return {
            ...data.data,
            tanggalNotifikasi: new Date(data.data.tanggalNotifikasi)
        };
    } catch (error) {
        console.error("Error sending notification:", error);
        
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with error status
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else if (error.request) {
                // Request was made but no response received
                throw new Error("Network error: No response from server");
            }
        }
        
        throw error;
    }
}

export async function createNotifikasi(notifikasiRequest: NotifikasiRequestDTO): Promise<Notifikasi> {
    try {
        // Use axios for consistency
        const response = await axios.post(`${API_BASE_URL}`, notifikasiRequest, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        const data: ApiResponse<Notifikasi> = response.data;
        
        return {
            ...data.data,
            tanggalNotifikasi: new Date(data.data.tanggalNotifikasi)
        };
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
}

export async function getNotifikasiByRoleDanCabang(rolePenerima: string, nomorCabang: string): Promise<Notifikasi[]> {
    try {
        const response = await fetchWithRetry(`${API_BASE_URL}/penerima/${rolePenerima}/cabang/${nomorCabang}`);
        const data: ApiResponse<Notifikasi[]> = await response.json();
        
        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai");
        }
        
        const notifikasi = data.data.map(item => ({
            ...item,
            tanggalNotifikasi: new Date(item.tanggalNotifikasi)
        }));
        
        return notifikasi;
    } catch (error) {
        console.error(`Error fetching notifikasi by role penerima ${rolePenerima} and nomor cabang ${nomorCabang}:`, error);
        throw error;
    }
}