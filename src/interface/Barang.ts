// Interface that corresponds to BarangRequestDTO
export interface BarangDTO {
    namaBarang: string;
    kategoriBarang: string;
    hargaBarang: number;
    bentuk: 'satuan' | 'paket'; // Using union type to enforce the pattern constraint
  }
  
  // Interface that corresponds to BarangResponseDTO
  export interface BarangResponseDTO {
    kodeBarang: number;
    namaBarang: string;
    kategoriBarang: string;
    hargaBarang: number;
    bentuk: 'satuan' | 'paket';
    createdAt: string; // LocalDateTime converted to string in TypeScript
    updatedAt: string; // LocalDateTime converted to string in TypeScript
  }
  
  // Optional: Full Barang model interface (including deletedAt)
  export interface BarangModel extends BarangResponseDTO {
    deletedAt: string | null; // LocalDateTime converted to string, can be null
  }

export interface LogBarangResponseDTO {
  idLogBarang: number;
  kodeBarang: number;
  nomorCabang: string;
  stokSebelum: number;
  stokSesudah: number;
  idPengajuan: string;
  keterangan: string;
  waktuLog: string; 
}