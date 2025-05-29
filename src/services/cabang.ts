import axios from 'axios';
import { apiBaseURL } from '../constant';
import { BaseResponse } from '../interface/BaseResponse';

const cabangURL = `${apiBaseURL}/api/cabang`;

const getAllCabang = async (accessToken: string): Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${cabangURL}/all`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.status !== 200) {
      return {
        status: response.data.status,
        message: response.data.data.message,
        data: [],
        timestamp: null,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Get All Cabang error: ", error)
    return {
      status: 500,
      message: "Internal Server Error",
      data: [],
      timestamp: null,
    }
  }
}

export {
  getAllCabang
};