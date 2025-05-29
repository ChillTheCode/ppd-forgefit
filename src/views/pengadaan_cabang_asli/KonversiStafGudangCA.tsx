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
} from "../../interface/CabangAsli";
import authenticationService from "../../services/authentication";
import { Barang } from "../../interface/PengadaanPusat";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import { UserOptions } from 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import logoLia from "../../assets/logo_lia.png";
import KeteranganList from "../../components/KeteranganList";


const KonversiStafGudangCA = () => {
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
  const [flagCabang, setFlagCabang] = useState<boolean>(false);
  const [haveExported, setHaveExported] = useState(false); // State to track if PDF has been exported

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
        setFlagCabang(data.flag);
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
      const response = await pengadaanCAservice.pengecekanStafGudang(
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
        navigate(`/pengadaan-cabang-asli/cabang/001`);
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
      const response = await pengadaanCAservice.pengecekanStafGudang(
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

    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = 14; // Left margin
    const logoY = 10; // Top margin

    // Add logo (make sure logoLia is valid base64 or similar)
    doc.addImage(logoLia, 'PNG', logoX, logoY, logoWidth, logoHeight);
    console.log('Logo added at X:', logoX, 'Y:', logoY);

    // --- Text Content & Positioning ---
    let tableTitle = "";
    if (flagCabang) {
      tableTitle = "Laporan Pengajuan Barang Cabang Asli" ;
    } else {
      tableTitle = "Laporan Pengajuan Barang Cabang Kerja Sama";
    }
    
    // **FIXED:** Added backticks for the template literal
    const tableSubtitle = `ID Pengajuan: ${idPengajuan} | Nomor Cabang: ${nomorCabang || 'N/A'}`;
    const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    const textStartX = logoX; // Align text start with logo start X
    const contentStartY = logoY + logoHeight + 10; // Start content 10mm below logo's bottom edge
    const lineSpacingTitle = 8; // Space after title (adjust as needed)
    const lineSpacingSubtitle = 8; // Space after subtitle (adjust as needed)
    const lineSpacingParagraph = 10; // Space after paragraph (adjust as needed)

    // Calculate available width for text wrapping
    const pageMarginRight = 14; // Right margin consistent with left
    const pageWidth = doc.internal.pageSize.getWidth(); // Get page width (e.g., 210 for A4)
    const textMaxWidth = pageWidth - textStartX - pageMarginRight;

    let currentY = contentStartY; // Keep track of the current vertical position

    // Add Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold'); // Optional: make title bold
    doc.text(tableTitle, textStartX, currentY, { baseline: 'top' }); // Align top of text to currentY
    doc.setFont('helvetica', 'normal'); // Reset font style
    currentY += lineSpacingTitle; // Move down for the next element
    console.log('Title added at Y:', contentStartY, '-> next Y:', currentY);


    // Add Subtitle
    doc.setFontSize(12);
    doc.text(tableSubtitle, textStartX, currentY, { baseline: 'top' }); // Align top of text
    currentY += lineSpacingSubtitle; // Move down
    console.log('Subtitle added -> next Y:', currentY);


    // Add Lorem Ipsum Paragraph
    doc.setFontSize(10); // Standard paragraph font size
    // Use maxWidth option for automatic wrapping
    doc.text(loremIpsum, textStartX, currentY, { maxWidth: textMaxWidth, baseline: 'top' });

    // Estimate height of wrapped text (more accurate way involves getTextDimensions)
    // For now, let's add a fixed space. You might need to adjust 'lineSpacingParagraph'.
    // A rough estimate: count lines (e.g., loremIpsum.length / chars_per_line) * line_height
    // Or just add generous spacing:
    currentY += lineSpacingParagraph; // Move down past the paragraph
    console.log('Lorem Ipsum added -> next Y:', currentY);


    // --- Set startYPos for subsequent content (like your table) ---
    // This 'currentY' now represents the position below the lorem ipsum paragraph
    const startYPos = currentY + 5; // Add a little extra padding before the table
    console.log('Final startYPos for table:', startYPos);

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
      // --- Total Harga Section ---
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const totalText = `Total Harga: ${formatCurrency(Number(totalHarga))}`; // Ensure formatting works
      const textWidth = doc.getTextWidth(totalText);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight(); // Get page height for checks
      const rightPadding = 15; // Desired padding from the right edge
  
      // Calculate X position for right alignment
      const totalPriceX = pageWidth - textWidth - rightPadding;
  
      // Calculate Y position, ensuring it's below the table and within page bounds
      const spaceBelowTable = 10; // Space between table's finalY and Total Harga
      const bottomMargin = 20; // Minimum space to leave at the bottom
      let totalPriceY = finalY + spaceBelowTable;
  
      // Ensure totalPriceY is not too close to the bottom before adding signatures
      // We need space for the total AND the signatures below it. Estimate signature block height.
      const estimatedSignatureHeight = 40; // Rough estimate in points/mm
      if (totalPriceY + estimatedSignatureHeight > pageHeight - bottomMargin) {
          console.warn("Content nearing page bottom. Consider adding a new page or reducing spacing.");
          // Adjust Y upwards if needed, or trigger new page logic elsewhere
          totalPriceY = pageHeight - bottomMargin - estimatedSignatureHeight;
      }
  
      // Check against startYPos (less critical now, but good sanity check)
      if (totalPriceY < startYPos + 20) {
          console.warn("Calculated Y for Total Price seems too low, potentially overlapping.");
          // This might indicate finalY wasn't calculated correctly from the table
          totalPriceY = Math.max(totalPriceY, startYPos + 20); // Ensure it's at least below header
      }
  
      // Place the Total Harga text
      doc.text(totalText, totalPriceX, totalPriceY);
      doc.setFont('helvetica', 'normal'); // Reset font style
  
      // --- Signature Section ---
      doc.setFontSize(9); // Use a slightly smaller font for signature details
  
      const signaturePaddingTop = 25;  // Space below Total Harga line
      const signatureStartY = totalPriceY + signaturePaddingTop;
      const signatureSpacingY = 18;   // Vertical space allocated FOR the signature itself
      const lineHeightSmall = 5;      // Line height for text like Name/Role
      const namePlaceholder = "(...........................................)"; // Placeholder line for name
  
      const pageLeftMargin = 15;
      const pageRightMargin = 15; // Consistent margin
  
      // Calculate X positions for two blocks (Left and Right)
      const leftBlockX = pageLeftMargin;
      // Position the right block relative to the right margin. Adjust width estimate if needed.
      const rightBlockX = pageWidth - pageRightMargin - 70; // Adjust '70' based on expected text width
  
      // Check if signature section fits vertically
      const signatureBlockEndY = signatureStartY + signatureSpacingY + (3 * lineHeightSmall); // Estimate end Y
      if (signatureBlockEndY > pageHeight - bottomMargin) {
          console.warn("Signature section might be cut off. Consider new page or less spacing.");
          // Optionally: Don't draw signatures if they don't fit
          // Or trigger new page logic before drawing them
      } else {
          // Get current date (customize format as needed)
          const currentDate = new Date().toLocaleDateString('id-ID', { // Indonesian locale example
              day: '2-digit',
              month: 'long',
              year: 'numeric'
          });
          // Or simpler: const currentDate = new Date().toLocaleDateString();
  
          // --- Block 1: Staf Gudang (Left) ---
          let currentSignatureY_Left = signatureStartY;
          doc.text(`Tanggal: ${currentDate}`, leftBlockX, currentSignatureY_Left);
          currentSignatureY_Left += signatureSpacingY; // Move down for signature space
          doc.text(namePlaceholder, leftBlockX, currentSignatureY_Left);
          currentSignatureY_Left += lineHeightSmall;
          // doc.text(`Nama:`, leftBlockX, currentSignatureY_Left); // Optional explicit label
          // currentSignatureY_Left += lineHeightSmall;
          doc.text("Staf Gudang Pelaksana Umum", leftBlockX, currentSignatureY_Left);
  
          // --- Block 2: Kepala Operasional (Right) ---
          let currentSignatureY_Right = signatureStartY; // Reset Y for the second block
          doc.text(`Tanggal: ${currentDate}`, rightBlockX, currentSignatureY_Right);
          currentSignatureY_Right += signatureSpacingY; // Move down for signature space
          doc.text(namePlaceholder, rightBlockX, currentSignatureY_Right);
          currentSignatureY_Right += lineHeightSmall;
          // doc.text(`Nama:`, rightBlockX, currentSignatureY_Right); // Optional explicit label
          // currentSignatureY_Right += lineHeightSmall;
          doc.text("Kepala Operasional Cabang", rightBlockX, currentSignatureY_Right);
      }
  
  } else {
      console.warn("Final Y position estimate failed, skipping Total Harga and Signatures.");
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
  setHaveExported(true); // Set state to indicate PDF has been exported
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
          ? "Halaman Informasi Pengajuan Cabang"
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
          {haveExported && (
            <button
              onClick={handleSetuju}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
            >
              Setujui
            </button>
          )}
          <button onClick={handlePending} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Tambah Komentar
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

export default KonversiStafGudangCA;
