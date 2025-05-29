import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button"; // Use PrimeReact Button
import { InputTextarea } from "primereact/inputtextarea";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pengadaanCAservice from "../../services/pengadaanCAservice";
import { Tooltip } from "primereact/tooltip";
import {
  InputStokBarangTotalResponse,
  InputStokBarangResponse,
} from "../../interface/CabangAsli";
import authenticationService from "../../services/authentication";
import { Barang } from "../../interface/PengadaanPusat";
import KeteranganList from "../../components/KeteranganList";
import pengadaanCKSservice from "../../services/pengadaanCKSservice";

const PersetujuanKepalaSDMCA = () => {
  const { idPengajuan } = useParams<{ idPengajuan: string }>();

  const [products, setProducts] = useState<InputStokBarangResponse[]>();
  const [filters, setFilters] = useState<{
    global: { value: string | null; matchMode: FilterMatchMode };
    namaBarang: { value: string | null; matchMode: FilterMatchMode };
    hargaBarang: { value: string | null; matchMode: FilterMatchMode };
    stokSaatIni: { value: string | null; matchMode: FilterMatchMode };
    stokInput: { value: string | null; matchMode: FilterMatchMode };
    stokPusatSaatIni: { value: string | null; matchMode: FilterMatchMode };
  }>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    namaBarang: { value: null, matchMode: FilterMatchMode.CONTAINS },
    hargaBarang: { value: null, matchMode: FilterMatchMode.CONTAINS },
    stokSaatIni: { value: null, matchMode: FilterMatchMode.CONTAINS },
    stokInput: { value: null, matchMode: FilterMatchMode.CONTAINS },
    stokPusatSaatIni: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [keterangan, setKeterangan] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Barang | null>(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [step, setStep] = useState<number>(0);
  const [totalHarga, setTotalHarga] = useState<string>("");
  const [roleUser, setRoleUser] = useState<string | null>(null);
  const [nomorCabang, setNomorCabang] = useState<string | null>(null);
  const [showKeterangan, setShowKeterangan] = useState<boolean>(false);

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
    if (roleUser && roleUser !== "Kepala Departemen SDM dan Umum") {
      navigate("/");
    }
  }, [roleUser, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found");
          return;
        }
        if (!idPengajuan) {
          console.error("ID Pengajuan not found");
          return;
        }
        const response = await pengadaanCAservice.getPengajuan(
          accessToken,
          idPengajuan
        );

        if (response.status !== 200) {
          console.error("Failed to fetch data");
          return;
        }

        const data = response.data as InputStokBarangTotalResponse;
        setProducts(data.listInputStokBarang);
        setTotalHarga(data.totalHarga);
        setNomorCabang(data.nomorCabang);
        setStep(data.step);
        const flagPengajuan = data.flag;
        
        if (flagPengajuan === false) {
          console.log("Navigating because fetched flag is false...");
          navigate(`/pengadaan-cabang-kerja-sama/persetujuan-kepala-sdm/${idPengajuan}`);
        }

        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [idPengajuan]);

  const isApprovalBlockedDueToStock = useMemo(() => {
    if (!products || products.length === 0) {
      return false; // Cannot approve if there's nothing
    }
    // Check if ANY product has input stock greater than central stock
    return products.some(
      (product) => Number(product.stokInput) > Number(product.stokPusatSaatIni)
    );
  }, [products]);


  if (!idPengajuan) {
    return <p>ID Pengajuan tidak ditemukan</p>;
  }

  const handleSetuju = async () => {
    try {
      if (isApprovalBlockedDueToStock) {
        alert("Tidak dapat menyetujui karena ada permintaan stok melebihi stok pusat.");
        return;
      }
      
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      if (!nomorCabang) {
        alert("Nomor Cabang not found");
        return;
      }
      const response = await pengadaanCAservice.persetujuanKepalaDepartemen(
        accessToken,
        idPengajuan,
        true,
        nomorCabang,
        keterangan
      );

      if (response.data !== true) {
        console.error("Failed to approve");
        return;
      }

      if (response.data === true) {
        console.log("Approved");
        alert("Pengajuan berhasil disetujui");
        console.log("Setujui clicked. Keterangan (optional):", keterangan);
        navigate(`/pengadaan-cabang-asli/cabang/001`);
      }

      
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  };

  const renderHarga = (rowData: Barang) => {
    const harga = Number(rowData.hargaBarang);
    return !isNaN(harga) ? formatCurrency(harga) : "-";
  };

  const toggleKeterangan = () => {
    setShowKeterangan((prev) => !prev);
  };

  const handleRevisi = async () => {
    if (isApprovalBlockedDueToStock && !keterangan.trim()) {
        alert("Harap masukkan alasan revisi di kolom keterangan karena ada permintaan stok yang melebihi stok pusat.");
        setShowKeterangan(true); // Optionally force the keterangan field to show
        // Focus the textarea maybe? document.getElementById('keterangan')?.focus();
        return;
    }
    const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      if (!nomorCabang) {
        alert("Nomor Cabang not found");
        return;
      }

      const response = await pengadaanCAservice.persetujuanKepalaDepartemen(
        accessToken,
        idPengajuan,
        false,
        nomorCabang,
        keterangan
      );

      if (response.data !== true) {
        console.error("Failed to approve");
         alert("Pengajuan berhasil ditolak");
         navigate(`/pengadaan-cabang-asli/cabang/001`);
        return;
      }
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-between p-4 bg-gray-100 rounded-lg">
        <span className="p-input-icon-left">
          <InputText
            placeholder="Global Search"
            className="p-inputtext-sm"
            value={globalFilterValue}
            onChange={(e) => {
              setGlobalFilterValue(e.target.value);
              setFilters((prevFilters) => ({
                ...prevFilters,
                global: {
                  value: e.target.value,
                  matchMode: FilterMatchMode.CONTAINS,
                },
              }));
            }}
          />
        </span>
      </div>
    );
  };

  const rowClass = (data: InputStokBarangResponse): object | string => {
    // Ensure values are numbers before comparing
    const pusatStock = Number(data.stokPusatSaatIni);
    const inputStock = Number(data.stokInput);

    // Check if comparison is valid (both are numbers)
    if (!isNaN(pusatStock) && !isNaN(inputStock)) {
        // Apply Tailwind classes for styling the row if condition met
        return {
            // This uses PrimeReact's object syntax for conditional classes
            // Key: CSS class name(s), Value: boolean condition
            'bg-red-100 text-red-800 font-medium border-red-200': pusatStock < inputStock
            // You could add other classes for other conditions here
            // 'bg-yellow-100': data.someOtherCondition
        };
    }
    // Return empty object or null/undefined if no special class needed
    return {};
    // return ''; // Alternative if returning string
  };

  const tambahKomentar = async () => {
    const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      if (!nomorCabang) {
        alert("Nomor Cabang not found");
        return;
      }

      if(keterangan.trim() === "") {
        alert("Keterangan tidak boleh kosong");
        return;
      }

      const response = await pengadaanCKSservice.addKomentar(
        accessToken,
        idPengajuan,
        keterangan
      );

      if (response.status !== 200) {
        console.error("Failed to add comment");
        return;
      }

      if (response.status === 200) {
        console.log("Comment added");
        alert("Komentar berhasil ditambahkan");
        setKeterangan("");
        console.log("Setujui clicked. Keterangan (optional):", keterangan);
        navigate(`/pengadaan-cabang-asli/cabang/001`);
      }
  }


  return (
    <div className="flex flex-col pb-10">
      <h1 className="py-5 ps-5">
        {roleUser === "Kepala Departemen SDM dan Umum"
          ? "Persetujuan Kepala SDM dan Umum"
          : "Informasi Pengajuan"}
      </h1>
      <p className="ps-5 text-gray-500 mb-4">Nomor Pengajuan {idPengajuan}</p>
      <p className="ps-5 text-gray-500 mb-4">Nomor Cabang {nomorCabang}</p>
      <DataTable
        value={products}
        selectionMode="single"
        selection={selectedProduct}
        onSelectionChange={(e) => setSelectedProduct(e.value as Barang)}
        paginator
        rows={rows}
        first={first}
        onPage={(e) => {
          setFirst(e.first);
          setRows(e.rows);
        }}
        header={renderHeader()}
        filters={filters}
        rowsPerPageOptions={[5, 10, 25, 50]}
        currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} barang"
        globalFilterFields={[
          "kodeBarang",
          "namaBarang",
          "hargaBarang",
          "stokSaatIni",
          "stokInput",
          "stokPusatSaatIni",
        ]}
        filterDisplay="menu"
        stripedRows
        responsiveLayout="scroll"
        sortField="namaBarang"
        sortOrder={1}
        className=" rounded-lg overflow-hidden"
        rowClassName={rowClass}
      >
        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
        <Column
          field="kodeBarang"
          header="Kode Barang"
          sortable
          className="p-2"
        />
        <Column
          field="namaBarang"
          header="Nama"
          sortable
          filter
          filterField="namaBarang"
          filterPlaceholder="Cari Berdasarkan Nama"
          filterMatchMode={FilterMatchMode.CONTAINS}
          className="p-2"
        />

        <Column
          field="hargaBarang"
          header="Harga Satuan"
          body={renderHarga} // Use body template for formatting
          sortable
          filter
          filterField="hargaBarang" // Explicitly set filterField
          filterPlaceholder="Filter by Price"
          filterMatchMode={FilterMatchMode.CONTAINS} // Adjust match mode if needed (e.g., EQUALS)
          style={{ minWidth: "120px" }}
        />
        <Column
          filter
          filterField="stokSaatIni"
          filterPlaceholder="Search by quantity"
          filterMatchMode={FilterMatchMode.CONTAINS}
          field="stokSaatIni"
          header="Stok Saat Ini"
          sortable
          className="p-2"
        />

        <Column
          filter
          filterField="stokInput"
          filterPlaceholder="Search by quantity"
          filterMatchMode={FilterMatchMode.CONTAINS}
          field="stokInput"
          header="Stok Masuk"
          sortable
          className="p-2"
        />
        <Column
          filter
          filterField="stokPusatSaatIni"
          filterPlaceholder="Search by quantity"
          filterMatchMode={FilterMatchMode.CONTAINS}
          field="stokPusatSaatIni"
          header="Stok Pusat"
          sortable
          className="p-2"
        />
      </DataTable>
      <div className="flex justify-end mt-4 text-gray-700">
        <p className="text-lg font-semibold">
          Total Harga: {formatCurrency(Number(totalHarga))}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="mb-3">
          <Button
            label={showKeterangan ? "Tutup Keterangan" : "Tambah Keterangan"}
            icon={showKeterangan ? "pi pi-minus" : "pi pi-plus"}
            onClick={toggleKeterangan}
            className="p-button-secondary p-button-outlined p-button-sm" // Style the button
          />
        </div>
        {showKeterangan && (
          <div>
            <label
              htmlFor="keterangan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Keterangan Tambahan
            </label>
            <InputTextarea
              id="keterangan"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={4}
              className="w-full" // Use PrimeReact's width utility if preferred, or keep Tailwind's w-full
              placeholder="Jika ada, masukkan keterangan di sini..."
              autoResize
            />
          </div>
        )}
      </div>
      {roleUser === "Kepala Departemen SDM dan Umum" && (
              <div className="flex space-x-2">
                 {/* Tooltip to explain why button is disabled */}
                 <Tooltip target=".approve-button" disabled={!isApprovalBlockedDueToStock}/>
                 {step == 1 ? (
                  <div>
                  <Button
                    label="Setujui"
                    onClick={handleSetuju}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 approve-button" // Added class for tooltip target
                    // Disable button if approval is blocked
                    disabled={isApprovalBlockedDueToStock}
                    // Add tooltip text when disabled
                    data-pr-tooltip="Tidak bisa disetujui karena stok pusat tidak mencukupi untuk beberapa item"
                    data-pr-position="top"
                 />
                 <Button 
                    label="Tolak"
                    onClick={handleRevisi}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"  
                    />
                  </div>
                  ) : ""}

                <Button
                  label="Tambah Komentar" // Changed label slightly for clarity
                  onClick={tambahKomentar} // Use the new handler
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                />
              </div>
            )}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <KeteranganList idPengajuan={idPengajuan} />
            </div>
    </div>
  );
};

export default PersetujuanKepalaSDMCA;
