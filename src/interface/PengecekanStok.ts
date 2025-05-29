import { BaseResponse } from "../interface/BaseResponse";


export interface PengecekanStokItem {
  kodeBarang: string;
  namaBarang: string;
  kategoriBarang: string;
  hargaBarang: number;
  bentuk: string;
  stokSistem: number;
  stokAktual: number;
  stokFisik: number;  // Added this property
  satuanBarang: string;  // Added this property
  lokasiBarang: string;
  perluDiperiksa: boolean;
  catatan: string;
  catatanPengecekan: string;  // Added this property
  statusPengecekan: string;
}

export interface RiwayatPengecekanResponse {
  idPengajuan: string;
  waktuPengecekan: string;
  nomorCabang: string;
  namaCabang: string;
  jumlahItem: number;
  jumlahMasalah: number;
  statusPengecekan: string;
  idPetugas: string;
  namaPetugas: string;
}


export interface CabangOption {
  value: string;
  label: string;
}


export interface PengecekanStokResponse extends BaseResponse {
  data: PengecekanStokItem[];
}





export interface CabangOptionsResponse extends BaseResponse {
  data: CabangOption[];
}


export interface SubmitPengecekanRequest {
  idPetugas: string;
  items: PengecekanStokItem[];
}


export interface UpdateStatusRequest {
  statusPengecekan: string;
}


export interface UserInfo {
  id: string;
  name: string;
  role: string;
}


export interface UpdateStokAktualRequest {
  stokAktual: number;
  catatan: string;
}