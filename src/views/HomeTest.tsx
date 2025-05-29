import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Database,
  BarChart3,
  Shield,
  Clock,
  UserPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import authentication from "../services/authentication";

const HomeTest = () => {
  const [role, setRole] = useState<string>("");
  const [userCabang, setUserCabang] = useState<string | null>(null);
  useEffect(() => {
    try {
      const fetchUserProfile = async () => {
        setTimeout(async () => {
          if (localStorage.getItem("accessToken") === null) {
            console.log("No access token found");
          }

          const result = await authentication.getProfileService(
            localStorage.getItem("accessToken") as string
          );

          if (result == null) {
            console.log("Result");
          }

          if (result == "Failed") {
            console.log("Error", result);
          }

          if (typeof result === "string") {
            console.error("Error:", result);
          } else {
            setRole(result.role);
            setUserCabang(result.nomorCabang);
          }
        }, 800);
      };

      fetchUserProfile();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const routes = [
    { path: "/unauthorized", label: "Unauthorized" },
    { path: "/login", label: "Login" },
    { path: "/register", label: "Register" },
    { path: "/help", label: "Help" },
    { path: "/", label: "Home" },
    { path: "/profile", label: "Profile" },
    { path: "/edit-profile", label: "Edit Profile" },
    { path: "/reset-password", label: "Reset Password" },

    // Barang routes
    { path: "/barang", label: "Barang" },
    { path: "/barang/create", label: "Create Barang" },
    { path: "/barang/:id", label: "Barang Detail", isParam: true },
    { path: "/barang/:id/update", label: "Update Barang", isParam: true },

    // Cabang Asli routes
    { path: "/cabang-asli", label: "Cabang Asli" },
    { path: "/cabang-asli/create", label: "Create Cabang Asli" },
    { path: "/cabang-asli/:id", label: "Cabang Asli Detail", isParam: true },
    {
      path: "/cabang-asli/:id/update",
      label: "Update Cabang Asli",
      isParam: true,
    },

    // Cabang Kerja Sama routes
    { path: "/cabang-kerja-sama", label: "Cabang Kerja Sama" },
    { path: "/cabang-kerja-sama/create", label: "Create Cabang Kerja Sama" },
    {
      path: "/cabang-kerja-sama/:id",
      label: "Cabang Kerja Sama Detail",
      isParam: true,
    },
    {
      path: "/cabang-kerja-sama/:id/update",
      label: "Update Cabang Kerja Sama",
      isParam: true,
    },

    // Dashboard routes
    { path: "/dashboard-cabang", label: "Dashboard Cabang" },
    { path: "/dashboard-pusat", label: "Dashboard Pusat" },
    {
      path: `/dashboard-cabang/${userCabang}`,
      label: "Dashboard Cabang (Specified)",
    },

    // Pengadaan routes
    { path: "/pengadaan-pusat", label: "Pengadaan Pusat" },
    { path: "/pengadaan-pusat/input", label: "Input Stok Barang" },
    {
      path: "/pengadaan-pusat/persetujuan-kepala-sdm/:idPengajuan",
      label: "Persetujuan Kepala SDM",
      isParam: true,
    },
    {
      path: "/pengadaan-pusat/persetujuan-staf-keuangan",
      label: "Persetujuan Staf Keuangan",
    },

    // Return routes
    { path: "/return", label: "Return Barang" },
    { path: "/return/create", label: "Create Return" },
    { path: "/return/:id", label: "Return Detail", isParam: true },
    { path: "/return/:id/approve", label: "Approve Return", isParam: true },
    {
      path: "/return/:id/konfirmasi",
      label: "Konfirmasi Return",
      isParam: true,
    },

    // Pengadaan Cabang Asli
    {
      path: `/pengadaan-cabang-asli/cabang/${userCabang}`,
      label: "Status Pengadaan Cabang Asli",
    },
    {
      path: `/pengadaan-cabang-asli/input/${userCabang}`,
      label: "Input Stok Cabang Asli",
    },
    {
      path: "/pengadaan-cabang-asli/persetujuan-kepala-sdm/:idPengajuan",
      label: "Persetujuan Kepala SDM - Cabang Asli",
    },
    {
      path: "/pengadaan-cabang-asli/konversi-staf-gudang/:idPengajuan",
      label: "Konversi Staf Gudang - Cabang Asli",
    },
    {
      path: "/pengadaan-cabang-asli/persetujuan-kepala/:idPengajuan",
      label: "Persetujuan Kepala - Cabang Asli",
    },

    // Pengadaan Cabang Kerja Sama
    {
      path: `/pengadaan-cabang-kerja-sama/cabang/${userCabang}`,
      label: "Status Pengadaan Cabang Kerja Sama",
    },
    {
      path: `/pengadaan-cabang-kerja-sama/input/${userCabang}`,
      label: "Input Stok Cabang Kerja Sama",
    },
    {
      path: "/pengadaan-cabang-kerja-sama/persetujuan-kepala-sdm/:idPengajuan",
      label: "Persetujuan Kepala SDM - Kerja Sama",
    },
    {
      path: "/pengadaan-cabang-kerja-sama/persetujuan-staf-keuangan/:idPengajuan",
      label: "Persetujuan Staf Keuangan - Kerja Sama",
    },
    {
      path: "/pengadaan-cabang-kerja-sama/konversi-staf-gudang/:idPengajuan",
      label: "Konversi Staf Gudang - Kerja Sama",
    },
    {
      path: "/pengadaan-cabang-kerja-sama/persetujuan-kepala/:idPengajuan",
      label: "Persetujuan Kepala - Kerja Sama",
    },

    // Pengurangan Stok
    {
      path: `/pengurangan-stok/${userCabang}`,
      label: "Pengurangan Stok Barang",
    },

    { path: "/tren-permintaan-buku", label: "Tren Permintaan Buku" },

    { path: "/inisiasi-pengecekan", label: "Pengecekan Stok" },
  ];

  // Function to handle button clicks
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Function to handle parameterized routes
  const handleParamRoute = (route: string) => {
    const paramType = route.includes(":id") ? "id" : "idPengajuan";
    const paramValue = prompt(`Enter ${paramType} for this route:`);

    if (paramValue) {
      const finalPath = route.replace(`:${paramType}`, paramValue);
      navigate(finalPath);
    }
  };
  return (
    <div>
      <h3 className="font-bold mb-4">Role saat ini : {role}</h3>
      <h2 className="text-xl font-bold mb-4">Navigation Panel</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {routes.map((route, index) => (
          <button
            key={index}
            onClick={() =>
              route.isParam
                ? handleParamRoute(route.path)
                : handleNavigation(route.path)
            }
            className={`
              p-2 rounded
              ${
                location.pathname === route.path
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-blue-100 border border-gray-300 text-gray-800"
              }
              transition duration-200
              ${route.path.includes("unauthorized") ? "border-red-500" : ""}
              ${
                route.path.startsWith("/barang")
                  ? "border-l-4 border-l-green-500"
                  : ""
              }
              ${
                route.path.startsWith("/cabang-asli")
                  ? "border-l-4 border-l-yellow-500"
                  : ""
              }
              ${
                route.path.startsWith("/cabang-kerja-sama")
                  ? "border-l-4 border-l-purple-500"
                  : ""
              }
              ${
                route.path.startsWith("/dashboard")
                  ? "border-l-4 border-l-blue-500"
                  : ""
              }
              ${
                route.path.startsWith("/pengadaan")
                  ? "border-l-4 border-l-orange-500"
                  : ""
              }
              ${
                route.path.startsWith("/return")
                  ? "border-l-4 border-l-red-500"
                  : ""
              }
              text-sm
            `}
          >
            {route.label}
          </button>
        ))}
      </div>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Bagian Hero */}
        <header className="text-blue-700">
          <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Kelola Inventaris Anda dengan Mudah
              </h1>
              <p className="text-xl mb-8">
                Si Inven membantu LB LIA melacak, mengelola, dan mengoptimalkan
                inventaris di semua lokasi dengan antarmuka yang ramah pengguna
                dan fitur yang canggih.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition shadow-lg">
                  Mulai Sekarang
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition">
                  Lihat Demo
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Bagian Fitur */}
        <section id="fitur" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Fitur Unggulan
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Si Inven memberikan solusi manajemen inventaris yang lengkap
                untuk kebutuhan LB LIA
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Database className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Pelacakan Real-time
                </h3>
                <p className="text-gray-600">
                  Pantau inventaris di semua cabang LB LIA secara real-time
                  dengan pembaruan instan dan notifikasi.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Laporan & Analisis
                </h3>
                <p className="text-gray-600">
                  Dapatkan wawasan mendalam tentang penggunaan inventaris dengan
                  laporan yang dapat disesuaikan.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <UserPlus className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Manajemen Pengguna
                </h3>
                <p className="text-gray-600">
                  Tetapkan peran dan izin untuk staf berdasarkan tanggung jawab
                  mereka dalam organisasi.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Pengingat Stok
                </h3>
                <p className="text-gray-600">
                  Dapatkan pemberitahuan otomatis saat stok barang mencapai
                  level minimum yang telah ditentukan.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Keamanan Data
                </h3>
                <p className="text-gray-600">
                  Lindungi data inventaris Anda dengan sistem keamanan berlapis
                  dan pencadangan otomatis.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Audit & Kepatuhan
                </h3>
                <p className="text-gray-600">
                  Permudah proses audit dengan jejak audit yang jelas dan
                  laporan kepatuhan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bagian Manfaat */}
        <section id="manfaat" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Manfaat untuk LB LIA
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Temukan bagaimana Si Inven meningkatkan efisiensi dan mengurangi
                biaya operasional
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Untuk Manajemen
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">
                      Pengambilan keputusan yang lebih baik dengan data
                      real-time
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">
                      Perencanaan anggaran yang lebih akurat
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">
                      Mengurangi pemborosan dan meningkatkan ROI
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">
                      Pelaporan konsolidasi untuk semua cabang
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Untuk Staf
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">
                      Antarmuka yang mudah digunakan dan ramah pengguna
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">
                      Mengurangi kesalahan manual dalam pencatatan inventaris
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">
                      Proses kerja yang lebih cepat dan efisien
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">
                      Akses mobile untuk pengelolaan inventaris di mana saja
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Database className="mr-2" />
                  <span className="font-bold text-xl">Si Inven</span>
                </div>
                <p className="text-gray-400">
                  Sistem Inventaris terpadu untuk LB LIA yang memudahkan
                  pengelolaan dan pelacakan aset di semua cabang.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Link Cepat</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Beranda
                    </a>
                  </li>
                  <li>
                    <a
                      href="#fitur"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Fitur
                    </a>
                  </li>
                  <li>
                    <a
                      href="#manfaat"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Manfaat
                    </a>
                  </li>
                  <li>
                    <a
                      href="#testimoni"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Testimoni
                    </a>
                  </li>
                  <li>
                    <a
                      href="#kontak"
                      className="text-gray-400 hover:text-white transition"
                    >
                      Kontak
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Hubungi Kami</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Jl. Pemuda No. 123, Jakarta</li>
                  <li>Email: info@siinven.id</li>
                  <li>Telepon: (021) 1234-5678</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} Si Inven. Hak Cipta Dilindungi
                Undang-Undang.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomeTest;
