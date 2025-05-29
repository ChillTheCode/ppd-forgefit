/**
 * Interface for the Return entity
 */
export interface Return {
    idInputStokBarangReturn: string;
    idPengajuan: string | null;
    kodeBarang: number | null;
    namaBarang: string | null;
    stokBarangSaatIni: number;
    stokInput: number;
    perlakuan: 'Dibuang' | 'Dikembalikan' | 'Dijual' | 'Disumbangkan';
    hargaBarang: number | null;
    alasanReturn: string | null;
    statusApproval: 'MENUNGGU' | 'DISETUJUI' | 'DITOLAK';
    jumlahDikonfirmasi: number | null;
    statusRetur: 'PENGAJUAN' | 'DIKIRIM' | 'DITERIMA' | 'SELESAI';
  }
  
  /**
   * Interface for creating a return request
   */
  export interface ReturnRequestDTO {
    kodeBarang: number | null;
    namaBarang: string | null;
    stokInput: number;
    perlakuan: 'Dibuang' | 'Dikembalikan' | 'Dijual' | 'Disumbangkan';
    alasanReturn: string;
    idPengajuan: string | null;
  }
  
  /**
   * Interface for approving or rejecting a return
   */
  export interface ApprovalRequestDTO {
    statusApproval: 'DISETUJUI' | 'DITOLAK';
  }
  
  /**
   * Interface for confirming the received quantity of a return
   */
  export interface KonfirmasiReturnRequestDTO {
    jumlahDikonfirmasi: number;
  }
  
  /**
   * Interface for return response data
   */
  export interface ReturnResponseDTO {
    idInputStokBarangReturn: string;
    idPengajuan: string | null;
    kodeBarang: number | null;
    namaBarang: string | null;
    stokBarangSaatIni: number;
    stokInput: number;
    perlakuan: string;
    hargaBarang: number | null;
    alasanReturn: string | null;
    statusApproval: string;
    jumlahDikonfirmasi: number | null;
    statusRetur: string;
  }