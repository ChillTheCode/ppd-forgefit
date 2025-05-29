import axios from "axios";
import { apiBaseURL } from "../constant";
import { BaseResponse } from "../interface/BaseResponse";
import { CabangKerjaSama, CabangKerjaSamaResponse } from "../interface/CabangKerjaSama";

const cksURL = `${apiBaseURL}/api/cabang-kerjasama`;

const CabangKerjaSamaService = {
    
    getAll: async (accessToken: string): Promise<CabangKerjaSamaResponse[]> => {
        try{
            const response = await axios.get<BaseResponse<CabangKerjaSamaResponse[]>>(`${cksURL}/all`, {
                headers: {
                  "Authorization": `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                }
            });

            if (response.data.status !== 200) {
                throw new Error("Failed to fetch data cabang kerja sama")
            }
            
            return response.data.data || [];
        } catch(error) {
            console.error("Error fetching all cabang kerja sama: ", error);
            throw error;
        }
    },

    getById: async (accessToken: string, id: string): Promise<CabangKerjaSamaResponse> => {
        try{
            const response = await axios.get<BaseResponse<CabangKerjaSamaResponse>>(`${cksURL}/${id}`, {
                headers: {
                  "Authorization": `Bearer ${accessToken}`,
                  "Content-Type": "application/json"
                }
            });

            if (response.data.status !== 200 || !response.data.data) {
                throw new Error(`Cabang kerja sama with ID ${id}  not found`);
            }

            return response.data.data;
        } catch (error) {
            console.error(`Error fetching cabang kerja sama with id ${id}: `, error);
            throw error;
        }
    },

    create: async (accessToken: string, cabangKerjaSama: CabangKerjaSama): Promise<BaseResponse> => {
        try{
            console.log("Send data to API: ", cabangKerjaSama);

            const response = await axios.post<BaseResponse>(`${cksURL}/create`, cabangKerjaSama, {
                headers: {
                    Authorization : `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("Response from API: ", response.data);

            if (response.data.status !== 201 || !response.data.data) {
                throw new Error(response.data.message || "Failed to create cabang kerja sama");
            }
        
            return response.data;
        } catch (error: any) {
            console.error("Error when create cabang kerja sama: ", error);

            /*
            if (error.response) {
                throw new Error(error.response.data?.message ||  `Error ${error.response.status}: Failed to create cabang kerja sama`);
            }

            else if (error.request) {
                throw new Error("Tidak ada respons dari server. Periksa koneksi internet Anda.");
            }

            else {
                throw error;
            }
            */
            if (error.response) {
                return {
                    status: error.response.status,
                    message: error.response.data?.message || `Error ${error.response.status}: Failed to create cabang kerja sama`,
                    timestamp: new Date().toISOString(),
                    data: null
                };
            } else if (error.request) {
                return {
                    status: 500,
                    message: "Tidak ada respons dari server. Periksa koneksi internet Anda.",
                    timestamp: new Date().toISOString(),
                    data: null
                };
            } else {
                return {
                    status: 500,
                    message: error.message || "Terjadi kesalahan saat menghubungi server.",
                    timestamp: new Date().toISOString(),
                    data: null
                };
            }
        }
    },

    update:async (accessToken: string, id: string, cabangKerjaSama: CabangKerjaSama): Promise<BaseResponse> => {
        try{
            console.log("Send data to API: ", cabangKerjaSama);

            const response = await axios.put<BaseResponse>(`${cksURL}/update/${id}`, cabangKerjaSama, {
                headers: {
                    Authorization : `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("Response from API: ", response.data);

            if (response.data.status !== 200 || !response.data.data) {
                throw new Error(response.data.message || `Failed to update cabang kerja sama with ID ${id}`);
            }
        
            return response.data;
        } catch (error: any) {
            console.error("Error when update cabang kerja sama: ", error);

            /*
            if (error.response) {
                throw new Error(error.response.data?.message ||  `Error ${error.response.status}: Failed to update cabang kerja sama`);
            }

            else if (error.request) {
                throw new Error("Tidak ada respons dari server. Periksa koneksi internet Anda.");
            }

            else {
                throw error;
            }
            */
            if (error.response) {
                return {
                    status: error.response.status,
                    message: error.response.data?.message || `Error ${error.response.status}: Failed to update cabang kerja sama`,
                    timestamp: new Date().toISOString(),
                    data: null
                };
            } else if (error.request) {
                return {
                    status: 500,
                    message: "Tidak ada respons dari server. Periksa koneksi internet Anda.",
                    timestamp: new Date().toISOString(),
                    data: null
                };
            } else {
                return {
                    status: 500,
                    message: error.message || "Terjadi kesalahan saat menghubungi server.",
                    timestamp: new Date().toISOString(),
                    data: null
                };
            }
        }
    },

    delete: async (accessToken: string, id: string): Promise<{ success : boolean; message: string}> => {
        try {
            const response = await axios.delete<BaseResponse<{ message : string}>>(`${cksURL}/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });        
    
            if (response.data.status !== 200) {
                throw new Error(`Failed to delete cabang kerja sama with ID ${id}`);
            }
    
            return {
                success: true,
                message: response.data.data?.message || `Success delete cabang kerja sama with ID ${id}`
            };
        } catch (error) {
            console.error(`Error deleting cabang kerja sama with id ${id}: `, error);
            throw error;
        }
    }
}

//export default CabangKerjaSamaService;

const createCabangKerjaSamaService = async (accessToken: string, cabangKerjaSama: CabangKerjaSama): Promise<BaseResponse> => {
    try {
        const response = await axios.post(`${cksURL}/create`, cabangKerjaSama, {
            headers: {
                Authorization : `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.data.status === 201) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to create cabang kerja sama");
        }
        
    } catch (error: any) {
        console.error("Error when create cabang kerja sama: ", error);
        if (error.response) {
            return {
                status: error.response.status,
                message: error.response.data?.message || `Error ${error.response.status}: Failed to create cabang kerja sama`,
                timestamp: new Date().toISOString(),
                data: null
            };
        } else if (error.request) {
            return {
                status: 500,
                message: "Tidak ada respons dari server. Periksa koneksi internet Anda.",
                timestamp: new Date().toISOString(),
                data: null
            };
        } else {
            return {
                status: 500,
                message: error.message || "Terjadi kesalahan saat menghubungi server.",
                timestamp: new Date().toISOString(),
                data: null
            };
        }
    }
}

const getInformasiCKS = async (accessToken: string, id: string): Promise<BaseResponse> => {
    try {
        const response = await axios.get(`${cksURL}/${id}`, {
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
        console.error("Get Detail CKS error: ", error)
        return {
            status: 500,
            message: "Internal Server Error",
            data: null,
            timestamp: null,
        }
    }
}

const getAllInformasiCKS = async (accessToken: string): Promise<BaseResponse> => {
    try {
        const response = await axios.get(`${cksURL}/all`, {
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
        console.error("Get All CKS error: ", error)
        return {
            status: 500,
            message: "Internal Server Error",
            data: null,
            timestamp: null,
        }
    }
}

const updateCabangKerjaSamaService = async (accessToken: string, id: string, cabangKerjaSama: CabangKerjaSama): Promise<BaseResponse> => {
    try {
        const response = await axios.put(`${cksURL}/update/${id}`, {
            params: cabangKerjaSama,
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
        console.error("Update CKS error: ", error)
        return {
            status: 500,
            message: "Internal Server Error",
            data: null,
            timestamp: null,
        }
    }
}

const deleteCabangKerjaSamaService = async (accessToken: string, id: string): Promise<BaseResponse> => {
    try {
        const response = await axios.delete(`${cksURL}/delete/${id}`, {
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
        console.error("Delete CKS error: ", error)
        return {
            status: 500,
            message: "Internal Server Error",
            data: null,
            timestamp: null,
        }
    }
}

export {
    createCabangKerjaSamaService,
    getInformasiCKS,
    getAllInformasiCKS,
    updateCabangKerjaSamaService,
    deleteCabangKerjaSamaService,
    CabangKerjaSamaService
};  