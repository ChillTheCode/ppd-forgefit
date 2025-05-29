import React, { useState, useEffect, useRef } from "react";
import authenticationService from "../../services/authentication";
import { useNavigate, useParams } from "react-router-dom";
import pengadaanCAservice from "../../services/pengadaanCAservice";
import { StokBarangResponseDTO } from "../../interface/PengadaanPusat";
import axios from "axios";
import { RowData } from "../../interface/PengadaanPusat";

const HalamanPenguranganStokBarang = () => {
  const { nomorCabang } = useParams<{ nomorCabang: string }>();

  const [selectedItem, setSelectedItem] = useState<StokBarangResponseDTO | null>(null);
  const [stok, setStok] = useState<string>("-");
  const [inputStok, setInputStok] = useState<string>("");
  const [roleUser, setRoleUser] = useState<string | null>(null);
  // Use the more specific RowData interface for rows state
  const [rows, setRows] = useState<RowData[]>([]);
  const [barang, setBarang] = useState<StokBarangResponseDTO[]>([]);
  const navigate = useNavigate();

  // Select element reference for resetting
  const selectRef = useRef<HTMLSelectElement>(null);


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
        if (!nomorCabang) {
          console.error("Nomor Cabang not found");
          return;
        }
        const response = await pengadaanCAservice.getStokBarangResponseByNomorCabang(nomorCabang);
        if (response.status !== 200) {
          console.error("Error fetching data");
          return;
        }
        console.log("Response data:", response.data); // Log the response data
        const data = response.data as StokBarangResponseDTO[];

        setBarang(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBarang();
  // Removed dependency on 'navigate' from fetchBarang useEffect as it's stable
  }, [nomorCabang]);

  useEffect(() => {
    if (roleUser && roleUser !== "Kepala Operasional Cabang" && roleUser !== "Staf Gudang Pelaksana Umum") {
       // Redirect immediately if role is fetched and invalid
      console.warn("User role is not authorized, redirecting.");
      navigate("/");
    }
  }, [roleUser, navigate]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    // Find the item, handle case where selectedValue is "" (the default option)
    const item = selectedValue
      ? barang.find((item) => item.kodeBarang.toString() === selectedValue)
      : null;

    setSelectedItem(item || null);
    console.log("Selected item:", item);
    setStok(item ? item.stokBarang.toString() : "-");
    setInputStok(""); // Clear input when selection changes
  };

  const handleAddRow = () => {
    // 1. Validate if an item is selected and inputStok has a value
    if (!selectedItem || !inputStok.trim()) {
        alert("Silakan pilih barang dan masukkan jumlah stok yang ingin dikurangi.");
        return;
    }

    // 2. Parse inputStok to a number
    const stokToReduce = parseInt(inputStok, 10); // Use radix 10

    // 3. Validate if inputStok is a positive number
    if (isNaN(stokToReduce) || stokToReduce <= 0) {
      alert("Jumlah stok yang dikurangi harus berupa angka positif.");
      setInputStok(""); // Clear invalid input
      return;
    }

    // 4. ***CORE VALIDATION***: Check if reduction amount exceeds current stock
    if (stokToReduce > selectedItem.stokBarang) {
      alert(
        `Jumlah yang dikurangi (${stokToReduce}) tidak boleh melebihi stok saat ini (${selectedItem.stokBarang}).`
      );
      // Optionally clear or keep the input for correction
      // setInputStok("");
      return; // Stop the function here
    }

    // 5. Check if the item is already in the table
    const existingRowIndex = rows.findIndex(row => row.kodeBarang === selectedItem.kodeBarang);
    if (existingRowIndex !== -1) {
        alert(`Barang "${selectedItem.namaBarang}" sudah ada dalam tabel. Hapus baris yang ada jika ingin mengubah jumlah.`);
        return;
    }


    // 6. If all validations pass, add the new row
    const newRow: RowData = {
        kodeBarang: selectedItem.kodeBarang,
        namaBarang: selectedItem.namaBarang,
        stokBarang: selectedItem.stokBarang, // Store current stock for display
        inputStok: stokToReduce,             // Store the validated reduction amount
    };

    setRows([...rows, newRow]);

    // 7. Reset fields for the next entry
    setSelectedItem(null);
    setStok("-");
    setInputStok("");
    // Reset the select dropdown to the default option
    if (selectRef.current) {
        selectRef.current.value = "";
    }
  };


  const handleDeleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rows.length === 0) {
        alert("Tidak ada barang dalam tabel untuk diinput.");
        return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        navigate("/login"); // Redirect to login
        return;
      }

      // Prepare data in the expected format for the service
      const stockData = {
        listInputBarang: rows.map(({ kodeBarang, inputStok }) => ({
          kodeBarang: kodeBarang,
          stokInput: inputStok, // Ensure the key name matches the backend expectation
        })),
      };

      console.log("Submitting data:", stockData); // Log data being sent

      const response = await pengadaanCAservice.penguranganStockService(
        accessToken,
        stockData.listInputBarang,
        nomorCabang || "" // Ensure nomorCabang is not null/undefined
      );

      // Handle response based on status code or structure
      if (response && response.status === 200) { // Check for successful status
        alert("Pengurangan stok berhasil diproses.");
        setRows([]); // Clear rows after successful submission
         // Optionally refetch barang to update stock display immediately
        const fetchBarang = async () => {
            try {
                if (!nomorCabang) return;
                const updatedResponse = await pengadaanCAservice.getStokBarangResponseByNomorCabang(nomorCabang);
                if (updatedResponse.status === 200) {
                    setBarang(updatedResponse.data as StokBarangResponseDTO[]);
                }
            } catch (error) {
                console.error("Error refetching barang after update:", error);
            }
        };
        fetchBarang();

      } else {
        // Attempt to get a more specific error message
        const errorMessage = (response?.data as { message?: string })?.message || response?.message || "Gagal memperbarui stok.";
        console.error("Failed to update stock", response);
        alert(`Gagal memperbarui stok: ${errorMessage}`);
      }
    } catch (error: unknown) { // Catch specific error types if possible
      console.error("Error submitting stock data:", error);
      // Provide more context if available (e.g., network error, server error)
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
      alert(`Terjadi kesalahan saat mengirim data: ${errorMessage}`);
    }
  };


  // Render Loading state more explicitly
  if (roleUser === null && barang.length === 0) {
    return <div className="p-6 text-center">Loading user data and items...</div>;
  }

  // Handle case where role is checked but not authorized yet (before redirect effect runs)
  // This might cause a flash, the useEffect redirect is generally better
  // if (roleUser && roleUser !== "Kepala Operasional Cabang") {
  //   return <div className="p-6 text-center">Unauthorized access. Redirecting...</div>;
  // }


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className=" p-6 rounded-lg shadow-md">
        {/* Removed the barang.length === 0 check here as loading is handled above */}
        {/* but keep it if you prefer the specific loading message */}
        {/* {barang.length === 0 ? (
          <div className="text-center">Loading item data...</div>
        ) : ( */}
          <>
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <h1 className="text-2xl font-bold mb-2">
                Halaman Pengurangan Stok Barang
              </h1>
              <p className="mb-4">
                Ini adalah halaman untuk mengurangi stok barang di cabang.
              </p>

              <div
                className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
                role="alert"
              >
                <p className="font-bold">Kebijakan dan Prosedur</p>
                <p>
                  Input data pengurangan stok harus dapat dipertanggung
                  jawabkan. Pastikan data yang Anda masukkan sudah benar dan sesuai.
                </p>
              </div>

              <p className="text-sm text-gray-500">
                Silakan pilih barang dan masukkan jumlah stok yang ingin
                dikurangi. Barang yang sama hanya dapat ditambahkan sekali ke tabel.
              </p>

              <div className="text-sm text-gray-600 font-medium">
                Role User: <span className="text-blue-600">{roleUser ?? 'Loading...'}</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Nomor Cabang: <span className="font-semibold">{nomorCabang}</span>
              </div>

              {/* Dropdown */}
              <div>
                <label htmlFor="barangSelect" className="block text-gray-700 mb-1 font-medium">
                  Pilih Barang
                </label>
                <select
                  id="barangSelect"
                  ref={selectRef} // Add ref here
                  title="select"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  onChange={handleSelectChange}
                  value={selectedItem?.kodeBarang?.toString() ?? ""} // Control the select value
                  disabled={barang.length === 0} // Disable if no items loaded
                >
                  <option value="">-- Pilih Barang --</option>
                  {barang.map((item) => (
                    <option key={item.kodeBarang} value={item.kodeBarang}>
                      {item.kodeBarang} - {item.namaBarang} (Stok: {item.stokBarang})
                    </option>
                  ))}
                </select>
                 {barang.length === 0 && <p className="text-sm text-red-500 mt-1">Memuat data barang atau tidak ada barang tersedia...</p>}
              </div>

              {/* Stok Display */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Stok Barang Saat Ini
                </label>
                <p className={`px-4 py-2 rounded-lg border ${stok === '-' ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 border-blue-200 text-blue-800 font-medium'}`}>
                  {stok}
                </p>
              </div>
              {/* Input Kurangi Stok */}
              <div>
                <label htmlFor="inputStok" className="block text-gray-700 mb-1 font-medium">
                  Jumlah Stok yang Dikurangi
                </label>
                <input
                  id="inputStok"
                  type="number"
                  value={inputStok}
                  onChange={(e) => setInputStok(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Masukkan jumlah positif, cth: 10"
                  min="1" // Add min attribute for basic browser validation
                  disabled={!selectedItem} // Disable if no item is selected
                />
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  onClick={handleAddRow}
                  className={`w-full py-3 text-white font-semibold rounded-lg transition duration-200 ${!selectedItem || !inputStok ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  disabled={!selectedItem || !inputStok} // Disable button based on state
                >
                  Tambah ke Tabel
                </button>
              </div>
            </div>
            {/* Table Section */}
             {rows.length > 0 && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-3">Barang yang Akan Dikurangi Stoknya</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                        <th className="p-3 border text-left">Kode Barang</th>
                        <th className="p-3 border text-left">Nama Barang</th>
                        <th className="p-3 border text-center">Stok Saat Ini</th>
                        <th className="p-3 border text-center bg-red-500">Stok Akan Dikurang</th>
                        <th className="p-3 border text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                        <tr key={index} className="border hover:bg-gray-50">
                            <td className="p-3 border">{row.kodeBarang}</td>
                            <td className="p-3 border">{row.namaBarang}</td>
                            <td className="p-3 border text-center">
                            {row.stokBarang}
                            </td>
                            <td className="p-3 border text-center font-semibold text-red-600">
                            -{row.inputStok}
                            </td>
                            <td className="p-3 border text-center">
                            <button
                                onClick={() => handleDeleteRow(index)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                title={`Hapus ${row.namaBarang} dari tabel`}
                            >
                                Hapus
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                 <div className="mt-6 text-center">
                    <button
                        onClick={handleSubmit}
                        className={`px-8 py-3 text-white font-semibold rounded-lg transition duration-200 ${rows.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={rows.length === 0}
                    >
                        Proses Pengurangan Stok ({rows.length} Item)
                    </button>
                    </div>
                </div>
            )}
          </>
        {/* )} */}
      </div>
    </div>
  );
};

export default HalamanPenguranganStokBarang;