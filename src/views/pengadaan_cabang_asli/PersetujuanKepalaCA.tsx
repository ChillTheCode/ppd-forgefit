import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button"; // Use PrimeReact Button
import { InputTextarea } from "primereact/inputtextarea";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pengadaanCAservice from "../../services/pengadaanCAservice";
import {
  InputStokBarangTotalResponse,
  InputStokBarangResponse,
  stokBarang
} from "../../interface/CabangAsli";
import authenticationService from "../../services/authentication";
import { Barang } from "../../interface/PengadaanPusat";
import KeteranganList from "../../components/KeteranganList";

const PersetujuanKepalaCA = () => {
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
  const [totalHarga, setTotalHarga] = useState<string>("");
  const [roleUser, setRoleUser] = useState<string | null>(null);
  const [nomorCabang, setNomorCabang] = useState<string | null>(null);
  const [showKeterangan, setShowKeterangan] = useState<boolean>(false);
  const [showAlternative, setShowAlternative] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("")
  const [step, setStep] = useState(0)
  const [selectedItem, setSelectedItem] = useState<stokBarang | null>(null);
    const [stok, setStok] = useState<string>("-");
    const [inputStok, setInputStok] = useState<string>("");
    const [stokPusat, setStokPusat] = useState<string>("-");
    const [rowsInput, setRowsInput] = useState<
      {
        kodeBarang: string;
        namaBarang: string;
        stokBarang: number;
        stokBarangPusat: number;
        inputStok: number;
      }[]
    >([]);
    const [barang, setBarang] = useState<stokBarang[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      setError(""); // Clear previous errors
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found");
          navigate("/unauthorized");
          return;
        }

        const response = await authenticationService.getRoleService(accessToken);

        // Improved error handling for service response
        if (typeof response !== 'string' || response === "Failed") {
           console.error("Error fetching role or invalid response:", response);
           // Handle appropriately - maybe navigate away or show an error
           // For now, setting role to null or an error indicator might be best
           setRoleUser(null);
           setError("Gagal mengambil data peran pengguna.");
           // Depending on requirements, you might navigate away here too
           // navigate("/error-page");
           return;
        }

        setRoleUser(response); // response is already checked to be a string

      } catch (error) {
        console.error("Error fetching role:", error);
        setError("Terjadi kesalahan saat mengambil peran pengguna.");
        setRoleUser(null); // Ensure role is null on error
         // navigate("/error-page"); // Optional: navigate on critical error
      }
    };

    fetchRole();
  }, [navigate]); // Add navigate to dependency array

  // Effect 2: Authorization Check (Runs when roleUser changes)
  useEffect(() => {
    // Only run the check *after* roleUser has been determined (is not null)
    if (roleUser && roleUser !== "Kepala Operasional Cabang") {
        console.warn(`Unauthorized role: ${roleUser}. Navigating to home.`);
        navigate("/");
    }
  }, [roleUser, navigate]);

  // Effect 3: Fetch Pengajuan Data AND Barang Data (Chained)
  useEffect(() => {
    // Ensure idPengajuan is present before fetching
    if (!idPengajuan) {
        console.warn("ID Pengajuan is missing. Cannot fetch data.");
        // setError("ID Pengajuan tidak ditemukan."); // Optional: Set error state
        // setIsLoading(false); // Optional: Stop loading if we can't proceed
        return; // Stop the effect if idPengajuan is missing
    }

    // Ensure the user role allows this fetch (optional but good practice)
    // This prevents unnecessary fetches if the role check in Effect 2 will navigate away anyway
    if (roleUser && roleUser !== "Kepala Operasional Cabang") {
        console.log("Role check pending or user not authorized, skipping data fetch.");
        return;
    }


    const fetchDataAndBarang = async () => {
      setIsLoading(true); // Start loading
      setError(""); // Clear previous errors
      let fetchedNomorCabang: string | null = null; // Variable to hold the fetched number

      // --- Fetch Pengajuan Data ---
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found");
          setError("Sesi tidak valid. Silakan login kembali.");
          setIsLoading(false);
          navigate("/unauthorized"); // Navigate if token is missing mid-process
          return;
        }

        console.log(`Fetching pengajuan data for ID: ${idPengajuan}`);
        const response = await pengadaanCAservice.getPengajuan(
          accessToken,
          idPengajuan
        );

        if (response.status !== 200) {
          console.error("Failed to fetch pengajuan data, status:", response.status);
          setError(`Gagal mengambil data pengajuan (Status: ${response.status})`);
          setIsLoading(false);
          return;
        }

        const data = response.data as InputStokBarangTotalResponse;
        setProducts(data.listInputStokBarang || []); // Use default empty array
        setTotalHarga((data.totalHarga || 0).toString());       // Convert to string
        setNomorCabang(data.nomorCabang);
        setStep(data.step);
        fetchedNomorCabang = data.nomorCabang; // Store locally for the next fetch
        console.log("Pengajuan data fetched successfully:", data);

      } catch (error) {
        console.error("Error fetching pengajuan data:", error);
        setError("Terjadi kesalahan saat mengambil data pengajuan.");
        setIsLoading(false);
        return; // Stop if pengajuan fetch failed
      }

      // --- Fetch Barang Data (only if nomorCabang was fetched successfully) ---
      if (fetchedNomorCabang) {
         console.log(`Fetching barang data for Cabang: ${fetchedNomorCabang}`);
         try {
            const response = await pengadaanCAservice.getBarang(fetchedNomorCabang);
            if (response.status !== 200) {
              console.error("Error fetching barang data, status:", response.status);
              setError(`Gagal mengambil data barang (Status: ${response.status})`);
              // Keep existing barang data or clear it? Decide based on requirements.
              // setBarang([]);
              setIsLoading(false); // Still finish loading state
              return;
            }

            const data = response.data as stokBarang[];
            setBarang(data || []); // Use default empty array
            console.log("Barang data fetched successfully:", data);

          } catch (error) {
            console.error("Error fetching barang data:", error);
            setError("Terjadi kesalahan saat mengambil data barang.");
             // setBarang([]); // Clear barang on error?
          }
      } else {
          console.warn("Nomor Cabang was not available after fetching pengajuan data. Cannot fetch barang data.");
          // Optionally set an error if barang data is crucial and nomorCabang was expected
          // setError("Nomor Cabang tidak ditemukan, data barang tidak dapat diambil.");
      }

      setIsLoading(false); // Finish loading after both fetches (or errors)
    };

    fetchDataAndBarang();

    // Add dependencies: idPengajuan triggers the fetch.
    // roleUser is added because the fetch logic depends on it (optional check inside).
    // navigate is added because it's used inside.
  }, [idPengajuan, roleUser, navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  // Make sure role is checked before rendering sensitive content
  if (!roleUser || roleUser !== "Kepala Operasional Cabang") {
    // This might be redundant if Effect 2 already navigated, but acts as a safety net
    // or handles the brief moment before navigation occurs.
    return <div>Unauthorized or checking role...</div>;
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = e.target.value;
  
      const item = barang.find(
        (item) => item.kodeBarang.toString() === selectedValue
      );
  
      setSelectedItem(item || null);
      console.log("Selected item:", item);
      setStok(item ? item.stokBarang.toString() : "-");
      setStokPusat(item ? item.stokBarangPusat.toString() : "-");
    };
  
    const handleAddRow = () => {
      if (!selectedItem || !inputStok.trim()) return;
  
      setRowsInput([...rowsInput, { ...selectedItem, inputStok: parseInt(inputStok) }]);
      setInputStok("");
    };
  
    const handleDeleteRow = (index: number) => {
      setRowsInput(rowsInput.filter((_, i) => i !== index));
    };

  if (!idPengajuan) {
    return <p>ID Pengajuan tidak ditemukan</p>;
  }

  const handleSetuju = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      if (!nomorCabang) {
        alert("Nomor Cabang not found");
        return;
      }

      const stockData = {
        listInputBarang: rowsInput.map(({ kodeBarang, inputStok }) => ({
          kodeBarang,
          stokInput: inputStok,
        })),
      };


      const response = await pengadaanCAservice.pengecekanKepalaCabang(
        accessToken,
        idPengajuan,
        true,
        nomorCabang,
        keterangan,
        stockData
      );

      if (response.data !== true) {
        console.error("Failed to approve");
        return;
      }

      if (response.data === true) {
        console.log("Approved");
        alert("Pengajuan berhasil disetujui");
        navigate(`/pengadaan-cabang-asli/cabang/${nomorCabang}`);
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleGanti = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      if (!nomorCabang) {
        alert("Nomor Cabang not found");
        return;
      }

      setShowAlternative(!showAlternative)
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

  const handleSubmit = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found");
          alert("Access token not found. Please log in.");
          return;
        }

        if (!nomorCabang) {
          alert("Nomor Cabang not found");
          return;
        }
  
        const stockData = {
          listInputBarang: rowsInput.map(({ kodeBarang, inputStok }) => ({
            kodeBarang,
            stokInput: inputStok,
          })),
        };

        if(stockData.listInputBarang.length == 0) {
          alert("Harap isi stokBarang")
        }
  
        const response = await pengadaanCAservice.pengecekanKepalaCabang(
          accessToken,
          idPengajuan,
          false,
          nomorCabang,
          keterangan,
          stockData
        );
  
        // Ensure response structure is handled correctly
        if (response && response.status >= 200 && response.status < 300) {
          alert("Pengajuan Selesai");
          navigate(`/pengadaan-cabang-asli/cabang/${nomorCabang}`);
          setRowsInput([]); // Clear rows after successful submission
        } else {
          console.error("Failed to update stock", response);
          alert(`Failed to update stock: ${response.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error submitting stock data:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        alert(`An error occurred: ${errorMessage}`);
      }
    };
  

  return (
    <div className="flex flex-col pb-10">
      <h1 className="py-5 ps-5">
        {roleUser === "Kepala Operasional Cabang" 
          ? "Halaman Persetujuan Pengadaan Cabang"
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
          filterField="stokInput"
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
      {roleUser === "Kepala Operasional Cabang" ? (
        <div className="flex justify-end mt-4">
          {step == 4 ? (
            <button
            onClick={handleSetuju}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
          >
            Setujui
          </button>
          ) : "" }
          
          <button 
          onClick={handleGanti}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Revisi
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="mt-6 border-t border-gray-200 pt-6">
                    <KeteranganList idPengajuan={idPengajuan} />
      </div>
      <div>
        { showAlternative && (
          <div className=" p-6 rounded-lg shadow-md">
          {barang.length === 0 ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-xl shadow-md   space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Form Input Stok Barang Cabang
                </h2>
  
                <p className="text-sm text-gray-500">
                  Silakan pilih barang dan masukkan jumlah stok yang ingin
                  ditambahkan.
                </p>
  
                <div className="text-sm text-gray-600 font-medium">
                  Role User: <span className="text-blue-600">{roleUser}</span>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Nomor Cabang: {nomorCabang}
                </div>
  
                {/* Dropdown */}
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Pilih Barang
                  </label>
                  <select
                    title="select"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleSelectChange}
                  >
                    <option value="">Pilih Barang</option>
                    {barang.map((item) => (
                      <option key={item.kodeBarang} value={item.kodeBarang}>
                        {item.kodeBarang} - {item.namaBarang}
                      </option>
                    ))}
                  </select>
                </div>
  
                {/* Stok Display */}
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Stok Barang Saat Ini
                  </label>
                  <p className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-800">
                    {stok}
                  </p>
                </div>
  
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Stok Pusat Saat Ini
                  </label>
                  <p className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-800">
                    {stokPusat}
                  </p>
                </div>
  
                {/* Input Tambah Stok */}
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Jumlah Stok yang Ditambahkan
                  </label>
                  <input
                    type="number"
                    value={inputStok}
                    onChange={(e) => setInputStok(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Contoh: 10"
                  />
                </div>
  
                {/* Button */}
                <div className="pt-2">
                  <button
                    onClick={handleAddRow}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
                  >
                    Tambah ke Tabel
                  </button>
                </div>
              </div>
              <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="p-3 border">Barang</th>
                      <th className="p-3 border">Stok Cabang</th>
                      <th className="p-3 border">Stok Pusat</th>
                      <th className="p-3 border">Stok Ditambahkan</th>
                      <th className="p-3 border">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsInput.map((row, index) => (
                      <tr key={index} className="border">
                        <td className="p-3 border">{row.namaBarang}</td>
                        <td className="p-3 border text-center">
                          {row.stokBarang}
                        </td>
                        <td className="p-3 border text-center">
                          {stokPusat}
                          </td>  
  
                        <td className="p-3 border text-center">
                          {row.inputStok}
                        </td>
                        <td className="p-3 border text-center">
                          <button
                            onClick={() => handleDeleteRow(index)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Input Barang
                </button>
              </div>
            </>
          )}
        </div>
        )}
        </div>
    </div>
  );
};

export default PersetujuanKepalaCA;
