export interface GrafikPermintaanBukuResponse {
  monthYear: string;
  totalOrders: number;
  stokInput: number;
  stokBarangSaatIni: number;
  nomorCabang: string;
}

export interface RataRataPemesananBukuResponse {
  monthYearString: string;
  monthYear: string;
  namaBarang: string;
  averageOrders: number;
  totalOrders: number;
  nomorCabang: string;
}

export interface PersentasePerubahanPermintaanResponse {
  monthYearString: string;
  monthYear: string;
  persentasePerubahan: number;
  namaBarang: string;
  nomorCabang: string;
}