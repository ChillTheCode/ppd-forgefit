import { useState, useEffect } from "react";
import pengadaanpusat from "../../services/pengadaanpusat";
import { useNavigate } from "react-router-dom";
import authentication from "../../services/authentication";
import { PenggunaResponse } from "../../interface/Pengguna";
import { idPengajuan } from "../../interface/PengadaanPusat";

const ListPengadaanPusat = () => {
  const [listPengadaan, setListPengadaan] = useState<idPengajuan[]>([]);
  const [sortConfig, setSortConfig] = useState<{
      key: keyof idPengajuan | 'waktuPengajuan';
      direction: 'ascending' | 'descending';
    }>({
      key: 'waktuPengajuan',
      direction: 'descending',
    });


  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await pengadaanpusat.GetAllPengajuan();
        if (response.status !== 200) {
       
          return;
        }

        console.log(response);
        const data = response.data as idPengajuan[];
        setListPengadaan(data);
      } catch (error) {
    
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const getStepDescription = (step: string) => {
    switch (step) {
      case "1":
        return {
          text: "Menunggu Persetujuan Kepala SDM",
          color: "bg-yellow-200 text-yellow-800",
        };
      case "2":
        return {
          text: "Menunggu Persetujuan Staf Keuangan",
          color: "bg-blue-200 text-blue-800",
        };
      case "3":
        return { text: "Selesai", color: "bg-green-200 text-green-800" };
      case "0":
        return { text: "Perlu Revisi", color: "bg-red-200 text-red-800" };
      default:
        return {
          text: "Status Tidak Diketahui",
          color: "bg-gray-200 text-gray-800",
        };
    }
  };

  const handleRouting = async (idPengajuan: string, step: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      alert("Access token not found. Please log in.");
      return;
    }

    console.log("ID Pengajuan:", idPengajuan);
    console.log("Step:", step);

    try {
      const roleResponse = await authentication.getProfileService(accessToken);

      if (typeof roleResponse === "string") {
        console.error("Error:", roleResponse);
        alert("Failed to fetch user role.");
        return;
      }

      const mockPengguna: PenggunaResponse = roleResponse;
      console.log("Role:", mockPengguna.role);

      // Determine navigation based on step and role
      if (
       
        (mockPengguna.role === "Kepala Departemen SDM dan Umum" ||
          mockPengguna.role === "Staf Gudang Pelaksana Umum")
      ) {
        navigate(`/pengadaan-pusat/persetujuan-kepala-sdm/${idPengajuan}`);
      } else if ( mockPengguna.role === "Staf keuangan") {
        navigate(`/pengadaan-pusat/persetujuan-staf-keuangan/${idPengajuan}`);
      } else if (step === "2") {
        alert("Pengajuan sudah selesai.");
      } else if (step === "3") {
        alert("Pengajuan butuh revisi.");
      } else {
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error("Error retrieving user role:", error);
      alert("An error occurred while fetching role data.");
    }
  };

   interface RequestSort {
      (key: keyof idPengajuan): void;
    }

  const requestSort: RequestSort = (key) => {
      let direction: 'ascending' | 'descending' = 'ascending';
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
        // Optional: Allow cycling back to unsorted or just toggle
        direction = 'ascending'; // Or remove sort: setSortConfig({ key: null, direction: 'ascending' });
      }
      setSortConfig({ key, direction });
    };
  
  
  
    const getSortIndicator = (columnKey: keyof idPengajuan): string => {
      if (sortConfig.key === columnKey) {
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
      }
      return '↕'; // Indicate sortable
    };
  
    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
      }
    };

return (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">List Pengadaan Pusat</h1>
    {listPengadaan === null || typeof listPengadaan === 'undefined' ? (
      <div className="text-center py-10 bg-white shadow-xl rounded-lg">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    ) : (
      <>
        {listPengadaan.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID Pengajuan
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 cursor-pointer hover:bg-gray-200 transition-colors select-none"
                    onClick={() => requestSort('waktuPengajuan')}
                  >
                    Waktu Diajukan {getSortIndicator('waktuPengajuan')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {listPengadaan.map(
                  ({
                    idPengajuan,
                    step,
                    waktuPengajuan,
                  }) => {
                    const { text, color } = getStepDescription(step);
                    return (
                      <tr
                        key={idPengajuan}
                        className="bg-white border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {idPengajuan}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}
                          >
                            {text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(waktuPengajuan)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleRouting(idPengajuan, step)}
                            className="px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-300"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-white shadow-xl rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10h.01" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Tidak Ada Hasil
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Saat ini tidak ada data pengajuan yang tersedia.
            </p>
          </div>
        )}
      </>
    )}
  </div>
);
};
export default ListPengadaanPusat;
