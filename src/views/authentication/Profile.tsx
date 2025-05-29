import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authenticationService from "../../services/authentication";
import { PenggunaResponse } from "../../interface/Pengguna";
import ErrorModal from "../../components/Error";
import { NotifikasiResponseDTO } from "../../interface/Pengguna";


const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pengguna, setPengguna] = useState<PenggunaResponse | null>(null);
  const [errorModal, setErrorModal] = useState<{
    status: number;
    errorMessage: string;
    timestamp: string;
  } | null>(null);
  const [notifications, setNotifications] = useState<NotifikasiResponseDTO[]>([]);

  useEffect(() => {
    try {
      const fetchUserProfile = async () => {
        setTimeout(async () => {
          if (localStorage.getItem("accessToken") === null) {
            console.log("No access token found");
          }

          const result = await authenticationService.getProfileService(
            localStorage.getItem("accessToken") as string
          );

          if(result == null) {
            setErrorModal({
              status: 500,
              errorMessage: "Internal Server Error",
              timestamp: new Date().toISOString(),
            })
          }

          const notificationResponse = await authenticationService.getNotifikasiResponse(
            localStorage.getItem("accessToken") as string
          )

          if(notificationResponse == null) {
            setErrorModal({
              status: 500,
              errorMessage: "Internal Server Error",
              timestamp: new Date().toISOString(),
            })
          }

          if (notificationResponse && Array.isArray(notificationResponse.data)) {
            const sortedNotifications = sortNotificationsByDate(notificationResponse.data);
            setNotifications(sortedNotifications as NotifikasiResponseDTO[]);
          } else {
            setErrorModal({
              status: 500,
              errorMessage: "Invalid notification response format",
              timestamp: new Date().toISOString(),
            });
          }

          if (typeof result === "string") {
            console.error("Error:", result);
          } else {
            const mockPengguna: PenggunaResponse = result;
            setPengguna(mockPengguna);
          }

          setLoading(false);
        }, 800);
      };

      fetchUserProfile();
    } catch {
      setErrorModal({
        status: 500,
        errorMessage: "Internal Server Error",
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  
const formatDate = (isoDate: string | null): string => {
  if (!isoDate) return "Tanggal tidak tersedia";
  const date = new Date(isoDate);
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Staf keuangan":
        return "bg-green-100 text-green-800";
      case "Direktur Utama":
        return "bg-red-100 text-red-800";
      case "Kepala Operasional Cabang":
        return "bg-blue-100 text-blue-800";
      case "Staf Gudang Pelaksana Umum":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortNotificationsByDate = (
  notificationsToSort: NotifikasiResponseDTO[]
): NotifikasiResponseDTO[] => {
  return [...notificationsToSort].sort((a, b) => {
    if (a.tanggalNotifikasi === null && b.tanggalNotifikasi === null) return 0;
    if (a.tanggalNotifikasi === null) return 1;
    if (b.tanggalNotifikasi === null) return -1;
    const dateA = new Date(a.tanggalNotifikasi).getTime();
    const dateB = new Date(b.tanggalNotifikasi).getTime();
    return dateB - dateA;
  });
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        {errorModal && (
          <ErrorModal
            status={errorModal.status}
            errorMessage={errorModal.errorMessage}
            timestamp={errorModal.timestamp}
            onClose={() => setErrorModal(null)} // Close the modal when clicking "Close"
          />
        )}
        <div className="p-4 max-w-md w-full">
          <div className="flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-center mt-2 text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const PlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );

  if (!pengguna) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="p-4 max-w-md w-full bg-white rounded-lg shadow">
          <p className="text-center text-red-600">
            Data pengguna tidak ditemukan.
          </p>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 bg-blue-600">
            <h1 className="text-lg leading-6 font-medium text-white">
              Profil Pengguna
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-blue-100">
              Detail informasi dan pengaturan akun
            </p>
          </div>

          {/* Profile Info */}
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 rounded-full h-16 w-16 flex items-center justify-center text-white text-xl font-bold">
                {pengguna.namaLengkap
                  ? pengguna.namaLengkap
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()
                  : ""}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {pengguna.namaLengkap}
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                    pengguna.role
                  )}`}
                >
                  {pengguna.role}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <dl>
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-3">
                  <dt className="text-sm font-medium text-gray-500">
                    Nama Lengkap
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {pengguna.namaLengkap}
                  </dd>
                </div>
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-3">
                  <dt className="text-sm font-medium text-gray-500">
                    Username
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {pengguna.username}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-3">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {pengguna.email}
                  </dd>
                </div>
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-3">
                  <dt className="text-sm font-medium text-gray-500">
                    Nomor Telepon
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {pengguna.nomorTelepon}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-3">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {pengguna.role}
                  </dd>
                </div>
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-3">
                  <dt className="text-sm font-medium text-gray-500">
                    Nomor Cabang
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {pengguna.nomorCabang}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-3">
                  <dt className="text-sm font-medium text-gray-500">
                    ID Karyawan
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {pengguna.idKaryawan}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6  mx-auto"> {/* Added max-width for demo */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Notifications
      </h2>
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.idNotifikasi}
              // Add subtle border, adjust padding, improve hover
              className="flex items-start p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 hover:shadow-sm transition duration-150 ease-in-out cursor-pointer"
            >
              <div className="flex-shrink-0 mr-3 pt-0.5">
           
                 <PlaceholderIcon />
              </div>

              <div className="flex-grow">
                {/* Top Row: Sender/Receiver and Date */}
                <div className="flex justify-between items-center mb-1">
                   {/* Make sender/receiver slightly less prominent than main message */}
                   <p className="font-medium text-sm text-gray-600">
                     <span className="font-semibold text-gray-800">{notif.rolePengirim ?? "System"}</span> → <span className="font-semibold text-gray-800">{notif.rolePenerima ?? "You"}</span>
                   </p>
                   <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDate(notif.tanggalNotifikasi)}
                   </span>
                </div>

                {/* Main Message */}
                <p className="text-sm text-gray-800 leading-snug"> {/* Slightly darker text, better line height */}
                    {notif.isiNotifikasi ?? "No content provided."}
                </p>

                {/* Metadata */}
                <div className="text-xs text-gray-500 mt-1.5"> {/* Consistent gray, more margin */}
                   Cabang: {notif.nomorCabang ?? "N/A"} | ID Pengajuan: {notif.idPengajuan ?? "N/A"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No new notifications.
          </p>
        )}
      </div>
    </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
