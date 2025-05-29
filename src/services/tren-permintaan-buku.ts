import axios from 'axios';
import { apiBaseURL } from "../constant";
import { BaseResponse } from "../interface/BaseResponse";

const trenBukuURL = `${apiBaseURL}/api/tren-permintaan-buku`;

const getLineGraphPermintaanSpecificCabang = async (accessToken: string, nomorCabang: string, startDate: string, endDate: string): Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${trenBukuURL}/permintaan-line-graph/${nomorCabang}/${startDate}/${endDate}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });        

    if (response.data.status !== 200) {
      return {
        status: response.data.status,
        message: response.data.data.message,
        data: null,
        timestamp: null,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Get Line Graph error: ", error)
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    }
  }
}

const getRataRataPemesananSpecificCabang = async (accessToken: string, nomorCabang: string, startDate: string, endDate: string): Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${trenBukuURL}/rata-rata-pemesanan/${nomorCabang}/${startDate}/${endDate}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });        

    if (response.data.status !== 200) {
      return {
        status: response.data.status,
        message: response.data.data.message,
        data: null,
        timestamp: null,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Get Line Graph error: ", error)
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    }
  }
}

const getLineGraphPermintaan = async (accessToken: string, startDate: string, endDate: string): Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${trenBukuURL}/permintaan-line-graph/${startDate}/${endDate}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });        

    if (response.data.status !== 200) {
      return {
        status: response.data.status,
        message: response.data.data.message,
        data: null,
        timestamp: null,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Get Line Graph error: ", error)
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    }
  }
}

const getRataRataPemesanan = async (accessToken: string, startDate: string, endDate: string): Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${trenBukuURL}/rata-rata-pemesanan/${startDate}/${endDate}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });        

    if (response.data.status !== 200) {
      return {
        status: response.data.status,
        message: response.data.data.message,
        data: null,
        timestamp: null,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Get Line Graph error: ", error)
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    }
  }
}

const getPersentasePerubahan = async (accessToken: string, startDate: string, endDate: string): Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${trenBukuURL}/persentase-perubahan/${startDate}/${endDate}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });        

    if (response.data.status !== 200) {
      return {
        status: response.data.status,
        message: response.data.data.message,
        data: null,
        timestamp: null,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Get Line Graph error: ", error)
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    }
  }
}

export {
  getLineGraphPermintaanSpecificCabang,
  getRataRataPemesananSpecificCabang,
  getLineGraphPermintaan,
  getRataRataPemesanan,
  getPersentasePerubahan
};  