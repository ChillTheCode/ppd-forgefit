import axios from "axios";
import { apiBaseURL } from "../constant";
import { BaseResponse } from "../interface/BaseResponse";
import { AddStockList } from "../interface/PengadaanPusat";

const pengadaanURL = `${apiBaseURL}/api/pengadaan-pusat`;

const GetAllPengajuan = async (): Promise<BaseResponse> => {
  const response = await axios.get(`${pengadaanURL}/get-all-pengajuan`, {
      headers: {
          "Content-Type": "application/json"
      }
  });

  console.log(response.data)

  return response.data;
}


const AddStockService = async (
  accessToken: string,
  listBarang: AddStockList
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(`${pengadaanURL}/add-stock`, listBarang, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

const revisiPengajuan = async (accessToken: string, idPengajuan: string, listBarang: AddStockList) => {
  const response = await axios.post(
    `${pengadaanURL}/revisi-pengajuan`,
    { "idPengajuan": idPengajuan, 
      "listInputBarang": listBarang 
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data.status !== 200) {
    return "Failed";
  }

  return response.data.data.message;
};

const persetujuanKepalaDepartemen = async (
  accessToken: string,
  idPengajuan: string,
  status: boolean,
  keterangan: string
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(
      `${pengadaanURL}/departemen-sdm`,
      { idPengajuan, status, keterangan },
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
  keterangan: string
): Promise<BaseResponse> => {
  try {
    const response = await axios.post(
      `${pengadaanURL}/staf-keuangan`,
      { idPengajuan, status, keterangan},
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

const getBarang = async (): Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${pengadaanURL}/get-stock`, {
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
};

export default {
  AddStockService,
  getInformasiBarang,
  GetAllPengajuan,
  getPengajuan,
  revisiPengajuan,
  persetujuanKepalaDepartemen,
  persetujuanStafKeuangan,
  getBarang,
};
