// import axios from "axios";
// import { apiBaseURL } from "../constant";
// import { BaseResponse } from "../interface/BaseResponse";
// import {
//   EditPenggunaRequest,
//   LoginResponse,
//   Pengguna,
//   PenggunaResponse,
// } from "../interface/Pengguna";

// const authenticationURL = `${apiBaseURL}/api/auth`;

// const loginService = async (
//   username: string,
//   password: string
// ): Promise<BaseResponse> => {
//   try {
//     const response = await axios.post<BaseResponse<LoginResponse>>(
//       `${authenticationURL}/signin`,
//       {
//         username: username,
//         password: password,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error: unknown) {
//     console.error("Login error:", error);

//     // Handle 401 Unauthorized specifically
//     if (axios.isAxiosError(error) && error.response) {
//       return {
//         status: error.response.status,
//         message: error.response.data?.message || "Unauthorized",
//         data: null,
//         timestamp: null,
//       };
//     }

//     // Handle network or unexpected errors
//     return {
//       status: 500,
//       message: "An unexpected error occurred",
//       data: null,
//       timestamp: null,
//     };
//   }
// };


// const registerService = async (pengguna: Pengguna): Promise<BaseResponse> => {
//   try {
//     const response = await axios.post(`${authenticationURL}/signup`, pengguna, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (response.data.status !== 200) {
//       return {
//         status: response.data.status,
//         message: response.data.data.message,
//         data: null,
//         timestamp: null,
//       };
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Registration error:", error); // Logs actual error
//     return {
//       status: 500,
//       message: "Internal Server Error",
//       data: null,
//       timestamp: null,
//     };
//   }
// };

// const getProfileService = async (
//   accessToken: string
// ): Promise<PenggunaResponse | string> => {
//   try {
//     const response = await axios.get<BaseResponse<PenggunaResponse>>(
//       `${authenticationURL}/user`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.data.status !== 200) {
//         console.log(response.data);
//       return "Failed";
//     }
//     if (!response.data.data) {
//         console.log(response.data);
//       return "Failed";
//     }
//     return response.data.data;

//   } catch (error) {
//     console.error("Get profile error:", error); // Logs actual error
//     return "Failed"; // Ensures function always returns a string
//   }
// };

// const editProfileService = async (
//   accessToken: string,
//   pengguna: EditPenggunaRequest
// ): Promise<BaseResponse> => {
//   try {
//     const response = await axios.put(
//       `${authenticationURL}/edit-user`,
//       pengguna,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Edit profile error:", error); // Logs actual error
//     return {
//       status: 500,
//       message: "Internal Server Error",
//       data: null,
//       timestamp: null,
//     };
//   }
// };

// const getAllPengguna = async (accessToken: string): Promise<BaseResponse> => {
//   try {
//     const response = await axios.get(`${authenticationURL}/all-user`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (response.data.status !== 200) {
//       return {
//         status: response.data.status,
//         message: response.data.data.message,
//         data: null,
//         timestamp: null,
//       };
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Get all users error:", error); // Logs actual error
//     return {
//       status: 500,
//       message: "Internal Server Error",
//       data: null,
//       timestamp: null,
//     };
//   }
// };

// const changePasswordService = async (
//   accessToken: string,
//   newPassword: string,
//   oldPassword: string
// ): Promise<BaseResponse> => {
//   try {
//     const response = await axios.put(
//       `${authenticationURL}/edit-password`,
//       { oldPassword: oldPassword, 
//         newPassword: newPassword },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Change password error:", error); // Logs actual error
//     return {
//       status: 500,
//       message: "Internal Server Error",
//       data: null,
//       timestamp: null,
//     };
//   }
// };

// const getRoleService = async (accessToken: string): Promise<string> => {
//   try {
//     const response = await axios.get<BaseResponse<string>>(
//       `${authenticationURL}/role`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.data.status !== 200) {
//         return "Failed";
//     }

//     if (!response.data.data) {
//         return "Failed";
//     }
//     console.log(response.data.data);
//     return response.data.data;
//   } catch (error) {
//     console.error("Get role error:", error); // Logs actual error
//     return "Failed"; // Ensures function always returns a string
//   }
// }

// export default {
//   loginService,
//   registerService,
//   getProfileService,
//   editProfileService,
//   getAllPengguna,
//   changePasswordService,
//   getRoleService,
// };


import axios from "axios";
import { apiBaseURL } from "../constant";
import { BaseResponse } from "../interface/BaseResponse";
import {
  EditPenggunaRequest,
  LoginResponse,
  Pengguna,
  PenggunaResponse,
} from "../interface/Pengguna";

const authenticationURL = `${apiBaseURL}/api/auth`;

const loginService = async (
  username: string,
  password: string
): Promise<BaseResponse> => {
  try {
    const response = await axios.post<BaseResponse<LoginResponse>>(
      `${authenticationURL}/signin`,
      {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Login error:", error);

    // Handle 401 Unauthorized specifically
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || "Unauthorized",
        data: null,
        timestamp: null,
      };
    }

    // Handle network or unexpected errors
    return {
      status: 500,
      message: "An unexpected error occurred",
      data: null,
      timestamp: null,
    };
  }
};


const registerService = async (pengguna: Pengguna): Promise<BaseResponse> => {
  try {
    const response = await axios.post(`${authenticationURL}/signup`, pengguna, {
      headers: {
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
    console.error("Registration error:", error); // Logs actual error
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

const getProfileService = async (
  accessToken: string
): Promise<PenggunaResponse | string> => {
  try {
    const response = await axios.get<BaseResponse<PenggunaResponse>>(
      `${authenticationURL}/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status !== 200) {
        console.log(response.data);
      return "Failed";
    }
    if (!response.data.data) {
        console.log(response.data);
      return "Failed";
    }
    return response.data.data;

  } catch (error) {
    console.error("Get profile error:", error); // Logs actual error
    return "Failed"; // Ensures function always returns a string
  }
};

const editProfileService = async (
  accessToken: string,
  pengguna: EditPenggunaRequest
): Promise<BaseResponse> => {
  try {
    const response = await axios.put(
      `${authenticationURL}/edit-user`,
      pengguna,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Edit profile error:", error); // Logs actual error
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

const getAllPengguna = async (accessToken: string): Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${authenticationURL}/all-user`, {
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
    console.error("Get all users error:", error); // Logs actual error
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

const changePasswordService = async (
  accessToken: string,
  newPassword: string,
  oldPassword: string
): Promise<BaseResponse> => {
  try {
    const response = await axios.put(
      `${authenticationURL}/edit-password`,
      { oldPassword: oldPassword, 
        newPassword: newPassword },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Change password error:", error); // Logs actual error
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
};

const getRoleService = async (accessToken: string): Promise<string> => {
  try {
    const response = await axios.get<BaseResponse<string>>(
      `${authenticationURL}/role`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status !== 200) {
        return "Failed";
    }

    if (!response.data.data) {
        return "Failed";
    }
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Get role error:", error); // Logs actual error
    return "Failed"; // Ensures function always returns a string
  }
}

const getNotifikasiResponse = async (accessToken: string): Promise<BaseResponse> => {
  try {
    const response = await axios.get(`${authenticationURL}/notifikasi`, {
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
    console.error("Get all users error:", error); // Logs actual error
    return {
      status: 500,
      message: "Internal Server Error",
      data: null,
      timestamp: null,
    };
  }
}

export default {
  loginService,
  registerService,
  getProfileService,
  editProfileService,
  getAllPengguna,
  changePasswordService,
  getRoleService,
  getNotifikasiResponse
};
