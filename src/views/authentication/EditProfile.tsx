import React, { useState, useEffect } from 'react';
import authenticationService from '../../services/authentication';
import { EditPenggunaRequest, PenggunaResponse} from '../../interface/Pengguna';
import ErrorModal from '../../components/Error';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [nomorCabang, setNomorCabang] = useState("");
  const [email, setEmail] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");

  const [listPengguna, setListPengguna] = useState<PenggunaResponse[] | null>(null);
  const [errorModal, setErrorModal] = useState<{
    status: number;
    errorMessage: string;
    timestamp: string;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPenggunaList = async () => {
      try {
        const response = await authenticationService.getAllPengguna(localStorage.getItem("accessToken") as string);
        if (response.status !== 200) {
          setErrorModal({
            status: response.status,
            errorMessage: response.message,
            timestamp: new Date().toString(),
          });
          navigate("/");
          return;
        }

        if(response.data === null) {
          setErrorModal({
            status: response.status,
            errorMessage: response.message,
            timestamp: new Date().toString(),
          });
          navigate("/");
          return;
        }

        if (Array.isArray(response.data)) {
          setListPengguna(response.data);
        } else {
          setErrorModal({
            status: response.status,
            errorMessage: "Invalid data format received",
            timestamp: new Date().toString(),
          });
        }
      } catch (error) {
        console.error("Fetch pengguna list error:", error);
        setErrorModal({
          status: 500,
          errorMessage: "Failed to fetch user list",
          timestamp: new Date().toString(),
        });
      }
    };

    fetchPenggunaList();
  }, []);

  const handleUserSelect = (username: string) => {
    setSelectedUserId(username);
    
    if (listPengguna && username) {
      const selectedUser = listPengguna.find(user => user.username== username);
      if (selectedUser) {
        setUsername(selectedUser.username || "");
        setRole(selectedUser.role || "");
        setNomorCabang(selectedUser.nomorCabang || "");
        setEmail(selectedUser.email || "");
        setNomorTelepon(selectedUser.nomorTelepon || "");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      setErrorModal({
        status: 400,
        errorMessage: "Please select a user to edit",
        timestamp: new Date().toString(),
      });
      return;
    }

    try {
      const editRequest: EditPenggunaRequest = {
        username,
        role,
        nomorCabang,
        email,
        nomorTelepon
      };

      
      const response = await authenticationService.editProfileService(localStorage.getItem("accessToken") as string,
        editRequest
      );

      if (response.status !== 200) {
        setErrorModal({
          status: response.status,
          errorMessage: response.message,
          timestamp: new Date().toString(),
        });
        return;
      }

      // Show success message or redirect
      alert("User updated successfully");
    } catch (error) {
      console.error("Update user error:", error);
      setErrorModal({
        status: 500,
        errorMessage: "Failed to update user",
        timestamp: new Date().toString(),
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {errorModal && (
        <ErrorModal
          status={errorModal.status}
          errorMessage={errorModal.errorMessage}
          timestamp={errorModal.timestamp}
          onClose={() => setErrorModal(null)}
        />
      )}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>
      
      {/* User selection dropdown */}
      <div className="mb-6">
        <label
          htmlFor="userSelect"
          className="block text-sm font-medium text-gray-700"
        >
          Select User to Edit
        </label>
        <select
          id="userSelect"
          name="userSelect"
          value={selectedUserId}
          onChange={(e) => handleUserSelect(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="">Select a user</option>
          {listPengguna && listPengguna.map((user) => (
            <option key={user.idKaryawan} value={user.username}>
              {user.username} - {user.role}
            </option>
          ))}
        </select>
      </div>
      
      {selectedUserId && (
        <form onSubmit={handleSubmit}>
          {/* Username (uneditable) */}
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 cursor-not-allowed"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="nomorTelepon"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Telepon
            </label>
            <input
              id="nomorTelepon"
              name="nomorTelepon"
              type="tel"
              value={nomorTelepon}
              onChange={(e) => setNomorTelepon(e.target.value)}
              placeholder="Masukkan nomor telepon"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          {/* Nomor Cabang (editable) */}
          <div className="mb-6">
            <label
              htmlFor="nomorCabang"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Cabang
            </label>
            <select
              id="nomorCabang"
              name="nomorCabang"
              value={nomorCabang}
              onChange={(e) => setNomorCabang(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">Pilih Nomor Cabang</option>
              {Array.from({ length: 32 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Role (editable) */}
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">Pilih Role</option>
              <option value="Staf Gudang Pelaksana Umum">Staf Gudang Pelaksana Umum</option>
              <option value="Staf Inventarisasi">Staf Inventarisasi</option>
              <option value="Staf Pengadaan dan Pembelian">Staf Pengadaan dan Pembelian</option>
              <option value="Kepala Departemen SDM dan Umum">Kepala Departemen SDM dan Umum</option>
              <option value="Direktur Utama">Direktur Utama</option>
              <option value="Staf keuangan">Staf keuangan</option>
              <option value="Admin">Admin</option>
              <option value="Kepala Operasional Cabang">Kepala Operasional Cabang</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProfile;