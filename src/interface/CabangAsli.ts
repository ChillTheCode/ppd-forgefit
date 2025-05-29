// Interface yang sesuai dengan CabangAsliDTO
export interface CabangAsliDTO {
    nomorCabang: string;
    namaCabang: string;
    alamat: string;
    kontak: string;
    jumlahKaryawan: number;
    jamOperasional: string; // Time dalam SQL dikonversi ke string di TypeScript
    idKepalaOperasional: string;
  }
  
  // Interface yang sesuai dengan CabangAsliResponseDTO
  export interface CabangAsliResponseDTO {
    nomorCabang: string;
    namaCabang: string;
    alamat: string;
    kontak: string;
    jumlahKaryawan: number;
    jamOperasional: string; // Time dalam SQL dikonversi ke string di TypeScript
    idKepalaOperasional: string;
    createdAt: string; // LocalDateTime dikonversi ke string di TypeScript
    updatedAt: string; // LocalDateTime dikonversi ke string di TypeScript
  }

  export interface stokBarang {
    namaBarang: string;
    kodeBarang: string;
    stokBarang: number;
    hargaBarang: string;
    stokBarangPusat: number;
  }

  export interface idPengajuan {
    idPengajuan: string;
    step: string;
    waktuPengajuan: string;
    nomorCabangAsal: string;
    flag: boolean;
    nomorCabangTujuan: string;
  }
  
  export interface InputStokBarangTotalResponse {
    idPengajuan: string;
    listInputStokBarang: InputStokBarangResponse[];
    totalHarga: string;
  }

export interface InputStokBarangResponse {
  kodeBarang: string;
  namaBarang: string;
  stokSaatIni: number;
  stokInput: number;
  hargaBarang: string;
  stokPusatSaatIni: number;
}

export interface InputStokBarangTotalResponse {
  idPengajuan: string;
  listInputStokBarang: InputStokBarangResponse[];
  totalHarga: string;
  step: number;
  flag: boolean;
  nomorCabang: string;
}
