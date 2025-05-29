import { Routes, Route, Outlet } from "react-router-dom";
import Help from "./views/Help";
import Login from "./views/authentication/Login";
import Register from "./views/authentication/Register";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomeTest from "./views/HomeTest";
import UnderstockedItems from "./views/tabel_rekomendasi/UnderstockedItems";
import StokRekomendasi from "./views/tabel_rekomendasi/StokRekomendasi";
import Profile from "./views/authentication/Profile";
import ForgotPassword from "./views/authentication/ForgotPassword";
import EditProfile from "./views/authentication/EditProfile";
import CreateBarang from "./views/barang/CreateBarang";
import ReadAllBarang from "./views/barang/ReadAllBarang";
import ReadDetailBarang from "./views/barang/ReadDetailBarang";
import CreateCabangAsli from "./views/cabang_asli/CreateCabangAsli";
import ReadCabangAsli from "./views/cabang_asli/ReadCabangAsli";
import ReadDetailCabangAsli from "./views/cabang_asli/ReadDetailCabangAsli";
import UpdateCabangAsli from "./views/cabang_asli/UpdateCabangAsli";
import CreateCabangKerjaSama from "./views/cabang_kerja_sama/CreateCabangKerjaSama";
import ReadCabangKerjaSama from "./views/cabang_kerja_sama/ReadCabangKerjaSama";
import ReadDetailCabangKerjaSama from "./views/cabang_kerja_sama/ReadDetailCabangKerjaSama";
import UpdateCabangKerjaSama from "./views/cabang_kerja_sama/UpdateCabangKerjaSama";
import DashboardCabang from "./views/dashboard/DashboardCabang";
import DashboardPusat from "./views/dashboard/DashboardPusat";
import InputStokBarang from "./views/pengadaanpusat/InputStokBarang";
import PersetujuanKepalaSDM from "./views/pengadaanpusat/PersetujuanKepalaSDM";
import PersetujuanStafKeuangan from "./views/pengadaanpusat/PersetujuanStafKeuangan";
import ListPengadaanPusat from "./views/pengadaanpusat/ListPengadaanPusat";
import ListStatusPengadaanCA from "./views/pengadaan_cabang_asli/ListStatusPengadaanCA";
import InputStokBarangCA from "./views/pengadaan_cabang_asli/InputStokBarangCA";
import PersetujuanKepalaSDMCA from "./views/pengadaan_cabang_asli/PersetujuanKepalaSDMCA";
import KonversiStafGudangCA from "./views/pengadaan_cabang_asli/KonversiStafGudangCA";
import PersetujuanKepalaCA from "./views/pengadaan_cabang_asli/PersetujuanKepalaCA";
import ListStatusPengadaanCKS from "./views/pengadaan_cabang_kerja_sama/ListStatusPengadaanCKS";
import InputStokBarangCKS from "./views/pengadaan_cabang_kerja_sama/InputStokBarangCKS";
import PersetujuanKepalaSDMCKS from "./views/pengadaan_cabang_kerja_sama/PersetujuanKepalaSDMCKS";
import PersetujuanStafKeuanganCKS from "./views/pengadaan_cabang_kerja_sama/PersetujuanStafKeuanganCKS";
import KonversiStafGudangCKS from "./views/pengadaan_cabang_kerja_sama/KonversiStafGudangCKS";
import PersetujuanKepalaCKS from "./views/pengadaan_cabang_kerja_sama/PersetujuanKepalaCKS";
import UnAuthorized from "./views/UnAuthorized";
import NotificationPage from "./views/dashboard/Notifikasi";
import CreateReturnRequest from "./views/return/CreateReturn";
import ReadReturn from "./views/return/ReadReturn";
import ReadDetailReturn from "./views/return/ReadDetailReturn";
import ApproveReturn from "./views/return/ApproveReturn";
import KonfirmasiReturn from "./views/return/KonfirmasiReturn";
import UpdateReturnStatus from "./views/return/UpdateReturnStatus";
import RevisiInputStokBarang from "./views/pengadaanpusat/RevisiInputStokBarang";
import HalamanPenguranganStokBarang from "./views/PenguranganCabang/HalamanPenguranganStokBarang";
import TrenPermintaanBuku from "./views/TrenPermintaanBuku/TrenPermintaanBuku";
import StokMenipis from "./views/tabel_rekomendasi/StokMenipis";
import InisiasiPengecekanStok from "./views/barang/InisiasiPengecekan";
import PengecekanStokCabang from "./views/barang/PengecekanStokCabang";
import PengecekanDetailPage from "./views/barang/PengecekanDetail";
import KirimNotifikasiKOC from "./views/barang/CreateNotifikasiForm";
import EditStok from "./views/dashboard/EditStokBarang";
import EditStokCabang from "./views/dashboard/EditStokBarangPusat";
import DashboardCabangSpesifik from "./views/dashboard/DashboardCabangSpesifik";

function App() {
  return (
    <Routes>
      <Route path="/unauthorized" element={<UnAuthorized />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <div>
            <Navbar />
            <div className="flex flex-grow overflow-hidden">
              <Sidebar />
              <div className="flex-grow overflow-y-auto bg-white p-4">
                <Outlet />
              </div>
            </div>
          </div>
        }
      >
        <Route path="/help" element={<Help />} />
        <Route path="/" element={<HomeTest />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/reset-password" element={<ForgotPassword />} />

        {/* Barang routes */}
        <Route path="/barang">
          <Route index element={<ReadAllBarang />} />
          <Route path="create" element={<CreateBarang />} />
          <Route path=":id" element={<ReadDetailBarang />} />
        </Route>

        {/* Cabang Asli routes */}
        <Route path="/cabang-asli">
          <Route index element={<ReadCabangAsli />} />
          <Route path="create" element={<CreateCabangAsli />} />
          <Route path=":id" element={<ReadDetailCabangAsli />} />
          <Route path=":id/update" element={<UpdateCabangAsli />} />
        </Route>

        {/* Cabang Kerja Sama routes */}
        <Route path="/cabang-kerja-sama">
          <Route index element={<ReadCabangKerjaSama />} />
          <Route path="create" element={<CreateCabangKerjaSama />} />
          <Route path=":id" element={<ReadDetailCabangKerjaSama />} />
          <Route path=":id/update" element={<UpdateCabangKerjaSama />} />
        </Route>

        {/* Dashboard routes */}
        <Route path="/dashboard-cabang" element={<DashboardCabang />} />
        <Route path="/dashboard-pusat" element={<DashboardPusat />} />
        <Route path="/api/notifikasi" element={<NotificationPage />} />
        <Route
          path="/dashboard-cabang/:nomorCabang"
          element={<DashboardCabangSpesifik />}
        />

        <Route
          path="/inisiasi-pengecekan"
          element={<InisiasiPengecekanStok />}
        />
        <Route
          path="/edit-stok/:kodeBarang/:nomorCabang"
          element={<EditStok />}
        />
        <Route path="/edit-stok/:kodeBarang" element={<EditStokCabang />} />

        <Route path="/return">
          <Route index element={<ReadReturn />} />
          <Route path="create" element={<CreateReturnRequest />} />
          <Route path=":id" element={<ReadDetailReturn />} />
          <Route path=":id/approve" element={<ApproveReturn />} />
          <Route path=":id/konfirmasi" element={<KonfirmasiReturn />} />
          <Route path=":id/update-status" element={<UpdateReturnStatus />} />
        </Route>

        {/* Pengadaan routes */}
        <Route path="/pengadaan-pusat">
          <Route index element={<ListPengadaanPusat />} />
          <Route path="input" element={<InputStokBarang />} />
          <Route
            path="persetujuan-kepala-sdm/:idPengajuan"
            element={<PersetujuanKepalaSDM />}
          />
          <Route
            path="persetujuan-staf-keuangan/:idPengajuan"
            element={<PersetujuanStafKeuangan />}
          />
          <Route
            path="revisi-input-barang/:idPengajuan"
            element={<RevisiInputStokBarang />}
          />
        </Route>
        {/* Pengadaan Cabang Asli routes */}
        <Route path="/pengadaan-cabang-asli">
          <Route
            path="cabang/:nomorCabang"
            element={<ListStatusPengadaanCA />}
          />
          <Route path="input/:nomorCabang" element={<InputStokBarangCA />} />
          <Route
            path="persetujuan-kepala-sdm/:idPengajuan"
            element={<PersetujuanKepalaSDMCA />}
          />
          <Route
            path="persetujuan-staf-gudang/:idPengajuan"
            element={<KonversiStafGudangCA />}
          />
          <Route
            path="persetujuan-kepala-cabang/:idPengajuan"
            element={<PersetujuanKepalaCA />}
          />
        </Route>
        <Route path="/pengadaan-cabang-kerja-sama">
          <Route
            path="cabang/:nomorCabang"
            element={<ListStatusPengadaanCKS />}
          />
          <Route path="input/:nomorCabang" element={<InputStokBarangCKS />} />
          <Route
            path="persetujuan-kepala-sdm/:idPengajuan"
            element={<PersetujuanKepalaSDMCKS />}
          />
          <Route
            path="persetujuan-staf-keuangan/:idPengajuan"
            element={<PersetujuanStafKeuanganCKS />}
          />
          <Route
            path="persetujuan-staf-gudang/:idPengajuan"
            element={<KonversiStafGudangCKS />}
          />
          <Route
            path="persetujuan-kepala-cabang/:idPengajuan"
            element={<PersetujuanKepalaCKS />}
          />
        </Route>
        <Route path="/pengurangan-stok">
          <Route
            path=":nomorCabang"
            element={<HalamanPenguranganStokBarang />}
          />
        </Route>

        <Route
          path="/inisiasi-pengecekan/notifikasi"
          element={<KirimNotifikasiKOC />}
        />

        <Route
          path="/pengecekan-stok/detail/:nomorCabang/:idPengajuan"
          element={<PengecekanDetailPage />}
        />
        <Route
          path="/inisiasi-pengecekan/:nomorCabang/:idPengajuan"
          element={<PengecekanStokCabang />}
        />

        {/* Tren Permintaan Buku */}
        <Route path="/tren-permintaan-buku" element={<TrenPermintaanBuku />} />

        {/* Stok Menipis */}
        <Route path="/stok-menipis" element={<StokMenipis />} />
        
        {/* Stok Rekomendasi */}
        <Route path="/stok-rekomendasi" element={<StokRekomendasi />} />
        
        {/* Understocked Items */}
        <Route path="/understocked-items" element={<UnderstockedItems />} />
      </Route>
    </Routes>
  );
}

export default App;
