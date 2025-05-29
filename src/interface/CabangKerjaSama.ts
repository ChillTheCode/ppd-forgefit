export interface CabangKerjaSama {
    nomorCabang: string,
    namaMitra: string,
    alamat: string,
    kontak: string,
    jumlahKaryawan: number,
    jamOperasional: string,
    masaBerlakuKontrak: string,
    idKaryawanKepalaOperasional: string,
}

export interface CabangKerjaSamaResponse {
    nomorCabang: string,
    namaMitra: string,
    alamat: string,
    kontak: string,
    jumlahKaryawan: number,
    jamOperasional: string,
    masaBerlakuKontrak: string,
    idKaryawanKepalaOperasional: string,
    usernameKepalaOperasionalCabang: string,
    createdAt: string,
    updatedAt: string,
}