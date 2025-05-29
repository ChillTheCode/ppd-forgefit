import axios from "axios";
import { apiBaseURL } from "../constant";
import { BaseResponse } from "../interface/BaseResponse";
import { AddStockBarang, AddStockList } from "../interface/PengadaanPusat";

const pengadaanURL = `${apiBaseURL}/api/cabang-kerja-sama`;

const GetAllPengajuan = async (): Promise<BaseResponse> => {
  const response = await axios.get(`${pengadaanURL}/get-all-pengajuan`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response.data);

  return response.data;
};

const GetAllPengajuanByCabang = async (nomorCabang: string): Promise<BaseResponse> => {
  const response = await axios.get(`${pengadaanURL}/get-all-pengajuan/${nomorCabang}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response.data);

  return response.data;
};

const getKeteranganByIdPengajuan = async (idPengajuan: string): Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${pengadaanURL}/keterangan/${idPengajuan}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    
    console.error("Error fetching data:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
}

const getStokBarangResponseByNomorCabang = async (
  nomorCabang: string)
: Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${apiBaseURL}/api/kurang-stok-cabang/get/${nomorCabang}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    
    console.error("Error fetching data:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
}


const AddStockService = async (
  accessToken: string,
  listInputBarang: AddStockBarang[],
  nomorCabang: string
): Promise<BaseResponse> => {
  try {
    const requestData = {
      nomorCabang: nomorCabang,
      listInputBarang,
    }
    console.log(requestData);

    const response = await axios.post(
      `${pengadaanURL}/add-stock`,
      {
        "nomorCabang": nomorCabang,
        listInputBarang,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

interface stokInputStokBarang {
  kodeBarang: number;
  stokInput: number;
}

const penguranganStockService = async (
  accessToken: string,
  listInputBarang: stokInputStokBarang[],
  nomorCabang: string
): Promise<BaseResponse> => {
  try {
    const requestData = {
      nomorCabang: nomorCabang,
      listInputBarang,
    }
    console.log(requestData);

    const response = await axios.post(
      `${apiBaseURL}/api/kurang-stok-cabang/kurangi`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};


const getInformasiBarang = async (accessToken: string): Promise<string> => {
  const response = await axios.get<BaseResponse<string>>(
    `${pengadaanURL}/informasi-barang`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data.status !== 200) {
    return "Failed";
  }

  if (!response.data.data) {
    return "Failed";
  }

  return response.data.data;
};

const getPengajuan = async (
  accessToken: string,
  idPengajuan: string
): Promise<BaseResponse> => {
  try {
    const response = await axios.get(
      `${pengadaanURL}/tabel-pengadaan/${idPengajuan}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || "Unauthorized",
        data: null,
        timestamp: null,
      };
    }

    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

const persetujuanKepalaDepartemen = async (
  accessToken: string,
  idPengajuan: string,
  status: boolean,
  nomorCabang: string,
  keterangan: string
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(
      `${pengadaanURL}/departemen-sdm`,
      {
        idPengajuan: idPengajuan,
        nomorCabang: nomorCabang,
        status: status,
        keterangan: keterangan,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

const persetujuanStafKeuangan = async (
  accessToken: string,
  idPengajuan: string,
  status: boolean,
  nomorCabang: string,
  keterangan: string
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(
      `${pengadaanURL}/staf-keuangan`,
      {
        idPengajuan: idPengajuan,
        nomorCabang: nomorCabang,
        status: status,
        keterangan: keterangan,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

const pengecekanStafGudang = async (
  accessToken: string,
  idPengajuan: string,
  status: boolean,
  nomorCabang: string,
  keterangan: string
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(
      `${pengadaanURL}/staf-gudang`,
      {
        idPengajuan: idPengajuan,
        nomorCabang: nomorCabang,
        status: status,
        keterangan: keterangan,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

const pengecekanKepalaCabang = async (
  accessToken: string,
  idPengajuan: string,
  status: boolean,
  nomorCabang: string,
  keterangan: string,
  listBarang: AddStockList
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(
      `${pengadaanURL}/kepala-cabang/${nomorCabang}`,
      {
        persetujuan: {
          idPengajuan: idPengajuan,
          status: status,
          keterangan: keterangan,
          nomorCabang: nomorCabang,
        },
        listInputBarang: listBarang.listInputBarang,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

const getBarang = async (nomorCabang: string): Promise<BaseResponse> => {
  try {
    const response = await axios.get(
      `${pengadaanURL}/get-stock/${nomorCabang}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

const addKomentar = async (accessToken: string, idPengajuan: string, komentar: string): Promise<BaseResponse> => {
  try {
    const response = await axios.post(
      `${pengadaanURL}/keterangan`,
      {
        keterangan: komentar,
        idPengajuan: idPengajuan,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;

  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};


export default {
  AddStockService,
  getInformasiBarang,
  GetAllPengajuan,
  getPengajuan,
  persetujuanKepalaDepartemen,
  pengecekanStafGudang,
  getBarang,
  pengecekanKepalaCabang,
  persetujuanStafKeuangan,
  GetAllPengajuanByCabang,
  penguranganStockService,
  getStokBarangResponseByNomorCabang,
  getKeteranganByIdPengajuan,
  addKomentar
};
