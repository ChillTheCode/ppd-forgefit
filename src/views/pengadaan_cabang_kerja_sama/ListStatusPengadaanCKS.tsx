import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authentication from "../../services/authentication";
import { PenggunaResponse } from "../../interface/Pengguna";
import { idPengajuan } from "../../interface/CabangAsli";
import pengadaanCKSservice from "../../services/pengadaanCKSservice";

const ListStatusPengadaanCKS = () => {
  const { nomorCabang } = useParams<{ nomorCabang: string }>();
  const [listPengadaan, setListPengadaan] = useState<idPengajuan[]>([]);
  const [emptyList, setEmptyList] = useState<boolean>(false);
  const [roleUser, setRoleUser] = useState<string | null>(null);
  const [userCabang, setUserCabang] = useState<string | null>(null);
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
          const response = await pengadaanCKSservice.GetAllPengajuanByCabang(
            nomorCabang
          );
          if (response.status !== 200) {
            setEmptyList(true);
            return;
          }

          console.log(response);
          const data = response.data as idPengajuan[];
          setListPengadaan(data);
        } else {
          const response = await pengadaanCKSservice.GetAllPengajuan();
          if (response.status !== 200) {
            setEmptyList(true);
            return;
          }

          console.log(response);
          const data = response.data as idPengajuan[];
          setListPengadaan(data);
        }
      } catch (error) {
        setEmptyList(true);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [nomorCabang]);

  if (emptyList) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">List Pengadaan Pusat</h1>
        <p className="text-gray-500">Belum ada pengajuan</p>
      </div>
    );
  }

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
          color: "bg-green-200 text-yellow-800",
        };
      case "3":
        return {
          text: "Menunggu Persetujuan Staf Gudang",
          color: "bg-blue-200 text-purple-800",
        };
      case "4":
        return {
          text: "Menunggu Konfirmasi Kepala Operasional Cabang",
          color: "bg-blue-200 text-blue-800",
        };
      case "5":
        return { text: "Selesai", color: "bg-red-200 text-hold-800" };
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
      if (mockPengguna.role === "Kepala Departemen SDM dan Umum") {
        navigate(
          `/pengadaan-cabang-kerja-sama/persetujuan-kepala-sdm/${idPengajuan}`
        );
      } else if (mockPengguna.role === "Staf keuangan") {
        navigate(
          `/pengadaan-cabang-kerja-sama/persetujuan-staf-keuangan/${idPengajuan}`
        );
      } 
      else if (mockPengguna.role === "Staf Gudang Pelaksana Umum") {
        navigate(
          `/pengadaan-cabang-kerja-sama/persetujuan-staf-gudang/${idPengajuan}`
        );
      }  else if (mockPengguna.role === "Kepala Operasional Cabang") {
        navigate(
          `/pengadaan-cabang-kerja-sama/persetujuan-kepala-cabang/${idPengajuan}`
        );
      } else if (step === "3") {
        alert("Pengajuan sudah selesai.");
      } else if (step === "4") {
        alert("Pengajuan butuh revisi.");
      } else {
        navigate("/unauthorized");
      }
    } catch (error) {
      console.error("Error retrieving user role:", error);
      alert("An error occurred while fetching role data.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">List Pengadaan Cabang Kerja Sama</h1>
      <p className="text-gray-500 mb-4">Nomor Cabang {nomorCabang}</p>
      <p className="text-gray-500 mb-4">Nomor Cabang Anda {userCabang}</p>
      <p className="text-gray-500 mb-4">Role User {roleUser}</p>
      {listPengadaan != null ? (
        <div className="space-y-4">
          {listPengadaan.map(
            ({
              idPengajuan,
              step,
              waktuPengajuan,
              nomorCabangAsal,
              nomorCabangTujuan,
            }) => {
              const { text, color } = getStepDescription(step);

              return (
                <div
                  key={idPengajuan}
                  className="bg-white shadow-lg rounded-lg p-4 border"
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    {idPengajuan}
                  </h2>
                  <p
                    className={`inline-block px-3 py-1 mt-2 rounded-md text-sm font-medium ${color}`}
                  >
                    {text}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Waktu Diajukan {waktuPengajuan}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Nomor Cabang Asal {nomorCabangAsal}
                  </p>
                  <p className="text-gray-600 mt-2">
                    Nomor Cabang Tujuan {nomorCabangTujuan}
                  </p>
                  <button
                    onClick={() => handleRouting(idPengajuan, step)}
                    className="ms-5 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Lihat Detail
                  </button>
                </div>
              );
            }
          )}
        </div>
      ) : (
        <p className="text-gray-500">Memuat data atau tidak ada pengajuan.</p>
      )}
    </div>
  );
};

export default ListStatusPengadaanCKS;
