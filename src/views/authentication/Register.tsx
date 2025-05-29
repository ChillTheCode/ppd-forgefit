import React, { useState, useEffect } from "react";
import LogoLIA from "../../assets/logo_lia.png";
import authenticationService from "../../services/authentication";
import ErrorModal from "../../components/Error";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


const Register: React.FC = () => {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [role, setRole] = useState("");
  const [idKaryawan, setIdKaryawan] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorModal, setErrorModal] = useState<{
    status: number;
    errorMessage: string;
    timestamp: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [roleUser, setRoleUser] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found");
          navigate("/unauthorized");
          return;
        }

        const response = await authenticationService.getRoleService(
          accessToken
        );
        if (response === "Failed") {
          console.error("Error fetching data");
          return;
        }

        const data = response as string;
        setRoleUser(data);

      
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    if (roleUser && roleUser !== "Admin") {
      navigate("/");
    }
  }, [roleUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTimeout(async () => {
      try {
        const response = await authenticationService.registerService({
          namaLengkap: namaLengkap,
          email: email,
          username: username,
          password: password,
          nomorTelepon: nomorTelepon !== "" ? nomorTelepon : null,
          role: role,
          nomorCabang: "001",
          idKaryawan: idKaryawan,
        });

        if (response.status !== 201) {
          setErrorModal({
            status: response.status,
            errorMessage: response.message,
            timestamp: new Date().toLocaleString(),
          });
          return;
        }

        alert("Register success");
        setTimeout(() => navigate("/login"), 0);
      } catch {
        setErrorModal({
          status: 500,
          errorMessage: "Internal Server Error",
          timestamp: new Date().toLocaleString(),
        });
      }
    }, 500);
  };

  const confirmPasswordValidation = (e: string) => {
    setConfirmPassword(e);

    if (password && e !== password) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-4xl rounded-lg bg-white shadow-lg">
        <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center rounded-r-lg">
          <div>
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Create your account!
              </h1>
            </div>
            <img
              src={LogoLIA}
              alt="Logo LIA"
              className="h-50 w-50 object-contain pb-3"
            />
          </div>
        </div>

        <div className="w-full p-8 lg:w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="namaLengkap"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <input
                id="namaLengkap"
                name="namaLengkap"
                type="namaLengkap"
                required
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => confirmPasswordValidation(e.target.value)}
                placeholder="••••••••"
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none 
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
              />

              {/* Error Message (Red Text) */}
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
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
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">Pilih Role</option>
                <option value="Staf Gudang Pelaksana Umum">
                  Staf Gudang Pelaksana Umum
                </option>
                <option value="Staf Inventarisasi">Staf Inventarisasi</option>
                <option value="Staf Pengadaan dan Pembelian">
                  Staf Pengadaan dan Pembelian
                </option>
                <option value="Kepala Departemen SDM dan Umum">
                  Kepala Departemen SDM dan Umum
                </option>
                <option value="Direktur Utama">Direktur Utama</option>
                <option value="Staf keuangan">Staf keuangan</option>
                <option value="Admin">Admin</option>
                <option value="Kepala Operasional Cabang">
                  Kepala Operasional Cabang
                </option>
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="idKaryawan"
                className="block text-sm font-medium text-gray-700"
              >
                ID Karyawan
              </label>
              <input
                id="idKaryawan"
                name="idKaryawan"
                type="text"
                required
                value={idKaryawan}
                onChange={(e) => setIdKaryawan(e.target.value)}
                placeholder="Masukkan ID Karyawan"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign Up
              </button>
            </div>
            <div>
            <button
                onClick={() => navigate("/")}
                type="button"
                className="mt-5 group relative flex w-full justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-black border border-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                style={{ border: "1px solid black" }}
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
      {errorModal && (
        <ErrorModal
          status={errorModal.status}
          errorMessage={errorModal.errorMessage}
          timestamp={errorModal.timestamp}
          onClose={() => setErrorModal(null)} // Close the modal when clicking "Close"
        />
      )}
    </div>
  );
};

export default Register;
