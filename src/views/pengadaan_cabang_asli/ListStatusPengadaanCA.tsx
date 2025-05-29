import { useState, useEffect, useMemo } from "react";
import pengadaanCAservice from "../../services/pengadaanCAservice";
import { useNavigate, useParams } from "react-router-dom";
import authentication from "../../services/authentication";
import { PenggunaResponse } from "../../interface/Pengguna";
import { idPengajuan } from "../../interface/CabangAsli";

const ListStatusPengadaanCA = () => {
  const { nomorCabang } = useParams<{ nomorCabang: string }>();
  const [listPengadaan, setListPengadaan] = useState<idPengajuan[]>([]);
  const [roleUser, setRoleUser] = useState<string | null>(null);
  const [userCabang, setUserCabang] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof idPengajuan | 'waktuPengajuan';
    direction: 'ascending' | 'descending';
  }>({
    key: 'waktuPengajuan',
    direction: 'descending',
  });
  const [tujuanFilter, setTujuanFilter] = useState(''); // '' means show all
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found");
          alert("Access token not found. Please log in.");
          return;
        }

        const roleResponse = await authentication.getProfileService(
          accessToken
        );

        if (typeof roleResponse === "string") {
          console.error("Error:", roleResponse);
          alert("Failed to fetch user role.");
          return;
        }

        const mockPengguna: PenggunaResponse = roleResponse;
        setRoleUser(mockPengguna.role);
        setUserCabang(mockPengguna.nomorCabang);

        if (!nomorCabang) {
          console.error("Nomor cabang is undefined");
          alert(
            "Nomor cabang is undefined. Please provide a valid cabang number."
          );
          return;
        }

        if (nomorCabang !== mockPengguna.nomorCabang) {
          console.error("Nomor Cabang not found");
          return;
        }

        if (nomorCabang !== "001") {
          const response = await pengadaanCAservice.GetAllPengajuanByCabang(
            nomorCabang
          );
          if (response.status !== 200) {
          
            return;
          }

          console.log(response);
          const data = response.data as idPengajuan[];
          setListPengadaan(data);
        } else {
          const response = await pengadaanCAservice.GetAllPengajuan();
          if (response.status !== 200) {
            
            return;
          }

          console.log(response);
          const data = response.data as idPengajuan[];
          setListPengadaan(data);
        }
      } catch (error) {
        
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [nomorCabang]);

  const uniqueCabangTujuan = useMemo(() => {
    if (!listPengadaan || listPengadaan.length === 0) return ['']; // Only "All" option
    const cabangSet = new Set(
      listPengadaan
        .map(item => item.nomorCabangTujuan)
        .filter(cabang => cabang != null && String(cabang).trim() !== '') // Ensure valid, non-empty strings
    );
    const sortedCabang = Array.from(cabangSet).sort((a, b) => String(a).localeCompare(String(b)));
    return ['', ...sortedCabang]; // Add '' for "Semua Cabang Tujuan"
  }, [listPengadaan]);

  const processedListPengadaan = useMemo(() => {
    if (!listPengadaan) return [];

    let items = [...listPengadaan];

    // 1. Apply filter by nomorCabangTujuan
    if (tujuanFilter && tujuanFilter !== '') {
      items = items.filter(
        (item) => String(item.nomorCabangTujuan) === tujuanFilter
      );
    }

    // 2. Apply sort
    if (sortConfig.key !== null) {
      items.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (sortConfig.key === 'waktuPengajuan') {
          const dateA = new Date(a.waktuPengajuan);
          const dateB = new Date(b.waktuPengajuan);
          if (dateA < dateB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (dateA > dateB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }

        // Add other type handling if needed (e.g., numbers for other sortable columns)
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return items;
  }, [listPengadaan, sortConfig, tujuanFilter]);

  interface RequestSort {
    (key: keyof idPengajuan): void;
  }



  const getStepDescription = (step: string) => {
    switch (step) {
      case "0":
        return {
          text: "Ditolak",
          color: "bg-red-100 text-red-700",
        }
      case "1":
        return {
          text: "Menunggu Persetujuan Kepala SDM",
          color: "bg-yellow-100 text-yellow-700",
        };
      case "2":
        return {
          text: "Menunggu Persetujuan Staf Keuangan",
          color: "bg-indigo-100 text-indigo-700",
        };
      case "3":
        return {
          text: "Menunggu Konfirmasi Staf Gudang Pelaksana Umum",
          color: "bg-blue-100 text-blue-700",
        };
      case "4":
        return {
          text: "Menunggu Konfirmasi Kepala Operasional Cabang",
          color: "bg-amber-100 text-amber-700", 
        };
      case "5":
        return {
          text: "Selesai",
          color: "bg-green-100 text-green-700",
        };
      case "6":
        return {
          text: "Pending (Stok Tidak Cukup)",
          color: "bg-orange-100 text-orange-700",
        }
      default:
        return {
          text: "Status Tidak Diketahui",
          color: "bg-gray-100 text-gray-700",
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
      if (mockPengguna.role === "Kepala Departemen SDM dan Umum") {
        navigate(
          `/pengadaan-cabang-asli/persetujuan-kepala-sdm/${idPengajuan}`
        );
      } else if (mockPengguna.role === "Staf keuangan") {
        navigate(
          `/pengadaan-cabang-kerja-sama/persetujuan-staf-keuangan/${idPengajuan}`
        );
      }
      else if (mockPengguna.role === "Staf Gudang Pelaksana Umum") {
        navigate(
          `/pengadaan-cabang-asli/persetujuan-staf-gudang/${idPengajuan}`
        );
      } else if (mockPengguna.role === "Kepala Operasional Cabang") {
        navigate(
          `/pengadaan-cabang-asli/persetujuan-kepala-cabang/${idPengajuan}`
        );
      } else if (step === "5") {
        alert("Pengajuan sudah selesai.");
      } else if (step === "8") {
        alert("Pengajuan butuh revisi.");
      } else {
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error("Error retrieving user role:", error);
      alert("An error occurred while fetching role data.");
    }
  };

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {roleUser === "Kepala Operasional Cabang"
          ? "List Pengadaan Cabang Asli dan Kerja Sama"
          : "List Pengadaan Cabang Asli dan Kerja Sama"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Nomor Cabang Anda</p>
          <p className="text-lg font-semibold text-gray-700">{userCabang || 'N/A'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">Role Anda</p>
          <p className="text-lg font-semibold text-gray-700">{roleUser || 'N/A'}</p>
        </div>
      </div>

      {/* Loading State */}
      {listPengadaan === null && (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Memuat data...</h3>
          <p className="mt-1 text-sm text-gray-500">Silakan tunggu sebentar.</p>
        </div>
      )}

      {listPengadaan && listPengadaan.length === 0 && (
         <div className="text-center py-10 bg-white shadow-xl rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada pengajuan.</h3>
          <p className="mt-1 text-sm text-gray-500">Belum ada data pengadaan untuk ditampilkan.</p>
        </div>
      )}

      {/* Data Exists - Show Filters and Table/NoResults */}
      {listPengadaan && listPengadaan.length > 0 && (
        <>
          {/* Filter UI */}
          
          {roleUser !== "Kepala Operasional Cabang" && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <label htmlFor="tujuanFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter Nomor Cabang Tujuan:
            </label>
            <select
              id="tujuanFilter"
              name="tujuanFilter"
              className="mt-1 block w-full md:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              value={tujuanFilter}
              onChange={(e) => setTujuanFilter(e.target.value)}
            >
              {uniqueCabangTujuan.map((cabang) => (
                <option key={cabang === '' ? 'all-tujuan' : cabang} value={cabang}>
                  {cabang === '' ? 'Semua Cabang Tujuan' : cabang}
                </option>
              ))}
            </select>
          </div>
        )}

          {processedListPengadaan.length > 0 ? (
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
                    <th scope="col" className="px-6 py-3">
                      Cabang Asal
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Cabang Tujuan
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processedListPengadaan.map(
                    ({
                      idPengajuan,
                      step,
                      waktuPengajuan,
                      nomorCabangAsal,
                      nomorCabangTujuan,
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
                          <td className="px-6 py-4">{nomorCabangAsal}</td>
                          <td className="px-6 py-4">{nomorCabangTujuan}</td>
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
                Tidak ada pengajuan yang cocok dengan filter Nomor Cabang Tujuan "{tujuanFilter}".
                Coba ubah filter Anda atau pilih "Semua Cabang Tujuan".
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListStatusPengadaanCA;
