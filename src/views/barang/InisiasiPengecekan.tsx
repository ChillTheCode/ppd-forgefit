import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authenticationService from "../../services/authentication";
import pengecekanStokService from "../../services/PengecekanStok";
import { RiwayatPengecekanResponse } from "../../interface/PengecekanStok";
import { PenggunaResponse } from "../../interface/Pengguna";

function RiwayatPengecekanStok() {
  const navigate = useNavigate();
  
  const [riwayatList, setRiwayatList] = useState<RiwayatPengecekanResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("No access token found");
          return;
        }

        const result = await authenticationService.getProfileService(accessToken);
        
        if (result === null) {
          setError("Gagal memuat data pengguna");
          return;
        }
        
        if (typeof result === "string") {
          console.error("Error:", result);
          setError("Gagal memuat data pengguna");
          return;
        } 
        
        const userData: PenggunaResponse = result;
        setUserRole(userData.role);
        
        // Periksa apakah pengguna memiliki peran Admin atau Kepala Departemen SDM dan Umum
        const authorized = 
          userData.role === "Admin" || 
          userData.role === "Kepala Departemen SDM dan Umum";
        
        setIsAuthorized(authorized);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Terjadi kesalahan saat mengambil data pengguna");
      }
    };

    fetchUserData();
  }, []);
  
  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        setLoading(true);
        const response = await pengecekanStokService.fetchAllRiwayatPengecekan();
  
        if (response.status === 200 && response.data) {
          const mappedData: RiwayatPengecekanResponse[] = response.data.map((item: RiwayatPengecekanResponse): RiwayatPengecekanResponse => {
            return {
              idPengajuan: item.idPengajuan,
              waktuPengecekan: item.waktuPengecekan,
              nomorCabang: item.nomorCabang,
              namaCabang: item.namaCabang,
              jumlahItem: item.jumlahItem,
              jumlahMasalah: item.jumlahMasalah,
              statusPengecekan: item.statusPengecekan,
              idPetugas: item.idPetugas,
              namaPetugas: item.namaPetugas
            };
          });
          
          setRiwayatList(mappedData);
        } else {
          setError(response.message || "Gagal memuat data riwayat");
        }
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Terjadi kesalahan saat mengambil data riwayat. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRiwayat();
  }, []);

  // Format tanggal dan waktu
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Tampilan badge status
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Selesai
          </span>
        );
      case 'needs_attention':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Butuh Perhatian
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  // Navigasi ke halaman inisiasi pengecekan tanpa parameter
  const handleInisiasiPengecekan = () => {
    navigate('/inisiasi-pengecekan/notifikasi');
  };

  // Fungsi cek ulang untuk baris tertentu
  const handleCekUlang = (nomorCabang: string, idPengajuan: string) => {
    navigate(`/inisiasi-pengecekan/${nomorCabang}/${idPengajuan}`);
  };


 const handleDetailPengecekan = (nomorCabang: string, idPengajuan: string) => {
    if (isAuthorized) {
      navigate(`/pengecekan-stok/detail/${nomorCabang}/${idPengajuan}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Pengecekan Stok</h1>
            <p className="mt-2 text-sm text-gray-600">
              Daftar semua pengecekan stok yang telah dilakukan
            </p>
          </div>
            {isAuthorized && (
              <button
                type="button"
                onClick={handleInisiasiPengecekan}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Inisiasi Pengecekan
              </button>
            )}
        </div>
        
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Memuat data...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {!loading && riwayatList.length > 0 && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waktu Pengecekan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cabang
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Petugas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masalah
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {riwayatList.map((riwayat) => (
                  <tr key={riwayat.idPengajuan}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(riwayat.waktuPengecekan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{riwayat.nomorCabang}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{riwayat.namaPetugas}</div>
                      <div className="text-sm text-gray-500">{riwayat.idPetugas}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {riwayat.jumlahItem}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {riwayat.jumlahMasalah}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(riwayat.statusPengecekan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isAuthorized ? (
                        <button
                          onClick={() => handleDetailPengecekan(riwayat.nomorCabang, riwayat.idPengajuan)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Detail
                        </button>
                      ) : (
                        <span className="text-gray-400 mr-3 cursor-not-allowed">Detail</span>
                      )}
                      <button
                        onClick={() => handleCekUlang(riwayat.nomorCabang, riwayat.idPengajuan)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Cek Ulang
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && riwayatList.length === 0 && !error && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada riwayat</h3>
            <p className="mt-1 text-sm text-gray-500">
              Belum ada pengecekan stok yang dilakukan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RiwayatPengecekanStok;