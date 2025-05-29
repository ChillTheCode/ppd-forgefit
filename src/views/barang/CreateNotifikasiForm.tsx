import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { kirimNotifikasi } from "../../services/apiService";
import pengecekanStokService from "../../services/PengecekanStok";
import authenticationService from "../../services/authentication";
import { getAllCabang } from "../../services/cabang";
import { isTokenValid } from "../authentication/authUtils";

interface PreviewDataItem {
  rolePengirim: string;
  rolePenerima: string;
  nomorCabang: string;
  isiNotifikasi: string;
  tanggalNotifikasi: string;
}

interface FormDataType {
  rolePengirim: string;
  rolePenerima: string;
  nomorCabang: string;
  isiNotifikasi: string;
}

interface UserProfile {
  idKaryawan: string;
  nama: string;
  role: string;
  nomorCabang: string; 
}

interface CabangData {
  nomorCabang: string;
  nama: string;
  isCabangAsli: boolean;
}

interface PengecekanStokData {
  id?: string | number;
  idPengecekan?: string | number;
  [key: string]: unknown;
}

const KirimNotifikasiKOC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormDataType>({
    rolePengirim: "Kepala Departemen SDM dan Umum",
    rolePenerima: "Kepala Operasional Cabang",
    nomorCabang: "001",
    isiNotifikasi: "Lakukan Pengecekan Stok."
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(true);
  const [loadingCabang, setLoadingCabang] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewDataItem[]>([]);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [cabangList, setCabangList] = useState<CabangData[]>([]);
  
  // Fetch cabang data
  useEffect(() => {
    const fetchCabangData = async () => {
      setLoadingCabang(true);
      
      try {
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken || !isTokenValid()) {
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        
        const cabangResponse = await getAllCabang(accessToken);
        
        if (cabangResponse.status !== 200 || !cabangResponse.data) {
          throw new Error("Gagal memuat data cabang.");
        }
        
        console.log("Cabang data fetched successfully:", cabangResponse.data);
        
        // Ensure branch "001" is included in the list
        let cabangData: CabangData[] = Array.isArray(cabangResponse.data) ? cabangResponse.data : [];
        
        // Check if branch "001" already exists in the data
        const branch001Exists = cabangData.some((cabang: CabangData) => cabang.nomorCabang === "001");
        
        // If branch "001" doesn't exist, add it to the list
        if (!branch001Exists) {
          const branch001: CabangData = {
            nomorCabang: "001",
            nama: "Cabang Pusat", // Default name, you can change this
            isCabangAsli: true
          };
          
          // Add branch "001" at the beginning of the list for better visibility
          cabangData = [branch001, ...cabangData];
        }
        
        // Sort the list by branch number for better organization
        cabangData.sort((a: CabangData, b: CabangData) => {
          return a.nomorCabang.localeCompare(b.nomorCabang, undefined, { numeric: true });
        });
        
        setCabangList(cabangData);
        
      } catch (err) {
        console.error("Error fetching cabang data:", err);
        const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data cabang.";
        setError(errorMessage);
        
        // Even if API fails, ensure branch "001" is available as fallback
        const fallbackBranch001: CabangData = {
          nomorCabang: "001",
          nama: "Cabang Pusat",
          isCabangAsli: true
        };
        setCabangList([fallbackBranch001]);
      } finally {
        setLoadingCabang(false);
      }
    };
    
    fetchCabangData();
  }, []);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUserData(true);
      
      try {
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken || !isTokenValid()) {
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        
        // Fetch user profile from authentication service
        const userProfileResponse = await authenticationService.getProfileService(accessToken);
        
        if (!userProfileResponse) {
          throw new Error("Gagal memuat profil pengguna.");
        }
        
        if (typeof userProfileResponse === "string") {
          throw new Error("Gagal memuat profil pengguna: " + userProfileResponse);
        }
        
        console.log("User profile fetched successfully:", userProfileResponse);
        
        // Save user data
        setUserData({
          idKaryawan: userProfileResponse.idKaryawan,
          nama: userProfileResponse.namaLengkap,
          role: userProfileResponse.role,
          nomorCabang: userProfileResponse.nomorCabang ?? ""
        });
        
        // Update the form with user's branch if available
        if (userProfileResponse.nomorCabang) {
          setFormData(prev => ({
            ...prev,
            nomorCabang: userProfileResponse.nomorCabang || prev.nomorCabang
          }));
        }
        
        // Store in localStorage for future reference
        localStorage.setItem("userData", JSON.stringify({
          idKaryawan: userProfileResponse.idKaryawan,
          nama: userProfileResponse.namaLengkap,
          role: userProfileResponse.role,
          nomorCabang: userProfileResponse.nomorCabang
        }));
        
      } catch (err) {
        console.error("Error fetching user data:", err);
        const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data pengguna.";
        setError(errorMessage);
        
        // Try to get user data from localStorage as fallback
        const cachedUserData = localStorage.getItem("userData");
        if (cachedUserData) {
          try {
            const parsedUserData: UserProfile = JSON.parse(cachedUserData);
            setUserData(parsedUserData);
            console.log("Using cached user data:", parsedUserData);
          } catch (parseErr) {
            console.error("Error parsing cached user data:", parseErr);
          }
        }
      } finally {
        setLoadingUserData(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Generate preview data when form values change
  useEffect(() => {
    // Always create preview for 1 notification
    const newPreviewData: PreviewDataItem[] = [{
      rolePengirim: formData.rolePengirim,
      rolePenerima: formData.rolePenerima,
      nomorCabang: formData.nomorCabang,
      isiNotifikasi: formData.isiNotifikasi,
      tanggalNotifikasi: new Date().toISOString()
    }];
    setPreviewData(newPreviewData);
  }, [formData]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear any existing messages
    setError(null);
    setSuccessMessage(null);
  };
  
  const initiatePengecekanStok = async (nomorCabang: string) => {
    try {
      console.log("Initiating stock check for branch:", nomorCabang);
      
      // Get access token for the request
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token tidak ditemukan");
      }
      
      // First fetch the items for the branch
      console.log("Fetching items for branch:", nomorCabang);
      const itemsResponse = await pengecekanStokService.fetchCabangItems(nomorCabang);
      
      console.log("Items response:", itemsResponse);
      
      if (itemsResponse.status !== 200 || !itemsResponse.data) {
        throw new Error(`Gagal mengambil data stok cabang ${nomorCabang}: ${itemsResponse.message || 'Unknown error'}`);
      }
      
      // Get user ID from userData with proper fallback
      let idPetugas = userData?.idKaryawan;
      
      if (!idPetugas) {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            idPetugas = parsedData.idKaryawan || parsedData.id;
          } catch (parseError) {
            console.error("Error parsing stored user data:", parseError);
          }
        }
      }
      
      if (!idPetugas) {
        throw new Error("ID Petugas tidak ditemukan. Silakan login ulang.");
      }
      
      console.log("Submitting stock check with:", {
        nomorCabang,
        idPetugas,
        itemsCount: itemsResponse.data?.length || 0
      });
      
      // Submit the initial stock check
      const submitResponse = await pengecekanStokService.submitPengecekan(
        nomorCabang,
        idPetugas,
        itemsResponse.data
      );
      
      console.log("Submit response:", submitResponse);
      
      if (!submitResponse || submitResponse.status !== 200) {
        throw new Error(`Gagal membuat pengajuan pengecekan stok: ${submitResponse?.message || 'Response tidak valid'}`);
      }
      
      // Extract the ID from response data with proper typing
      let pengecekanId: string | number | null = null;
      if (submitResponse.data) {
        const responseData = submitResponse.data as unknown as PengecekanStokData;
        // Check if data is an object with id property or directly the id
        if (typeof responseData === 'object' && responseData !== null) {
          const tempId = (responseData.id ?? responseData.idPengecekan);
          pengecekanId = (typeof tempId === 'string' || typeof tempId === 'number') ? tempId : null;
        } else if (typeof responseData === 'string' || typeof responseData === 'number') {
          pengecekanId = responseData;
        } else {
          pengecekanId = null;
        }
      }
      
      console.log("Stock check created successfully with ID:", pengecekanId);
      
      return {
        success: true,
        message: submitResponse.message || "Pengecekan stok berhasil dibuat",
        id: pengecekanId
      };
      
    } catch (err) {
      console.error("Error initiating stock check:", err);
      
      // More detailed error handling
      let errorMessage = "Terjadi kesalahan saat membuat pengajuan pengecekan stok";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      }
      
      return {
        success: false,
        message: errorMessage,
        id: null
      };
    }
  };
  
  const handleSubmit = async () => {
    
    if (formData.isiNotifikasi.trim() === "") {
      setError("Isi notifikasi tidak boleh kosong");
      return;
    }
    
    if (formData.nomorCabang.trim() === "") {
      setError("Nomor cabang tidak boleh kosong");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      console.log("Starting submit process for branch:", formData.nomorCabang);
      
      // Get access token
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token tidak ditemukan. Silakan login ulang.");
      }
      
      // Validate token is still valid
      if (!isTokenValid()) {
        throw new Error("Sesi Anda telah berakhir. Silakan login ulang.");
      }
      
      let pengecekanId: string | number | null = null;
      let pengecekanMessage = "";
      
      console.log("Creating stock check...");
      
      // Always create stock check (automatic)
      const pengecekanResult = await initiatePengecekanStok(formData.nomorCabang);
      
      console.log("Stock check result:", pengecekanResult);
      
      if (!pengecekanResult.success) {
        // If stock check fails, still send notification but with different message
        console.warn("Stock check failed, but continuing with notification:", pengecekanResult.message);
        pengecekanMessage = ` (Catatan: ${pengecekanResult.message})`;
      } else {
        pengecekanId = pengecekanResult.id;
        pengecekanMessage = pengecekanId ? ` Pengecekan stok telah dibuat dengan ID: ${pengecekanId}` : "";
      }
      
      // Update notification message
      const notificationMessage = formData.isiNotifikasi + pengecekanMessage;
      
      console.log("Sending notification with message:", notificationMessage);
      
      // Send notification
      await kirimNotifikasi(
        formData.rolePengirim,
        formData.rolePenerima,
        notificationMessage,
        formData.nomorCabang,
        pengecekanId !== null && pengecekanId !== undefined ? String(pengecekanId) : undefined
      );
      
      console.log("Notification sent successfully");
      
      // Generate success message
      const selectedCabang = cabangList.find(cabang => cabang.nomorCabang === formData.nomorCabang);
      const cabangName = selectedCabang ? selectedCabang.nama : formData.nomorCabang;
      
      let successMsg = `Notifikasi berhasil dikirim ke Kepala Operasional Cabang ${cabangName} (${formData.nomorCabang})`;
      
      if (pengecekanResult.success && pengecekanId) {
        successMsg += `. Pengajuan pengecekan stok berhasil dibuat dengan ID: ${pengecekanId}`;
      } else if (!pengecekanResult.success) {
        successMsg += `. Peringatan: ${pengecekanResult.message}`;
      }
      
      setSuccessMessage(successMsg);
      
      // Redirect to inisiasi-pengecekan page after successful notification
      setTimeout(() => {
        navigate('/inisiasi-pengecekan');
      }, 3000); // Wait 3 seconds to show success message before redirecting
      
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      
      let errorMessage = "Terjadi kesalahan saat mengirim notifikasi";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        // Type-safe error handling
        const errorObj = error as Record<string, unknown>;
        if ('response' in errorObj && errorObj.response && typeof errorObj.response === 'object') {
          const response = errorObj.response as Record<string, unknown>;
          if (response.data && typeof response.data === 'object' && 'message' in response.data) {
            errorMessage = String(response.data.message);
          } else if (response.statusText) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
          }
        } else if ('message' in errorObj) {
          errorMessage = String(errorObj.message);
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Get selected cabang info for display
  const getSelectedCabangInfo = () => {
    const selectedCabang = cabangList.find(cabang => cabang.nomorCabang === formData.nomorCabang);
    return selectedCabang;
  };
  
  if (loadingUserData || loadingCabang) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">
          {loadingUserData ? "Memuat data pengguna..." : "Memuat data cabang..."}
        </span>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Kirim Notifikasi ke Kepala Operasional Cabang
        </h2>
        <p className="text-sm text-gray-600">
          Form ini akan mengirimkan notifikasi ke semua user dengan role Kepala Operasional Cabang di cabang yang dipilih dan secara otomatis membuat pengajuan pengecekan stok
        </p>
        
        {userData && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Login sebagai:</span> {userData.nama} ({userData.role})
              {userData.nomorCabang && (
                <span className="ml-2">- Cabang: {userData.nomorCabang}</span>
              )}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Sender Role - Fixed as specified */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role Pengirim
          </label>
          <input
            type="text"
            readOnly
            value={formData.rolePengirim}
            className="bg-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md cursor-not-allowed"
          />
        </div>
        
        {/* Recipient Role - Fixed as specified */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role Penerima
          </label>
          <input
            type="text"
            readOnly
            value={formData.rolePenerima}
            className="bg-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md cursor-not-allowed"
          />
        </div>
        
        {/* Branch Dropdown - User can select */}
        <div>
          <label htmlFor="nomorCabang" className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Cabang
          </label>
          <select
            id="nomorCabang"
            name="nomorCabang"
            value={formData.nomorCabang}
            onChange={handleInputChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            required
          >
            <option value="">Pilih cabang...</option>
            {cabangList.map((cabang) => (
              <option key={cabang.nomorCabang} value={cabang.nomorCabang}>
                {cabang.nomorCabang} - {cabang.nama}
                {cabang.isCabangAsli ? " (Cabang Asli)" : " (Cabang Kerja Sama)"}
              </option>
            ))}
          </select>
          
          {/* Display selected branch info */}
          {formData.nomorCabang && getSelectedCabangInfo() && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Cabang terpilih:</span> {getSelectedCabangInfo()?.nama}
                <span className="ml-2 text-xs">
                  ({getSelectedCabangInfo()?.isCabangAsli ? "Cabang Asli" : "Cabang Virtual"})
                </span>
              </p>
            </div>
          )}
          
          <p className="mt-1 text-xs text-gray-500">
            Pilih cabang tujuan untuk pengiriman notifikasi
          </p>
        </div>
        
        {/* Notification Content */}
        <div>
          <label htmlFor="isiNotifikasi" className="block text-sm font-medium text-gray-700 mb-1">
            Isi Notifikasi
          </label>
          <textarea
            id="isiNotifikasi"
            name="isiNotifikasi"
            rows={3}
            value={formData.isiNotifikasi}
            onChange={handleInputChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Masukkan isi notifikasi di sini..."
            required
          />
        </div>
  
        {/* Preview Section */}
        {previewData.length > 0 && formData.nomorCabang && (
          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Preview Notifikasi
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pengirim
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penerima
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cabang
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-500">{previewData[0].rolePengirim}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{previewData[0].rolePenerima}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {getSelectedCabangInfo() ? 
                        `${previewData[0].nomorCabang} - ${getSelectedCabangInfo()?.nama}` : 
                        previewData[0].nomorCabang
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm text-gray-700 font-medium">Isi Notifikasi:</p>
              <p className="text-sm text-gray-600 mt-1">{formData.isiNotifikasi}</p>
              
              <div className="mt-2 bg-blue-50 p-2 rounded border border-blue-100">
                <p className="text-xs text-blue-700">
                  <svg className="inline-block h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Pengajuan pengecekan stok akan dibuat secara otomatis dan akan ditautkan dengan notifikasi
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.nomorCabang}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </span>
            ) : (
              "Kirim Notifikasi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KirimNotifikasiKOC;