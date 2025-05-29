export interface AddStockBarang {
  kodeBarang: string;
  stokInput: number;
}

export interface AddStockList {
  listInputBarang: AddStockBarang[];
}

export interface InputStokBarangResponse {
  kodeBarang: string;
  namaBarang: string;
  stokSaatIni: number;
  stokInput: number;
  hargaBarang: string;
}

export interface InputStokBarangTotalResponse {
  idPengajuan: string;
  listInputStokBarang: InputStokBarangResponse[];
  totalHarga: string;
}

export interface idPengajuan {
  idPengajuan: string;
  step: string;
  waktuPengajuan: string;
}

export interface idPengajuanList {
  listIdPengajuan: idPengajuan[];
}

export interface stokBarang {
  namaBarang: string;
  kodeBarang: string;
  stokBarang: number;
  hargaBarang: string;
}

export interface Barang {
  kodeBarang: number | null;
  namaBarang: string | null;
  stokSaatIni: number | null;
  stokInput: number | null;
  kategoriBarang: string | null;
  hargaBarang: number | null;
}

export interface StokBarangResponseDTO {
  kodeBarang: number;
  namaBarang: string;
  stokBarang: number;
  hargaBarang: number;
  nomorCabang: string;
  bentuk: string;
  kategoriBarang: string;
}

export interface RowData {
  kodeBarang: number;
  namaBarang: string;
  stokBarang: number; 
  inputStok: number; 
}