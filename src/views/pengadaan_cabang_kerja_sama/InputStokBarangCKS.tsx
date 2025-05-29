import { useState, useEffect } from "react";
import authenticationService from "../../services/authentication";
import { useNavigate, useParams } from "react-router-dom";
import { stokBarang } from "../../interface/CabangAsli";
import axios from "axios";
import pengadaanCKSservice from "../../services/pengadaanCKSservice";

const InputStokBarangCKS = () => {
  const { nomorCabang } = useParams<{ nomorCabang: string }>();
  const [selectedItem, setSelectedItem] = useState<stokBarang | null>(null);
  const [stok, setStok] = useState<string>("-");
  const [inputStok, setInputStok] = useState<string>("");
  const [roleUser, setRoleUser] = useState<string | null>(null);
  const [stokPusat, setStokPusat] = useState<string>("-");
  const [hargaBarang, setHargaBarang] = useState<string>("0");
  const [rows, setRows] = useState<
    {
      kodeBarang: string;
      namaBarang: string;
      stokBarang: number;
      stokBarangPusat: number;
      hargaBarang: string;
      inputStok: number;
    }[]
  >([]);
  const [barang, setBarang] = useState<stokBarang[]>([]);
  const [totalHarga, setTotalHarga] = useState<number>(0);
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

    const fetchBarang = async () => {
      try {
        if(!nomorCabang) {
            console.error("Nomor Cabang not found");
            return;
        }
        const response = await pengadaanCKSservice.getBarang(nomorCabang);
        if (response.status !== 200) {
          console.error("Error fetching data");
          return;
        }

        const data = response.data as stokBarang[];

        setBarang(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBarang();
  }, []);

  const calculateTotalHarga = () => {
    const total = rows.reduce((acc, row) => {
      let harga = 0; // Default harga to 0
  
      // Check if hargaBarang is a string before trying to replace
      if (typeof row.hargaBarang === 'string') {
        // Only perform string operations if it's actually a string
        const cleanedHargaString = row.hargaBarang.replace(/\./g, "").replace("Rp", "").trim();
        harga = parseFloat(cleanedHargaString) || 0; // Use || 0 as fallback for parseFloat NaN
      } else if (typeof row.hargaBarang === 'number') {
        // If it's already a number, just use it directly
        harga = row.hargaBarang;
      }
      // If it's null, undefined, or other types, harga remains 0
  
      // Also ensure inputStok is treated as a number
      const inputStok = Number(row.inputStok) || 0; // Use Number() for conversion, fallback to 0
  
      return acc + harga * inputStok;
    }, 0);
    setTotalHarga(total);
  };

  useEffect(() => {
    calculateTotalHarga();
  }, [rows]);

  useEffect(() => {
    if (roleUser && roleUser !== "Kepala Operasional Cabang") {
      navigate("/");
    }
  }, [roleUser, navigate]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    const item = barang.find(
      (item) => item.kodeBarang.toString() === selectedValue
    );

    setSelectedItem(item || null);
    console.log("Selected item:", item);
    setStok(item ? item.stokBarang.toString() : "-");
    setStokPusat(item ? item.stokBarangPusat.toString() : "-");
    setHargaBarang(item ? item.hargaBarang.toString() : "0");
    calculateTotalHarga(); 
  };

  const handleAddRow = () => {
    // Basic validation
    if (!selectedItem) {
        alert("Silakan pilih barang terlebih dahulu.");
        return;
    }
    const parsedInputStok = parseInt(inputStok, 10);
    if (!inputStok.trim() || isNaN(parsedInputStok) || parsedInputStok <= 0) {
        alert("Masukkan jumlah stok yang valid (angka positif).");
        return;
    }

    // Check if item already exists in rows
    const existingRowIndex = rows.findIndex(row => row.kodeBarang === selectedItem.kodeBarang);

    if (existingRowIndex !== -1) {
        // Option 1: Alert and don't add
        // alert(`Barang '${selectedItem.namaBarang}' sudah ada di tabel.`);
        // return;

        // Option 2: Update existing row (add to inputStok) - Choose one approach
        const updatedRows = [...rows];
        updatedRows[existingRowIndex].inputStok += parsedInputStok;
        setRows(updatedRows);
        alert(`Jumlah untuk barang '${selectedItem.namaBarang}' telah diperbarui.`);

    } else {
        // Add new row
        setRows([
          ...rows,
          {
            kodeBarang: selectedItem.kodeBarang,
            namaBarang: selectedItem.namaBarang,
            stokBarang: selectedItem.stokBarang,
            hargaBarang: selectedItem.hargaBarang,
            stokBarangPusat: selectedItem.stokBarangPusat, // Make sure this exists on selectedItem
            inputStok: parsedInputStok, // Use parsed value
          },
        ]);
    }

    setInputStok("");
    // Consider resetting the dropdown visually if needed, though state holds the value
  };

  const handleDeleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // 1. Check if rows array is empty
    if (rows.length === 0) {
      alert("Tidak ada barang yang ditambahkan ke tabel. Silakan tambahkan barang terlebih dahulu.");
      return;
    }

    // 2. Check for items exceeding central stock
    const itemsExceedingStock = rows.filter(
      (row) => row.inputStok > row.stokBarangPusat
    );

    if (itemsExceedingStock.length > 0) {
      // Build a message listing items that exceed stock (optional but helpful)
      const itemNames = itemsExceedingStock
        .map((row) => `${row.namaBarang} (diminta: ${row.inputStok}, pusat: ${row.stokBarangPusat})`)
        .join(", ");

      const confirmationMessage = `Peringatan: Jumlah stok yang diminta untuk item berikut melebihi stok yang tersedia di pusat:\n- ${itemNames}\n\nYakin ingin melanjutkan pengajuan?`;

      const isConfirmed = window.confirm(confirmationMessage);

      if (!isConfirmed) {
        console.log("Submission cancelled by user due to stock warning.");
        alert("Pengajuan dibatalkan."); // Provide feedback
        return; // Stop the submission
      }
      // If confirmed, proceed...
      console.log("User confirmed submission despite stock warning.");
    }

    // 3. Proceed with the submission logic
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        alert("Sesi tidak valid. Silakan login kembali.");
        navigate("/unauthorized"); // Navigate if token is missing
        return;
      }

      // Make sure nomorCabang is available
      if (!nomorCabang) {
        console.error("Nomor Cabang parameter is missing.");
        alert("Nomor Cabang tidak ditemukan. Tidak dapat melanjutkan.");
        return;
      }


      const stockData = {
        listInputBarang: rows.map(({ kodeBarang, inputStok }) => ({
          kodeBarang,
          stokInput: inputStok, 
        })),
      };

      console.log("Submitting stock data:", stockData, "for Cabang:", nomorCabang);

      const response = await pengadaanCKSservice.AddStockService(
        accessToken,
        stockData.listInputBarang,
        nomorCabang 
      );

      if (response && response.status >= 200 && response.status < 300) {
         // Assuming success gives back some data or just status 2xx
        console.log("Stock update successful:", response.data || 'No data returned');
        alert("Pengajuan berhasil diajukan.");
        navigate(`/pengadaan-cabang-asli/cabang/${nomorCabang}`); // Redirect after successful submission
        setRows([]); 
      } else {
        // Handle non-2xx responses that aren't exceptions
        const errorMessage = (response?.data as { message?: string })?.message || response?.message || `Gagal memperbarui stok (Status: ${response?.status || 'unknown'})`;
        console.error("Failed to update stock:", response);
        alert(`Gagal memperbarui stok: ${errorMessage}`);
      }
    } catch (error: unknown) {
      console.error("Error submitting stock data:", error);
    
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
    
      if (axios.isAxiosError(error)) {
        // If it's an Axios error, we can safely access error.response
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        // If it's a general JS error (e.g. throw new Error)
        errorMessage = error.message;
      }
    
      alert(`Terjadi kesalahan saat mengirim data: ${errorMessage}`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className=" p-6 rounded-lg shadow-md">
        {barang.length === 0 ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-xl shadow-md   space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Form Input Stok Barang Cabang Kerja Sama
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

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Harga Barang
                </label>
                <p className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-800">
                 {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(hargaBarang))}
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
                    <th className="p-3 border">Harga Barang</th>
                    <th className="p-3 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
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
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(row.hargaBarang))}
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
            <div className="mt-4 text-center ">
                <p className="my-4 text-lg font-semibold text-gray-800 text-right">
               Total Harga :   {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(totalHarga))}

              </p>
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
    </div>
  );
};

export default InputStokBarangCKS;
