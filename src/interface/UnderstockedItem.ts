export interface UnderstockedItemDTO {
  kodeBarang: string;
  namaBarang: string;
  kategoriBarang: string;
  stokDiminta: number;
  stokPusat: number;
  namaCabang: string;
  status: string;
}

export interface CabangDTO {
  nomorCabang: string;
  namaCabang: string;
  type: string;
}