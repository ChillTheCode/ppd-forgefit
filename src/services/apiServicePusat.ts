import axios from "axios";
import { apiBaseURL } from "../constant";



const API_BASE_URL = `${apiBaseURL}/api/home/pusat`;


interface ApiResponse<T> {
    status: number
    message: string
    timestamp: string
    data: T
}

interface StokCabangItem {
    kodeBarang: number
    namaBarang: string
    kategoriBarang: string
    hargaBarang: number
    bentuk: string
    stokBarang: number
    cabang?: string
}



export async function getStokCabang(): Promise<StokCabangItem[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/cabang/001`)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data: ApiResponse<StokCabangItem[]> = await response.json()

        if (!data || !data.data) {
            throw new Error("Data tidak ditemukan atau format tidak sesuai")
        }

        return data.data
    } catch (error) {
        console.error("Error fetching stok cabang data:", error)
        throw error
    }
}


