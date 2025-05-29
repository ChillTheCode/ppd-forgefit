export interface StokMenipisResponse {
    kodeBarang: string;
    namaBarang: string;
    kategoriBarang: string;
    stokTerkini: number;
    stokMinimum: number;
    stokBarang: number;
    status: string; // "KRITIS" atau "WARNING"
}