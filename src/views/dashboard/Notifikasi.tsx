import { useEffect, useState } from "react";
import { 
  getAllNotifikasi, 
  getNotifikasiByRolePenerima, 
  getNotifikasiByRoleDanCabang,
  Notifikasi
} from "../../services/apiService";
import { getRoleFromToken, getBackendRole, isTokenValid } from "../authentication/authUtils";
import authenticationService from "../../services/authentication";

function NotificationPage() {
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);

  // Initialize user role and branch once on component mount
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        // Make sure we have a valid token first
        const accessToken = localStorage.getItem("accessToken");
        console.log("Access Token from localStorage:", accessToken);
        
        if (!isTokenValid()) {
          console.error("Invalid or expired token");
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
          setLoading(false);
          return;
        }
        
        // Try to get user profile data from authentication service like in Profile.tsx
        const userProfileResponse = await authenticationService.getProfileService(
          accessToken as string
        );
        
        if (!userProfileResponse) {
          console.error("Failed to fetch user profile");
          setError("Gagal memuat profil pengguna.");
          setLoading(false);
          return;
        }
        
        // Set user role and branch from the profile data
        if (typeof userProfileResponse === "string") {
          console.error("Error fetching profile:", userProfileResponse);
          setError("Gagal memuat profil pengguna: " + userProfileResponse);
        } else {
          console.log("User profile fetched successfully:", userProfileResponse);
          setCurrentUserRole(userProfileResponse.role);
          setCurrentBranch(userProfileResponse.nomorCabang);
          
          // Save to localStorage for future use
          localStorage.setItem("userRole", userProfileResponse.role);
          localStorage.setItem("userBranch", userProfileResponse.nomorCabang ?? "");
        }
        
        // Fallback to token-based role if profile fetch failed
        if (!currentUserRole) {
          // Try to get role from token
          let userRole = getRoleFromToken();
          console.log('Retrieved user role from token:', userRole);
          
          // If no role found in token, try to get from backend
          if (!userRole) {
            console.log('No role found in token, trying to get from backend');
            userRole = await getBackendRole();
            console.log('Retrieved user role from backend:', userRole);
          }
          
          if (userRole) {
            setCurrentUserRole(userRole);
          } else {
            console.warn("No role found, defaulting to admin");
            setCurrentUserRole('Admin');
          }
        }
        
        // Fallback to localStorage branch if not set from profile
        if (!currentBranch) {
          const storedBranch = localStorage.getItem("userBranch");
          if (storedBranch) {
            console.log('Retrieved user branch from localStorage:', storedBranch);
            setCurrentBranch(storedBranch);
          }
        }
      } catch (err) {
        console.error("Error initializing user data:", err);
        setError("Terjadi kesalahan saat memuat data pengguna.");
      }
    };
    
    initializeUserData();
  }, []);
  
  const fetchNotifikasi = async () => {
    try {
      setLoading(true);
      
      if (!currentUserRole) {
        console.error("No user role available");
        setError("Tidak dapat memuat notifikasi: informasi pengguna tidak tersedia");
        return;
      }
      
      console.log('Fetching notifications for role:', currentUserRole, 'and branch:', currentBranch);
      
      let data: Notifikasi[];
      
      // Admin can see all notifications
      if (currentUserRole.toUpperCase() === 'ADMIN') {
        console.log('Admin user - fetching all notifications');
        data = await getAllNotifikasi();
      } 
      // If user has both role and branch, use the combined endpoint
      else if (currentUserRole && currentBranch) {
        console.log(`Fetching notifications for role: ${currentUserRole} and branch: ${currentBranch}`);
        data = await getNotifikasiByRoleDanCabang(currentUserRole, currentBranch);
      } 
      // Otherwise just fetch by role
      else {
        data = await getNotifikasiByRolePenerima(currentUserRole);
      }
      
      // Make sure the data is correctly processed
      const processedData = data.map(item => ({
        ...item,
        tanggalNotifikasi: new Date(item.tanggalNotifikasi)
      }));
      
      setNotifikasi(processedData.sort((a, b) => 
        b.tanggalNotifikasi.getTime() - a.tanggalNotifikasi.getTime()
      ));
      setError(null);
    } catch (err) {
      console.error("Error fetching notifikasi:", err);
      setError("Gagal mengambil data notifikasi. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };
  
  // Only fetch notifications when we have the role and branch
  useEffect(() => {
    if (currentUserRole) {
      console.log('Current user role set, fetching notifications for:', currentUserRole, 'branch:', currentBranch);
      fetchNotifikasi();
      
      // Set up polling every 30 seconds to keep notifications fresh
      const interval = setInterval(() => {
        fetchNotifikasi();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [currentUserRole, currentBranch]); // This dependency ensures we fetch when role or branch changes
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  const getBorderColor = (role: string): string => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'border-purple-500';
      case 'MANAGER':
        return 'border-green-500';
      case 'USER':
        return 'border-blue-500';
      case 'STAF KEUANGAN':
        return 'border-yellow-500';
      case 'STAF GUDANG PELAKSANA UMUM':
        return 'border-indigo-500';  
      case 'DIREKTUR UTAMA':
        return 'border-red-500';
      case 'KEPALA OPERASIONAL CABANG':
        return 'border-blue-500';
      default:
        return 'border-gray-500';
    }
  };
  
  const getTimeElapsed = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} hari yang lalu`;
    } else if (diffHour > 0) {
      return `${diffHour} jam yang lalu`;
    } else if (diffMin > 0) {
      return `${diffMin} menit yang lalu`;
    } else {
      return 'Baru saja';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span className="text-blue-600 mr-2 text-xl">🔔</span>
              <h1 className="text-2xl font-bold text-gray-800">Notifikasi</h1>
              <div className="ml-3 flex gap-2">
                {currentUserRole && (
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {currentUserRole.toUpperCase()}
                  </span>
                )}
                {currentBranch && (
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                    Cabang: {currentBranch}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={fetchNotifikasi}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors py-1 px-3 border border-blue-200 rounded hover:bg-blue-50"
            >
              <span className="mr-1">🔄</span>
              Refresh
            </button>
          </div>
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Memuat data...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          {!loading && notifikasi.length === 0 && !error && (
            <div className="text-center py-8">
              <span className="mx-auto text-gray-400 text-4xl block mb-2">📭</span>
              <p className="text-gray-500">Tidak ada notifikasi saat ini</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {notifikasi.map((item) => (
            <div
              key={item.idNotifikasi}
              className={`bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4 border-l-4 ${getBorderColor(item.rolePengirim)}`}
            >
              <p className="font-medium text-gray-800 mb-2">{item.isiNotifikasi}</p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="mr-1">🕒</span>
                <span>{formatDate(item.tanggalNotifikasi)}</span>
                <span className="ml-2 text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {getTimeElapsed(item.tanggalNotifikasi)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-block text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  Dari: {item.rolePengirim}
                </span>
                <span className="inline-block text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                  Untuk: {item.rolePenerima}
                </span>
                {item.nomorCabang && (
                  <span className="inline-block text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                    Cabang: {item.nomorCabang}
                  </span>
                )}
                {item.idPengajuan && (
                  <span className="inline-block text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                    ID Pengajuan: {item.idPengajuan}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationPage;