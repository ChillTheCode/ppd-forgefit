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
import {
  InputStokBarangTotalResponse,
  InputStokBarangResponse,
} from "../../interface/CabangAsli";
import authenticationService from "../../services/authentication";
import { Barang } from "../../interface/PengadaanPusat";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import { UserOptions } from 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import pengadaanCKSservice from "../../services/pengadaanCKSservice";
import logoLia from "../../assets/logo_lia.png";
import KeteranganList from "../../components/KeteranganList";


const KonversiStafGudangCKS = () => {
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
    if (roleUser && roleUser !== "Staf Gudang Pelaksana Umum") {
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
        const response = await pengadaanCKSservice.getPengajuan(
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

      if (!nomorCabang) {
        alert("Nomor Cabang not found");
        return;
      }
      const response = await pengadaanCKSservice.pengecekanStafGudang(
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
        navigate(`/pengadaan-cabang-kerja-sama/cabang/001`);
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handlePending = async () => {
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

      if(!keterangan) {
        alert("Keterangan Harus di isi")
      }
      const response = await pengadaanCKSservice.pengecekanStafGudang(
        accessToken,
        idPengajuan,
        false,
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
        navigate(`/pengadaan-cabang-kerja-sama/cabang/001`);
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

  const exportPdf = () => {
    if (!products || products.length === 0) {
      alert("Tidak ada data untuk di-export.");
      return;
    }

    // Create a standard jsPDF instance
    const doc = new jsPDF();

    // --- Check if autoTable was imported correctly ---
    if (typeof autoTable !== 'function') {
        console.error("Error: jspdf-autotable was not imported as a function. Check library installation and import statement.");
        alert("PDF Export failed: autoTable function not available.");
        return;
    }

    // Define columns (same as before)
    const exportColumns = [
      { header: "Kode Barang", dataKey: "kodeBarang" as keyof InputStokBarangResponse },
      { header: "Nama", dataKey: "namaBarang" as keyof InputStokBarangResponse },
      { header: "Harga Satuan", dataKey: "hargaBarang" as keyof InputStokBarangResponse },
      { header: "Stok Saat Ini", dataKey: "stokSaatIni" as keyof InputStokBarangResponse },
      { header: "Stok Masuk", dataKey: "stokInput" as keyof InputStokBarangResponse },
      { header: "Stok Pusat", dataKey: "stokPusatSaatIni" as keyof InputStokBarangResponse },
    ];

    // Prepare table data (same as before)
    const tableData = products.map(prod => {
      return exportColumns.map(col => {
        const value = prod[col.dataKey];
        if (col.dataKey === 'hargaBarang') {
          return formatCurrency(Number(value));
        }
        return value !== null && value !== undefined ? String(value) : '';
      });
    });

    const tableTitle = "Laporan Pengajuan Barang Cabang Kerja Sama";
    const tableSubtitle = `ID Pengajuan: ${idPengajuan} | Nomor Cabang: ${nomorCabang || 'N/A'}`;
    const startYPos = 40; // Adjusted to move the title below the logo

    // Add logo
    const logoWidth = 30; // Adjust width as needed
    const logoHeight = 30; // Adjust height as needed
    const logoX = 14; // X position for the logo
    const logoY = 10; // Y position for the logo
    doc.addImage(logoLia, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Add title and subtitle
    doc.setFontSize(16);
    doc.text(tableTitle, logoX, logoY + logoHeight + 10); // Position title below the logo
    doc.setFontSize(12);
    doc.text(tableSubtitle, logoX, logoY + logoHeight + 17); // Position subtitle below the title

    // Define autoTable options with the UserOptions type
    const autoTableOptions: UserOptions = {
      head: [exportColumns.map(col => col.header)],
      body: tableData,
      startY: startYPos,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      didDrawPage: (data) => {
         try {

          interface InternalWithPages {
            getNumberOfPages: () => number;
          }
          
          const pageCount = (doc.internal as unknown as InternalWithPages).getNumberOfPages();
          
            doc.setFontSize(8);
            doc.text(`Halaman ${data.pageNumber} dari ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
         } catch (e) {
             console.error("Error drawing page footer:", e);
         }
      },
    };

    // --- Call autoTable AS A FUNCTION, passing the doc instance ---
    // The line causing the error previously was likely similar to (doc as ...).autoTable(...)
    // This line calls the imported function directly:
    autoTable(doc, autoTableOptions); // Pass doc as the first argument

    // --- Accessing final Y position (CAUTION) ---
    // When calling autoTable functionally, it DOES NOT typically modify the 'doc'
    // instance to add 'lastAutoTable'. We must estimate or find another way.
    
    console.warn("Attempting to estimate final Y position after table. 'lastAutoTable' is not reliably available with the functional autoTable call.");
    // Estimate based on start position, rows, and estimated heights
    const rowHeightEstimate = 6; // Adjust based on font size/padding
    const headerHeightEstimate = 8;
    const finalY = startYPos + headerHeightEstimate + (tableData.length * rowHeightEstimate) + 5; // Add some buffer

    // Add Total Price (check finalY)
    if (typeof finalY === 'number') {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const totalText = `Total Harga: ${formatCurrency(Number(totalHarga))}`; // Ensure totalHarga is a number if needed by formatCurrency, or adjust formatCurrency
      const textWidth = doc.getTextWidth(totalText);
      const pageWidth = doc.internal.pageSize.getWidth();
      const rightPadding = 15; // Define desired padding from the right edge in points

      // Calculate X position for right alignment using padding
      const totalPriceX = pageWidth - textWidth - rightPadding;

      // Calculate Y position (same logic as before)
      const totalPriceY = Math.min(finalY + 10, doc.internal.pageSize.height - 20);

      // Place the text using the calculated X position
      if (totalPriceY < startYPos + 20) {
          console.warn("Calculated Y for Total Price seems too low, placing near top.");
          // Use calculated X, but adjusted Y
          doc.text(totalText, totalPriceX, startYPos + 20);
      } else {
          // Use calculated X and Y
          doc.text(totalText, totalPriceX, totalPriceY);
      }
  } else {
       console.warn("Final Y position estimate failed, skipping Total Harga.");
  }


  // --- Add Keterangan (Revised Available Width Calculation) ---
  if (keterangan.trim() && typeof finalY === 'number') {
      let keteranganY = finalY + (totalHarga ? 20 : 10); // Position below estimated total
      const pageHeight = doc.internal.pageSize.height;
      const marginBottom = 25; // Bottom margin/footer space

      if (keteranganY > pageHeight - marginBottom || keteranganY < startYPos + 30) {
          console.warn("Calculated Y for Keterangan is out of bounds, adding new page.");
          doc.addPage();
          keteranganY = 20; // Start near top of new page
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const leftPadding = 14; // Standard left margin often used
      const rightPaddingForWrap = 14; // Padding on the right for wrapping
      const pageWidthForWrap = doc.internal.pageSize.getWidth();

      // Calculate available width for text wrapping using fixed padding
      const availableWidth = pageWidthForWrap - leftPadding - rightPaddingForWrap;

      doc.text("Keterangan:", leftPadding, keteranganY); // Use leftPadding for X position
      const splitKeterangan = doc.splitTextToSize(keterangan, availableWidth);
      doc.text(splitKeterangan, leftPadding, keteranganY + 5); // Use leftPadding for X position
  } else if (keterangan.trim()) {
      console.warn("Final Y position estimate failed, skipping Keterangan.");
  }


  // Save the PDF (remains the same)
  const fileName = `pengajuan_${idPengajuan}_${nomorCabang || 'cabang'}.pdf`;
  doc.save(fileName);
}; // End of exp

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
        <Button
            label="Export PDF"
            icon="pi pi-file-pdf"
            className="p-button-warning p-button-sm"
            onClick={exportPdf}
            tooltip="Download table data as PDF"
            tooltipOptions={{ position: 'top' }}
            disabled={!products || products.length === 0} // Disable if no data
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col pb-10">
      <h1 className="py-5 ps-5">
        {roleUser === "Staf Gudang Pelaksana Umum"
          ? "Halaman Informasi Pengajuan Cabang Kerja Sama"
          : "Informasi Pengajuan"}
      </h1>
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
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
        filterDisplay="menu"
        stripedRows
        responsiveLayout="scroll"
        sortField="namaBarang"
        sortOrder={1}
        emptyMessage="Tidak ada data pengajuan ditemukan."
        className=" rounded-lg overflow-hidden p-datatable-sm"
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
              className="w-full" 
              placeholder="Jika ada, masukkan keterangan di sini..."
              autoResize
            />
          </div>
        )}
      </div>
      {roleUser === "Staf Gudang Pelaksana Umum" ? (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSetuju}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
          >
            Setujui
          </button>
          <button onClick={handlePending} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Pending
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="mt-6 border-t border-gray-200 pt-6">
                    <KeteranganList idPengajuan={idPengajuan} />
              </div>
    </div>
  );
};

export default KonversiStafGudangCKS;
