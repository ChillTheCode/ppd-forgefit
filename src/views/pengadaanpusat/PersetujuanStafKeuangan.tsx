import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pengadaanpusat from "../../services/pengadaanpusat";
import { InputStokBarangTotalResponse, InputStokBarangResponse } from "../../interface/PengadaanPusat";
import authenticationService from "../../services/authentication";
import { Barang } from "../../interface/PengadaanPusat";
import pengadaanCKSservice from "../../services/pengadaanCKSservice";


const PersetujuanStafKeuangan = () => {
  const { idPengajuan } = useParams<{ idPengajuan: string }>();
 

  const [products, setProducts] = useState<InputStokBarangResponse[]>();
  const [filters, setFilters] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
    namaBarang: { value: null, matchMode: FilterMatchMode.CONTAINS },
    kategoriBarang: { value: null, matchMode: FilterMatchMode.EQUALS },
    hargaBarang: { value: null, matchMode: FilterMatchMode.CONTAINS },
    stok: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [keterangan, setKeterangan] = useState<string>("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Barang | null>(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [totalHarga, setTotalHarga] = useState<string>("");
  const [roleUser, setRoleUser] = useState<string | null>(null);

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
        if (roleUser && roleUser !== "Staf keuangan" ) {
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
        const response = await pengadaanpusat.getPengajuan(
          accessToken,
          idPengajuan
        );

        if(response.status !== 200) {
          console.error("Failed to fetch data");
          return;
        }

        const data = response.data as InputStokBarangTotalResponse;
        setProducts(data.listInputStokBarang);
        setTotalHarga(data.totalHarga);
      
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [idPengajuan]);

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
  
        const response = await pengadaanpusat.persetujuanStafKeuangan(
          accessToken, idPengajuan, true, keterangan
        )
  
        if(response.data !== true) {
          console.error("Failed to approve");
          return;
        }
  
        if(response.data === true) {
          console.log("Approved");
          alert("Pengajuan berhasil disetujui");
          navigate("/pengadaan-pusat");
        }
  
      } catch (error) {
        console.error("Error approving request:", error);
      }
    };

    const tambahKeterangan = async () => {
        const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            console.error("Access token not found");
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

  const renderHeader = () => {
    return (
      <div className="flex justify-between p-4 bg-gray-100 rounded-lg">
        <span className="p-input-icon-left">
          <InputText
            placeholder="Global Search"
            className="p-inputtext-sm"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
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

  return (
    <div className="flex flex-col pb-10">
      <h1 className="py-5 ps-5">Persetujuan Staf Keuangan</h1>
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
          "kategoriBarang",
          "hargaBarang",
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
          field="kategoriBarang"
          header="Kategori"
          sortable
          filter
          filterElement={(options) => (
            <Dropdown
              value={options.value}
              options={["Electronics", "Clothing", "Accessories"]}
              onChange={(e) => options.filterApplyCallback(e.value)}
              placeholder="Pilih Kategori"
              showClear
              className="w-full p-2"
            />
          )}
          className="p-2"
        />
        <Column
          field="hargaBarang"
          header="Harga"
          filter
          filterField="hargaBarang"
          filterPlaceholder="Cari Berdasarkan Harga"
          filterMatchMode={FilterMatchMode.CONTAINS}
          sortable
          className="p-2"
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
      </DataTable>
      
      <div className="flex justify-end mt-4">
        <p className="text-lg font-semibold">Total Harga: {totalHarga}</p>
      </div>

      <div>
        <div className="mt-4">
          <button
        onClick={() => setKeterangan((prev) => (prev ? "" : " "))}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
        {keterangan ? "Tutup Keterangan" : "Buka Keterangan"}
          </button>
        </div>
        {keterangan && (
          <div className="mt-4">
        <label
          htmlFor="keterangan"
          className="block text-sm font-medium text-gray-700"
        >
          Keterangan
        </label>
        <textarea
          id="keterangan"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Jika ada, Masukkan keterangan di sini"
        />
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button 
        onClick={handleSetuju}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">
          Setujui
        </button>
        <button 
        onClick={tambahKeterangan}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Revisi
        </button>
      </div>
    </div>
  );
};

export default PersetujuanStafKeuangan;
