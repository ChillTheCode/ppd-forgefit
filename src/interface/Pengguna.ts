export interface Pengguna {
    namaLengkap: string,
    email: string,
    username: string,
    password: string,
    nomorTelepon: string | null,
    role: string,
    nomorCabang: string | null,
    idKaryawan: string
}

export interface PenggunaResponse {
    namaLengkap: string,
    email: string,
    username: string,
    nomorTelepon: string | null,
    role: string,
    nomorCabang: string | null,
    idKaryawan: string
    cabangAsli: boolean
}

export interface LoginInterface {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    accessType: string;
}

export interface NotifikasiResponseDTO {
    idNotifikasi: string;
    rolePengirim: string | null;
    rolePenerima: string | null;
    nomorCabang: string | null;
    isiNotifikasi: string | null;
    tanggalNotifikasi: string | null; // ISO string or null
    idPengajuan: string | null;
}

  
export interface EditPenggunaRequest {
    username: string;
    role: string | null;
    nomorCabang: string |null;
    email: string | null;
    nomorTelepon: string | null;
}